package com.project.TodoApp.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class ShareLinkDTO {
    private Long categoryId;
    private Long taskId;
    private Long userId;
}