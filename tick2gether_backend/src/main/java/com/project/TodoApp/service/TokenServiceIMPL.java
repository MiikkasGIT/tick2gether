package com.project.TodoApp.service;

import com.project.TodoApp.dto.ShareLinkDTO;
import com.project.TodoApp.service.interfaces.TokenService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TokenServiceIMPL implements TokenService {


    @Override
    public String generateTokenForTask(Long taskId, Long userId) {
        return "task:" + taskId + ":" + UUID.randomUUID() + ":" + userId;
    }

    @Override
    public ShareLinkDTO parseToken(String token) {
        String[] parts = token.split(":");

        if (parts.length != 4) {
            throw new IllegalArgumentException("Invalid token format");
        }

        ShareLinkDTO details = new ShareLinkDTO();
        String type = parts[0];
        Long id = Long.parseLong(parts[1]);
        Long userId = Long.parseLong(parts[3]);

        if ("category".equals(type)) {
            details.setCategoryId(id);
        } else if ("task".equals(type)) {
            details.setTaskId(id);
        } else {
            throw new IllegalArgumentException("Invalid token type");
        }

        details.setUserId(userId);
        return details;
    }
}
