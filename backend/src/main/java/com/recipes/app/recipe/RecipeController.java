package com.recipes.app.recipe;

import com.recipes.app.recipe.dto.RecipeDetailDto;
import com.recipes.app.recipe.dto.RecipeRequest;
import com.recipes.app.recipe.dto.RecipeSummaryDto;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class RecipeController {

    private final RecipeService service;

    public RecipeController(RecipeService service) {
        this.service = service;
    }

    @GetMapping("/recipes")
    public Page<RecipeSummaryDto> listPublic(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 50), RecipeService.defaultSort());
        return service.listPublic(q, category, featured, pageable);
    }

    @GetMapping("/recipes/{slug}")
    public RecipeDetailDto getPublicBySlug(@PathVariable String slug) {
        return service.getPublicBySlug(slug);
    }

    @GetMapping("/admin/recipes")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<RecipeSummaryDto> listAdmin(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), RecipeService.defaultSort());
        return service.listAdmin(q, category, pageable);
    }

    @GetMapping("/admin/recipes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public RecipeDetailDto getAdminById(@PathVariable UUID id) {
        return service.getAdminById(id);
    }

    @PostMapping("/admin/recipes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RecipeDetailDto> create(@Valid @RequestBody RecipeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/admin/recipes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public RecipeDetailDto update(@PathVariable UUID id, @Valid @RequestBody RecipeRequest req) {
        return service.update(id, req);
    }

    @PostMapping("/admin/recipes/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public RecipeDetailDto publish(@PathVariable UUID id) {
        return service.setPublished(id, true);
    }

    @PostMapping("/admin/recipes/{id}/unpublish")
    @PreAuthorize("hasRole('ADMIN')")
    public RecipeDetailDto unpublish(@PathVariable UUID id) {
        return service.setPublished(id, false);
    }

    @DeleteMapping("/admin/recipes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
