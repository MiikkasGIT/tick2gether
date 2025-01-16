package com.project.TodoApp.controller;

import com.project.TodoApp.dto.TaskSaveDTO;
import com.project.TodoApp.dto.TaskDTO;
import com.project.TodoApp.service.interfaces.TaskService;
import com.project.TodoApp.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/task")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @PostMapping(path = "/save")
    public ResponseEntity<TaskDTO> saveTask(@RequestBody TaskSaveDTO taskSaveDTO) {
        TaskDTO savedTask = taskService.addTask(taskSaveDTO);
        return ResponseEntity.ok(savedTask);
    }

    @PostMapping(path = "/update")
    public ResponseEntity<TaskDTO> updateTask(@RequestBody TaskSaveDTO taskSaveDTO) {
        TaskDTO updatedTask = taskService.updateTask(taskSaveDTO);
        return ResponseEntity.ok(updatedTask);
    }

    @GetMapping(path = "/getTasks")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskDTO>> getTasksByUserId() {
        Long userId = userService.getCurrentUserId();
        List<TaskDTO> tasks = taskService.getTasksByUserId(userId);
        return ResponseEntity.ok(tasks);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable(value = "id") Long id) {
        boolean isDeleted = taskService.deleteTask(id);
        if (isDeleted) {
            return ResponseEntity.ok("Deleted");
        } else {
            return ResponseEntity.status(404).body("Task ID Not Found");
        }
    }

    @GetMapping(path = "/sharedUsers/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Long>> getSharedUsers(@PathVariable Long taskId) {
        List<Long> sharedUsers = taskService.getSharedUserIds(taskId);
        return ResponseEntity.ok(sharedUsers);
    }
}