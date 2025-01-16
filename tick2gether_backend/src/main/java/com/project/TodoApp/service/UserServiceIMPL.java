package com.project.TodoApp.service;

import com.project.TodoApp.dto.UserDTO;
import com.project.TodoApp.dto.UserSaveDTO;
import com.project.TodoApp.dto.UserUpdateDTO;
import com.project.TodoApp.entity.User;
import com.project.TodoApp.repo.UserRepo;
import com.project.TodoApp.service.interfaces.CategoryService;
import com.project.TodoApp.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Primary
public class UserServiceIMPL implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CategoryService categoryService;

    @Override
    public User addUser(UserSaveDTO userSaveDTO) {
        User user = new User(userSaveDTO.getEmail(), userSaveDTO.getPassword());
        userRepo.save(user);
        return user;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> getUsers = userRepo.findAll();
        List<UserDTO> userDTOList = new ArrayList<>();
        for (User e : getUsers) {
            UserDTO userDTO = new UserDTO(e.getUserId(), e.getEmail(), e.getPassword());
            userDTOList.add(userDTO);
        }
        return userDTOList;
    }

    @Override
    public User updateUser(UserUpdateDTO userUpdateDTO) {
        if (userRepo.existsById(userUpdateDTO.getUserId())) {
            User user = userRepo.findById(userUpdateDTO.getUserId()).orElse(null);
            if (user != null) {
                user.setEmail(userUpdateDTO.getEmail());
                user.setPassword(userUpdateDTO.getPassword());
                userRepo.save(user);
                return user;
            }
        }
        return null;
    }

    @Override
    public boolean deleteUser(Long id) {
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public User getUser(long userId) {
        return userRepo.findById(userId).orElse(null);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepo.findUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Override
    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();

        Optional<User> optionalUser = userRepo.findUserByEmail(email);
        User user = optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return user.getUserId();
    }

    @Override
    public Long getUserIdByEmail(String email) {
        User user = findUserByEmail(email);
        return user.getUserId();
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();

        return userRepo.findUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
