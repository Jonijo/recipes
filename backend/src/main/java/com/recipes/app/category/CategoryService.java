package com.recipes.app.category;

import com.recipes.app.category.dto.CategoryDto;
import com.recipes.app.category.dto.CategoryRequest;
import com.recipes.app.common.Slugs;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    private final CategoryRepository repo;

    public CategoryService(CategoryRepository repo) {
        this.repo = repo;
    }

    public List<CategoryDto> list() {
        return repo.findAll().stream().map(CategoryDto::from).sorted((a, b) -> a.name().compareToIgnoreCase(b.name())).toList();
    }

    public CategoryDto getBySlug(String slug) {
        return CategoryDto.from(findBySlug(slug));
    }

    public Category findBySlug(String slug) {
        return repo.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    public CategoryDto create(CategoryRequest req) {
        Category c = Category.builder()
                .name(req.name())
                .slug(Slugs.unique(Slugs.slugify(req.name()), repo::existsBySlugIgnoreCase))
                .description(req.description())
                .imageUrl(req.imageUrl())
                .build();
        return CategoryDto.from(repo.save(c));
    }

    public CategoryDto update(UUID id, CategoryRequest req) {
        Category c = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        if (!c.getName().equalsIgnoreCase(req.name())) {
            c.setName(req.name());
            String base = Slugs.slugify(req.name());
            if (!base.equalsIgnoreCase(c.getSlug())) {
                c.setSlug(Slugs.unique(base, s -> !s.equalsIgnoreCase(c.getSlug()) && repo.existsBySlugIgnoreCase(s)));
            }
        }
        c.setDescription(req.description());
        c.setImageUrl(req.imageUrl());
        return CategoryDto.from(repo.save(c));
    }

    public void delete(UUID id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }
        try {
            repo.deleteById(id);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category has recipes — delete or reassign them first");
        }
    }
}
