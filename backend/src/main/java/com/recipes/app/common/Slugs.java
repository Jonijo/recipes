package com.recipes.app.common;

import java.text.Normalizer;
import java.util.function.Predicate;

public final class Slugs {

    private Slugs() {}

    public static String slugify(String input) {
        if (input == null) return "";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        String lower = normalized.toLowerCase();
        String dashed = lower.replaceAll("[^a-z0-9]+", "-");
        return dashed.replaceAll("^-+|-+$", "");
    }

    public static String unique(String base, Predicate<String> exists) {
        String candidate = base.isBlank() ? "item" : base;
        if (!exists.test(candidate)) return candidate;
        int i = 2;
        while (exists.test(candidate + "-" + i)) i++;
        return candidate + "-" + i;
    }
}
