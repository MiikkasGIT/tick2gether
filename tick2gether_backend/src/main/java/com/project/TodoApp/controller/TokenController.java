package com.project.TodoApp.controller;

import com.project.TodoApp.dto.ShareLinkDTO;
import com.project.TodoApp.dto.ShareLinkResponseDTO;
import com.project.TodoApp.dto.TaskDTO;
import com.project.TodoApp.service.interfaces.TaskService;
import com.project.TodoApp.service.interfaces.TaskShareService;
import com.project.TodoApp.service.interfaces.TokenService;
import com.project.TodoApp.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/token")
public class TokenController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskShareService taskShareService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @PostMapping("/generateForTask")
    public ResponseEntity<ShareLinkResponseDTO> generateTokenForTask(@RequestParam Long taskId, @RequestParam Long userId) {
        String token = tokenService.generateTokenForTask(taskId, userId);
        ShareLinkResponseDTO response = new ShareLinkResponseDTO(token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/share/{token}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ShareLinkDTO> parseToken(@PathVariable String token) {
        ShareLinkDTO shareLinkDTO = tokenService.parseToken(token);
        Long currentUserId = userService.getCurrentUserId();
        List<Long> userIds = List.of(shareLinkDTO.getUserId(), currentUserId);

        if (shareLinkDTO.getTaskId() != null) {
            TaskDTO taskDTO = taskService.getTaskById(shareLinkDTO.getTaskId());
            if (taskDTO == null) {
                return ResponseEntity.notFound().build(); // Task not found
            }
            taskShareService.addSharedUsers(shareLinkDTO.getTaskId(), userIds);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(shareLinkDTO);
    }
}