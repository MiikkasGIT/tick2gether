package com.project.TodoApp.service;

import com.project.TodoApp.entity.Task;
import com.project.TodoApp.entity.TaskShare;
import com.project.TodoApp.entity.User;
import com.project.TodoApp.repo.TaskRepo;
import com.project.TodoApp.repo.TaskShareRepo;
import com.project.TodoApp.repo.UserRepo;
import com.project.TodoApp.service.interfaces.TaskShareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskShareServiceIMPL implements TaskShareService {

    @Autowired
    private TaskShareRepo taskShareRepo;

    @Autowired
    private TaskRepo taskRepo;

    @Autowired
    private UserRepo userRepo;

    @Override
    @Transactional
    public void addSharedUsers(Long taskId, List<Long> userIds) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        for (Long userId : userIds) {
            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!taskShareRepo.existsByTask_TaskIdAndUser_UserId(taskId, userId)) {
                TaskShare taskShare = new TaskShare();
                taskShare.setTask(task);
                taskShare.setUser(user);
                taskShareRepo.save(taskShare);
            }
        }
    }

}