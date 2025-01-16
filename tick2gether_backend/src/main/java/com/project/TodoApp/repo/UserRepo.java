package com.project.TodoApp.repo;

import com.project.TodoApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import org.springframework.stereotype.Repository;


@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findUserByEmail(String email);
}