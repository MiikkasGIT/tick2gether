package com.project.TodoApp.controller;

import com.project.TodoApp.repo.UserRepo;
import com.project.TodoApp.dto.UserDTO;
import com.project.TodoApp.dto.UserSaveDTO;
import com.project.TodoApp.dto.UserUpdateDTO;
import com.project.TodoApp.entity.User;
import com.project.TodoApp.service.interfaces.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("api/v1/user")
public class UserController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserService userService;

    @PostMapping(path = "save")
    public User saveUser(@RequestBody UserSaveDTO userSaveDTO) {
        return userService.addUser(userSaveDTO);
    }

    @GetMapping(path = "/getAllUsers")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping(path = "/update")
    public User updateUser(@RequestBody UserUpdateDTO userUpdateDTO) {
        return userService.updateUser(userUpdateDTO);
    }

    @DeleteMapping(path = "/deleteuser/{id}")
    public String deleteUser(@PathVariable(value = "id") Long id) {
        boolean deleteUser = userService.deleteUser(id);
        return deleteUser ? "Deleted" : "User ID Not Found";
    }

    @GetMapping(path = "/{userId}")
    public User fetchUser(@PathVariable Long userId) {
        return userService.getUser(userId);
    }

    @GetMapping(path = "/useridByEmail")
    public ResponseEntity<Long> getUserIdByEmail(@RequestParam String email) {
        User user = userRepo.findUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return ResponseEntity.ok(user.getUserId());
    }
}