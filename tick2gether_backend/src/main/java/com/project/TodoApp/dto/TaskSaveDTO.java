package com.project.TodoApp.dto;

import java.util.Date;
import java.util.List;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class TaskSaveDTO {
    private Long taskId;
    private String text;
    private Date deadline;
    private Date planDate;
    private Long userId;
    private Long categoryId;
    private Boolean completed;
    private List<Long> sharedUserIds;
}
