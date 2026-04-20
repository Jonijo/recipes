package com.recipes.app.recipe.dto;

import com.recipes.app.category.dto.CategoryDto;
import com.recipes.app.recipe.AccessType;
import com.recipes.app.recipe.Recipe;

import java.util.UUID;

public record RecipeDetailDto(
        UUID id,
        String title,
        String slug,
        String shortDescription,
        String description,
        String ingredientsText,
        String stepsText,
        Integer prepTime,
        Integer cookTime,
        Integer servings,
        String difficulty,
        String imageUrl,
        AccessType accessType,
        boolean published,
        boolean featured,
        CategoryDto category
) {
    public static RecipeDetailDto from(Recipe r) {
        return new RecipeDetailDto(
                r.getId(),
                r.getTitle(),
                r.getSlug(),
                r.getShortDescription(),
                r.getDescription(),
                r.getIngredientsText(),
                r.getStepsText(),
                r.getPrepTime(),
                r.getCookTime(),
                r.getServings(),
                r.getDifficulty(),
                r.getImageUrl(),
                r.getAccessType(),
                r.isPublished(),
                r.isFeatured(),
                CategoryDto.from(r.getCategory())
        );
    }
}
