package com.project.TodoApp.service.interfaces;

import com.project.TodoApp.dto.TaskDTO;
import com.project.TodoApp.dto.TaskSaveDTO;

import java.util.List;

public interface TaskService {

    TaskDTO addTask(TaskSaveDTO taskSaveDTO);

    TaskDTO updateTask(TaskSaveDTO taskSaveDTO);

    boolean deleteTask(Long id);

    List<TaskDTO> getTasksByUserId(Long userId);

    List<Long> getSharedUserIds(Long taskId);

    TaskDTO getTaskById(Long taskId);

    List<TaskDTO> getAllTasks();
}
