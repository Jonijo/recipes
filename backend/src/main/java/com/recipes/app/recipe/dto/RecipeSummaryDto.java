package com.recipes.app.recipe.dto;

import com.recipes.app.category.dto.CategoryDto;
import com.recipes.app.recipe.AccessType;
import com.recipes.app.recipe.Recipe;

import java.util.UUID;

public record RecipeSummaryDto(
        UUID id,
        String title,
        String slug,
        String shortDescription,
        String imageUrl,
        AccessType accessType,
        boolean published,
        boolean featured,
        CategoryDto category
) {
    public static RecipeSummaryDto from(Recipe r) {
        return new RecipeSummaryDto(
                r.getId(),
                r.getTitle(),
                r.getSlug(),
                r.getShortDescription(),
                r.getImageUrl(),
                r.getAccessType(),
                r.isPublished(),
                r.isFeatured(),
                CategoryDto.from(r.getCategory())
        );
    }
}
