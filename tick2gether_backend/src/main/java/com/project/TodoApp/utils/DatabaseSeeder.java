package com.project.TodoApp.utils;

import com.project.TodoApp.entity.User;
import com.project.TodoApp.repo.UserRepo;
import com.project.TodoApp.service.interfaces.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepo.count() == 0) {
            User user1 = new User("f@e.com", passwordEncoder.encode("pw"));
            User user2 = new User("m@e.com", passwordEncoder.encode("pw"));

            userRepo.saveAll(Arrays.asList(user1, user2));

            for (User user : Arrays.asList(user1, user2)) {
                categoryService.createDefaultCategories(user);
            }
        }
    }
}
