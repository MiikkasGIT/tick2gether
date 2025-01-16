package com.project.TodoApp.service.interfaces;

import com.project.TodoApp.dto.ShareLinkDTO;

public interface TokenService {

    String generateTokenForTask(Long taskId, Long userId);
    ShareLinkDTO parseToken(String token);
}
