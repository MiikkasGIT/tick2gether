package com.project.TodoApp.service.interfaces;

import com.project.TodoApp.dto.UserDTO;
import com.project.TodoApp.dto.UserSaveDTO;
import com.project.TodoApp.dto.UserUpdateDTO;
import com.project.TodoApp.entity.User;

import java.util.List;

public interface UserService {
    User addUser(UserSaveDTO userSaveDTO);
    List<UserDTO> getAllUsers();
    User updateUser(UserUpdateDTO userUpdateDTO);
    boolean deleteUser(Long id);
    User getUser(long userId);
    User findUserByEmail(String email);
    Long getCurrentUserId();

    Long getUserIdByEmail(String email);
    User getCurrentUser();
}
