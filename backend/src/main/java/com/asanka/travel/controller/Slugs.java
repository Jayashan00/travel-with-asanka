package com.asanka.travel.controller;

import java.text.Normalizer;
import java.util.Locale;

final class Slugs {
    private Slugs() {
    }

    static String of(String input) {
        if (input == null || input.isBlank()) {
            return "item-" + System.currentTimeMillis();
        }
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        String slug = normalized.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return slug.isBlank() ? "item-" + System.currentTimeMillis() : slug;
    }
}
