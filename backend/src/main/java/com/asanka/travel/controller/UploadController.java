package com.asanka.travel.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

/** Image uploads for the admin panel. Files land on disk and are served from /uploads/**. */
@RestController
@RequestMapping("/api/admin")
public class UploadController {

    private static final List<String> ALLOWED = List.of("jpg", "jpeg", "png", "webp", "gif", "avif", "svg");

    private final Path root;

    public UploadController(@Value("${app.upload-dir:uploads}") String uploadDir) {
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostMapping("/upload")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose an image first.");
        }
        String original = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
        String ext = original.contains(".")
                ? original.substring(original.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT)
                : "jpg";
        if (!ALLOWED.contains(ext)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Use a JPG, PNG, WEBP, AVIF, GIF or SVG image.");
        }
        try {
            Files.createDirectories(root);
            String name = UUID.randomUUID() + "." + ext;
            Path target = root.resolve(name);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return Map.of("url", "/uploads/" + name, "name", name);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "The image could not be saved. Check the uploads folder permissions.");
        }
    }

    @DeleteMapping("/upload")
    public Map<String, String> remove(@RequestParam("url") String url) {
        if (url == null || !url.startsWith("/uploads/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only uploaded images can be deleted.");
        }
        try {
            Files.deleteIfExists(root.resolve(url.substring("/uploads/".length())));
        } catch (IOException ignored) {
            // the record is what matters; a stale file is harmless
        }
        return Map.of("message", "Image deleted.");
    }
}
