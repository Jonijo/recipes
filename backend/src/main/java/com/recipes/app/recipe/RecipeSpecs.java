package com.recipes.app.recipe;

import org.springframework.data.jpa.domain.Specification;

public final class RecipeSpecs {

    private RecipeSpecs() {}

    public static Specification<Recipe> published() {
        return (root, q, cb) -> cb.isTrue(root.get("published"));
    }

    public static Specification<Recipe> featured() {
        return (root, q, cb) -> cb.isTrue(root.get("featured"));
    }

    public static Specification<Recipe> inCategorySlug(String slug) {
        if (slug == null || slug.isBlank()) return null;
        return (root, q, cb) -> cb.equal(cb.lower(root.get("category").get("slug")), slug.toLowerCase());
    }

    public static Specification<Recipe> matchesQuery(String search) {
        if (search == null || search.isBlank()) return null;
        String like = "%" + search.toLowerCase() + "%";
        return (root, q, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), like),
                cb.like(cb.lower(cb.coalesce(root.get("shortDescription"), "")), like)
        );
    }
}
