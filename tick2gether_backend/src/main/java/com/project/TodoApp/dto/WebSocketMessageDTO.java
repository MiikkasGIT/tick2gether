package com.project.TodoApp.dto;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessageDTO {
    private String type;
    private Long taskId;
    private Long categoryId;
    private Long userId;
    private String name;
    private String message;
    private List<Long> sharedUserIds;
}
