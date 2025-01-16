package com.project.TodoApp.controller;

import com.project.TodoApp.dto.CategoryDTO;
import com.project.TodoApp.service.interfaces.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/save")
    public ResponseEntity<CategoryDTO> saveCategory(@RequestBody CategoryDTO categoryDTO) {
        CategoryDTO savedCategory = categoryService.addCategory(categoryDTO);
        return ResponseEntity.ok(savedCategory);
    }

    @PostMapping("/update")
    public ResponseEntity<CategoryDTO> updateCategory(@RequestBody CategoryDTO categoryDTO) {
        CategoryDTO updatedCategory = categoryService.updateCategory(categoryDTO);
        return ResponseEntity.ok(updatedCategory);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByUserId(@PathVariable Long userId) {
        List<CategoryDTO> categories = categoryService.getCategoriesByUserId(userId);
        return ResponseEntity.ok(categories);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}