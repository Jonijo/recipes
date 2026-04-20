package com.recipes.app.recipe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface RecipeRepository extends JpaRepository<Recipe, UUID>, JpaSpecificationExecutor<Recipe> {

    Optional<Recipe> findBySlugIgnoreCase(String slug);

    boolean existsBySlugIgnoreCase(String slug);

    long countByPublishedTrue();
}
