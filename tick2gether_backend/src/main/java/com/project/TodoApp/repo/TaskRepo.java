package com.project.TodoApp.repo;

import com.project.TodoApp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepo extends JpaRepository<Task, Long> {
    List<Task> findByUser_UserId(Long userId);
    List<Task> findAllByCategory_CategoryId(Long categoryId);
}
