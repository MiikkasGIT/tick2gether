package com.project.TodoApp.repo;

import com.project.TodoApp.entity.Category;
import com.project.TodoApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoryRepo extends JpaRepository<Category, Long> {
    List<Category> findByUser_UserId(Long userId);

    Category findByNameAndUser(String name, User user);

    @Query("SELECT COALESCE(MAX(c.id), 0) FROM Category c WHERE c.user = :user")
    Long findMaxCategoryIdByUser(@Param("user") User user);

}
