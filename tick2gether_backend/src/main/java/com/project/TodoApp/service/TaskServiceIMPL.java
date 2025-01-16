package com.project.TodoApp.service;

import com.project.TodoApp.dto.TaskDTO;
import com.project.TodoApp.dto.TaskSaveDTO;
import com.project.TodoApp.dto.WebSocketMessageDTO;
import com.project.TodoApp.entity.*;
import com.project.TodoApp.exception.CustomExceptions;
import com.project.TodoApp.repo.*;
import com.project.TodoApp.service.interfaces.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TaskServiceIMPL implements TaskService {

    @Autowired
    private TaskRepo taskRepository;

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private CategoryRepo categoryRepository;

    @Autowired
    private TaskShareRepo taskShareRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public TaskDTO addTask(TaskSaveDTO taskSaveDTO) {
        User user = fetchUser(taskSaveDTO.getUserId());
        Category category = fetchCategory(taskSaveDTO.getCategoryId());

        Task task = createAndSaveTask(taskSaveDTO, user, category);

        shareTaskWithUsers(task, taskSaveDTO.getSharedUserIds());

        TaskDTO taskDTO = convertToDTO(task);
        taskDTO.setType("TASK_UPDATE");
        taskDTO.setCategoryId(taskSaveDTO.getCategoryId());

        notifyUsersOfTaskUpdate(taskDTO, taskSaveDTO.getSharedUserIds(), false);
        return taskDTO;
    }

    @Override
    @Transactional
    public TaskDTO updateTask(TaskSaveDTO taskSaveDTO) {
        Task task = taskRepository.findById(taskSaveDTO.getTaskId())
                .orElseThrow(() -> new CustomExceptions.TaskNotFoundException(taskSaveDTO.getTaskId()));

        Category category = fetchCategory(taskSaveDTO.getCategoryId());

        updateTaskDetails(task, taskSaveDTO, category);

        task = taskRepository.save(task);

        TaskDTO updatedTaskDTO = convertToDTO(task);
        updatedTaskDTO.setCategoryId(taskSaveDTO.getCategoryId());
        updatedTaskDTO.setType("TASK_UPDATE");

        notifyUsersOfTaskUpdate(updatedTaskDTO, taskSaveDTO.getSharedUserIds(), false);

        return updatedTaskDTO;
    }

    @Override
    @Transactional
    public boolean deleteTask(Long id) {
        try {
            Task task = taskRepository.findById(id)
                    .orElseThrow(() -> new CustomExceptions.TaskNotFoundException(id));

            List<Long> userIds = taskShareRepository.findAllByTask_TaskId(id).stream()
                    .map(taskShare -> taskShare.getUser().getUserId())
                    .collect(Collectors.toList());

            taskShareRepository.deleteAllByTask_TaskId(id);
            taskRepository.deleteById(id);

            notifyUsersOfTaskUpdate(convertToDTO(task), userIds, true);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public List<TaskDTO> getTasksByUserId(Long userId) {
        List<Task> tasks = taskRepository.findByUser_UserId(userId);
        List<Task> sharedTasks = taskShareRepository.findAllByUser_UserId(userId).stream()
                .map(TaskShare::getTask)
                .filter(task -> !tasks.contains(task))
                .collect(Collectors.toList());

        tasks.addAll(sharedTasks);
        return tasks.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new CustomExceptions.TaskNotFoundException(taskId));
        return convertToDTO(task);
    }

    private User fetchUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException(userId));
    }

    private Task createAndSaveTask(TaskSaveDTO taskSaveDTO, User user, Category category) {
        Task task = new Task(
                taskSaveDTO.getText(),
                taskSaveDTO.getDeadline(),
                taskSaveDTO.getPlanDate(),
                user,
                category
        );
        return taskRepository.save(task);
    }

    private void shareTaskWithUsers(Task task, List<Long> sharedUserIds) {
        if (sharedUserIds != null && !sharedUserIds.isEmpty()) {
            sharedUserIds.forEach(userId -> {
                User sharedUser = fetchUser(userId);
                TaskShare taskShare = new TaskShare(task, sharedUser);
                taskShareRepository.save(taskShare);
            });
        }
    }

    private void notifyUsersOfTaskUpdate(TaskDTO taskDTO, List<Long> userIds, boolean isDeleted) {
        if (taskDTO == null) {
            return;
        }

        if (userIds == null) {
            userIds = List.of();
        }

        List<TaskShare> shares = taskShareRepository.findAllByTask_TaskId(taskDTO.getTaskId());

        for (TaskShare share : shares) {
            Long userId = share.getUser().getUserId();

            if (userIds.contains(userId)) {
                WebSocketMessageDTO message = new WebSocketMessageDTO();
                message.setType("TASK_UPDATE");
                message.setTaskId(taskDTO.getTaskId());
                message.setUserId(userId);
                message.setCategoryId(taskDTO.getCategoryId());
                message.setSharedUserIds(taskDTO.getSharedUserIds());
                message.setMessage(isDeleted ? "Task deleted successfully" : "Task updated successfully");

                String destination = "/user/" + userId + "/queue/tasks";
                messagingTemplate.convertAndSend(destination, message);
            }
        }
    }

    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO();

        dto.setTaskId(task.getTaskId());
        dto.setText(task.getText());
        dto.setDeadline(task.getDeadline());
        dto.setPlanDate(task.getPlanDate());
        dto.setCategoryId(task.getCategory() != null ? task.getCategory().getCategoryId() : null);
        dto.setCompleted(task.isCompleted());
        dto.setUserId(task.getUser() != null ? task.getUser().getUserId() : null);
        dto.setSharedUserIds(task.getSharedUserIds());

        return dto;
    }

    private Category fetchCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CustomExceptions.CategoryNotFoundException(categoryId));
    }

    private void updateTaskDetails(Task task, TaskSaveDTO taskSaveDTO, Category category) {
        task.setText(taskSaveDTO.getText());
        task.setDeadline(taskSaveDTO.getDeadline());
        task.setPlanDate(taskSaveDTO.getPlanDate());
        task.setCompleted(taskSaveDTO.getCompleted());
        task.setCategory(category);

        if (taskSaveDTO.getSharedUserIds() != null) {
            Set<User> sharedUsers = taskSaveDTO.getSharedUserIds().stream()
                    .map(userId -> userRepository.findById(userId)
                            .orElseThrow(() -> new CustomExceptions.UserNotFoundException(userId)))
                    .collect(Collectors.toSet());
            task.setSharedUsers(sharedUsers);
        }
    }

    @Override
    @Transactional
    public List<Long> getSharedUserIds(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new CustomExceptions.TaskNotFoundException(taskId));

        return task.getSharedUserIds();
    }
}
