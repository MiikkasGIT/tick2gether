package com.project.TodoApp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    private String password;

    @JsonIgnore
    private String initials;

    public User() {}

    public User(String email, String password) {
        this.email = email;
        this.password = password;
        this.initials = generateInitials(email);
    }

    public User(Long userId, String email, String password) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.initials = generateInitials(email);
    }

    private String generateInitials(String email) {
        if (email == null || email.isEmpty()) {
            return "";
        }
        String[] parts = email.split("@")[0].split("\\.");
        StringBuilder initials = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                initials.append(part.charAt(0));
            }
        }
        return initials.toString().toUpperCase();
    }
}