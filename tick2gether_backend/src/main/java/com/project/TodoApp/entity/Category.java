package com.project.TodoApp.entity;

import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "categories", uniqueConstraints = @UniqueConstraint(columnNames = {"name", "user_id"}))
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Task> tasks = new HashSet<>();

    public Category() {}

    public Category(String name, Long categoryId, User user) {
        this.name = name;
        this.categoryId = categoryId;
        this.user = user;
    }
}
