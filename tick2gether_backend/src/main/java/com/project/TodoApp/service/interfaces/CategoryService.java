package com.project.TodoApp.service.interfaces;

import com.project.TodoApp.dto.CategoryDTO;
import com.project.TodoApp.entity.User;

import java.util.List;

public interface CategoryService {

    CategoryDTO addCategory(CategoryDTO categoryDTO);

    List<CategoryDTO> getCategoriesByUserId(Long userId);

    void deleteCategory(Long categoryId);

    CategoryDTO updateCategory(CategoryDTO categoryDTO);

    Long generateCategoryId(User user);

    void createDefaultCategories(User user);
}
