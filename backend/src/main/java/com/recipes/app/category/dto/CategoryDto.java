package com.recipes.app.category.dto;

import com.recipes.app.category.Category;

import java.util.UUID;

public record CategoryDto(UUID id, String name, String slug, String description, String imageUrl) {
    public static CategoryDto from(Category c) {
        return new CategoryDto(c.getId(), c.getName(), c.getSlug(), c.getDescription(), c.getImageUrl());
    }
}
