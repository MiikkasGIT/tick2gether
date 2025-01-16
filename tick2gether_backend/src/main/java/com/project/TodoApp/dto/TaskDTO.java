package com.project.TodoApp.dto;

import java.util.Date;
import java.util.List;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class TaskDTO {
    private Long userId;
    private Long taskId;
    private String text;
    private Date deadline;
    private Date planDate;
    private Long categoryId;
    private Boolean completed;
    private List<Long> sharedUserIds;
    private String type;

    public TaskDTO(Long userId, Long taskId, String text, Date deadline, Date planDate, Long categoryId, Boolean completed) {
        this.userId = userId;
        this.taskId = taskId;
        this.text = text;
        this.deadline = deadline;
        this.planDate = planDate;
        this.categoryId = categoryId;
        this.completed = completed;
        this.type = "TASK_UPDATE"; // Setzen Sie den Standardtyp auf TASK_UPDATE
    }

}
