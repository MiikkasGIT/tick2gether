package com.project.TodoApp.controller;

import com.project.TodoApp.dto.UserSaveDTO;
import com.project.TodoApp.entity.User;
import com.project.TodoApp.repo.UserRepo;
import com.project.TodoApp.security.JwtTokenProvider;
import com.project.TodoApp.service.interfaces.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserSaveDTO authRequest) {
        Optional<User> userOptional = userRepo.findUserByEmail(authRequest.getEmail());

        if (userOptional.isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setEmail(authRequest.getEmail());
        user.setPassword(passwordEncoder.encode(authRequest.getPassword()));

        User created = userRepo.save(user);
        categoryService.createDefaultCategories(created);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserSaveDTO authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
                )
        );
        String token = jwtTokenProvider.generateToken(authentication);
        return ResponseEntity.ok(token);
    }

    @GetMapping("/email")
    public ResponseEntity<String> getUserId(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(userDetails.getUsername());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();

        Cookie cookie = new Cookie("jwtToken", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }
}