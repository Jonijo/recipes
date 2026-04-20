package com.recipes.app.recipe;

import com.recipes.app.category.Category;
import com.recipes.app.category.CategoryRepository;
import com.recipes.app.common.Slugs;
import com.recipes.app.recipe.dto.RecipeDetailDto;
import com.recipes.app.recipe.dto.RecipeRequest;
import com.recipes.app.recipe.dto.RecipeSummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class RecipeService {

    private final RecipeRepository recipes;
    private final CategoryRepository categories;

    public RecipeService(RecipeRepository recipes, CategoryRepository categories) {
        this.recipes = recipes;
        this.categories = categories;
    }

    public Page<RecipeSummaryDto> listPublic(String q, String categorySlug, Boolean featured, Pageable pageable) {
        Specification<Recipe> spec = combine(
                RecipeSpecs.published(),
                RecipeSpecs.matchesQuery(q),
                RecipeSpecs.inCategorySlug(categorySlug),
                Boolean.TRUE.equals(featured) ? RecipeSpecs.featured() : null
        );
        return recipes.findAll(spec, pageable).map(RecipeSummaryDto::from);
    }

    public Page<RecipeSummaryDto> listAdmin(String q, String categorySlug, Pageable pageable) {
        Specification<Recipe> spec = combine(
                RecipeSpecs.matchesQuery(q),
                RecipeSpecs.inCategorySlug(categorySlug)
        );
        return recipes.findAll(spec, pageable).map(RecipeSummaryDto::from);
    }

    public RecipeDetailDto getPublicBySlug(String slug) {
        Recipe r = findBySlug(slug);
        if (!r.isPublished()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found");
        }
        return RecipeDetailDto.from(r);
    }

    public RecipeDetailDto getAdminById(UUID id) {
        return RecipeDetailDto.from(findById(id));
    }

    public RecipeDetailDto create(RecipeRequest req) {
        Category category = categories.findById(req.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown category"));

        Recipe r = Recipe.builder()
                .title(req.title())
                .slug(Slugs.unique(Slugs.slugify(req.title()), recipes::existsBySlugIgnoreCase))
                .shortDescription(req.shortDescription())
                .description(req.description())
                .ingredientsText(req.ingredientsText())
                .stepsText(req.stepsText())
                .prepTime(req.prepTime())
                .cookTime(req.cookTime())
                .servings(req.servings())
                .difficulty(req.difficulty())
                .category(category)
                .accessType(req.accessType())
                .featured(req.featured())
                .imageUrl(req.imageUrl())
                .published(false)
                .build();

        return RecipeDetailDto.from(recipes.save(r));
    }

    public RecipeDetailDto update(UUID id, RecipeRequest req) {
        Recipe r = findById(id);

        if (!r.getTitle().equalsIgnoreCase(req.title())) {
            r.setTitle(req.title());
            String base = Slugs.slugify(req.title());
            if (!base.equalsIgnoreCase(r.getSlug())) {
                final String currentSlug = r.getSlug();
                r.setSlug(Slugs.unique(base, s -> !s.equalsIgnoreCase(currentSlug) && recipes.existsBySlugIgnoreCase(s)));
            }
        }

        if (!r.getCategory().getId().equals(req.categoryId())) {
            Category category = categories.findById(req.categoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown category"));
            r.setCategory(category);
        }

        r.setShortDescription(req.shortDescription());
        r.setDescription(req.description());
        r.setIngredientsText(req.ingredientsText());
        r.setStepsText(req.stepsText());
        r.setPrepTime(req.prepTime());
        r.setCookTime(req.cookTime());
        r.setServings(req.servings());
        r.setDifficulty(req.difficulty());
        r.setAccessType(req.accessType());
        r.setFeatured(req.featured());
        r.setImageUrl(req.imageUrl());

        return RecipeDetailDto.from(recipes.save(r));
    }

    public RecipeDetailDto setPublished(UUID id, boolean value) {
        Recipe r = findById(id);
        r.setPublished(value);
        return RecipeDetailDto.from(recipes.save(r));
    }

    public void delete(UUID id) {
        if (!recipes.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found");
        }
        recipes.deleteById(id);
    }

    private Recipe findById(UUID id) {
        return recipes.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found"));
    }

    private Recipe findBySlug(String slug) {
        return recipes.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found"));
    }

    @SafeVarargs
    private static Specification<Recipe> combine(Specification<Recipe>... specs) {
        List<Specification<Recipe>> list = new ArrayList<>();
        for (Specification<Recipe> s : specs) if (s != null) list.add(s);
        if (list.isEmpty()) return Specification.where(null);
        Specification<Recipe> result = list.get(0);
        for (int i = 1; i < list.size(); i++) result = result.and(list.get(i));
        return result;
    }

    public static Sort defaultSort() {
        return Sort.by(Sort.Direction.DESC, "createdAt");
    }
}
