package com.project.TodoApp.repo;

import com.project.TodoApp.entity.Task;
import com.project.TodoApp.entity.TaskShare;
import com.project.TodoApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskShareRepo extends JpaRepository<TaskShare, Long> {

    List<TaskShare> findAllByUser_UserId(Long userId);

    boolean existsByTask_TaskIdAndUser_UserId(Long taskId, Long userId);

    boolean existsByTaskAndUser(Task task, User user);
    void deleteAllByTask_TaskId(Long id);

    List<TaskShare> findAllByTask_TaskId(Long taskId);
}
