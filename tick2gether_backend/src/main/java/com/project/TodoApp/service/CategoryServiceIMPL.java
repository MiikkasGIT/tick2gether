package com.project.TodoApp.service;

import com.project.TodoApp.dto.CategoryDTO;
import com.project.TodoApp.entity.Category;
import com.project.TodoApp.entity.Task;
import com.project.TodoApp.entity.User;
import com.project.TodoApp.repo.CategoryRepo;
import com.project.TodoApp.repo.TaskRepo;
import com.project.TodoApp.repo.UserRepo;
import com.project.TodoApp.service.interfaces.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryServiceIMPL implements CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TaskRepo taskRepo;

    @Override
    public CategoryDTO addCategory(CategoryDTO categoryDTO) {
        User user = userRepo.findById(categoryDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long categoryId = generateCategoryId(user);

        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setUser(user);
        category.setCategoryId(categoryId);

        Category savedCategory = categoryRepo.save(category);
        return convertToDTO(savedCategory);
    }

    @Override
    public List<CategoryDTO> getCategoriesByUserId(Long userId) {
        List<Category> categories = categoryRepo.findByUser_UserId(userId);

        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        List<Task> tasks = taskRepo.findAllByCategory_CategoryId(categoryId);
        taskRepo.deleteAll(tasks);
        categoryRepo.delete(category);
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(CategoryDTO categoryDTO) {
        User user = userRepo.findById(categoryDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = convertToEntity(categoryDTO);
        category.setUser(user);
        Category updatedCategory = categoryRepo.save(category);

        return convertToDTO(updatedCategory);
    }

    private Category convertToEntity(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setCategoryId(categoryDTO.getCategoryId());
        category.setName(categoryDTO.getName());
        return category;
    }

    @Override
    public Long generateCategoryId(User user) {
        Long maxCategoryId = categoryRepo.findMaxCategoryIdByUser(user);
        return (maxCategoryId != null ? maxCategoryId + 1 : 1);
    }

    @Override
    public void createDefaultCategories(User user) {
        Map<String, Long> defaultCategories = Map.of(
                "All Tasks", 1L,
                "Today", 2L,
                "Planned", 3L,
                "Any Time", 4L,
                "Work", 5L,
                "Personal", 6L,
                "Logbook", 7L
        );

        defaultCategories.forEach((name, id) -> {
            if (categoryRepo.findByNameAndUser(name, user) == null) {
                Category category = new Category(name, id, user);
                categoryRepo.save(category);
            }
        });
    }

    private CategoryDTO convertToDTO(Category category) {
        return new CategoryDTO(category.getCategoryId(), category.getName(), category.getUser().getUserId());
    }
}
