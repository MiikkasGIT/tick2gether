package com.project.TodoApp.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "task_share")
public class TaskShare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public TaskShare() {}

    public TaskShare(Task task, User user) {
        this.task = task;
        this.user = user;
    }
}
