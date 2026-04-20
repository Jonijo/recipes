package com.recipes.app.recipe.dto;

import com.recipes.app.recipe.AccessType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RecipeRequest(
        @NotBlank @Size(max = 255) String title,
        @Size(max = 500) String shortDescription,
        String description,
        String ingredientsText,
        String stepsText,
        @PositiveOrZero Integer prepTime,
        @PositiveOrZero Integer cookTime,
        @PositiveOrZero Integer servings,
        @Size(max = 16) String difficulty,
        @NotNull UUID categoryId,
        @NotNull AccessType accessType,
        boolean featured,
        @Size(max = 1024) String imageUrl
) {}
