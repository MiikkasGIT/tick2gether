package com.project.TodoApp.entity;

import com.project.TodoApp.exception.CustomExceptions;
import com.project.TodoApp.repo.CategoryRepo;
import com.project.TodoApp.repo.UserRepo;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.*;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long taskId;

    @Column(name = "text", length = 100, nullable = false)
    private String text;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "completed")
    private Boolean completed;

    @Column(name = "deadline")
    @Temporal(TemporalType.TIMESTAMP)
    private Date deadline;

    @Column(name = "plan_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date planDate;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskShare> taskShares = new ArrayList<>();

    // Default constructor
    public Task() {}

    // Constructor with parameters
    public Task(String text, Date deadline, Date planDate, User user, Category category) {
        this.text = text;
        this.deadline = deadline;
        this.planDate = planDate;
        this.user = user;
        this.category = category;
        this.completed = false; // Set default value
    }

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Task task = (Task) o;
        return Objects.equals(taskId, task.taskId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(taskId);
    }

    public List<Long> getSharedUserIds() {
        return taskShares.stream()
                .map(taskShare -> taskShare.getUser().getUserId())
                .collect(Collectors.toList());
    }

    public boolean isCompleted() {
        return Boolean.TRUE.equals(completed);
    }

    public void setSharedUsers(Set<User> sharedUsers) {
        this.taskShares.clear(); // Remove existing TaskShares

        if (sharedUsers != null) {
            for (User user : sharedUsers) {
                TaskShare taskShare = new TaskShare(this, user);
                this.taskShares.add(taskShare);
            }
        }
    }
}
