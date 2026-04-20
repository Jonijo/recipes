package com.recipes.app.admin;

import com.recipes.app.category.CategoryRepository;
import com.recipes.app.recipe.RecipeRepository;
import com.recipes.app.user.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CategoryRepository categories;
    private final RecipeRepository recipes;
    private final UserRepository users;

    public AdminController(CategoryRepository categories, RecipeRepository recipes, UserRepository users) {
        this.categories = categories;
        this.recipes = recipes;
        this.users = users;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> stats() {
        return Map.of(
                "categoriesCount", categories.count(),
                "recipesCount", recipes.count(),
                "publishedCount", recipes.countByPublishedTrue(),
                "usersCount", users.count()
        );
    }
}
