package com.project.TodoApp.exception;

public class CustomExceptions {

    public static class TaskNotFoundException extends RuntimeException {
        public TaskNotFoundException(Long taskId) {
            super("Task not found with ID: " + taskId);
        }
    }

    public static class CategoryNotFoundException extends RuntimeException {
        public CategoryNotFoundException(Long categoryId) {
            super("Category not found with ID: " + categoryId);
        }
    }

    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(Long userId) {
            super("User not found with ID: " + userId);
        }
    }
}
