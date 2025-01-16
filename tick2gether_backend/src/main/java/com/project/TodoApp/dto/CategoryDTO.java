package com.project.TodoApp.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class CategoryDTO {
    private Long categoryId;
    private String name;
    private Long userId;
}
