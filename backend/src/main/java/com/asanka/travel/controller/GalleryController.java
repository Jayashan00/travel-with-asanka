package com.asanka.travel.controller;

import com.asanka.travel.model.GalleryImage;
import com.asanka.travel.repo.GalleryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GalleryController {

    private final GalleryRepository repo;

    public GalleryController(GalleryRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/gallery")
    public List<GalleryImage> list() {
        return repo.findByActiveTrueOrderBySortOrderAsc();
    }

    @GetMapping("/admin/gallery")
    public List<GalleryImage> listAll() {
        return repo.findAll();
    }

    @PostMapping("/admin/gallery")
    public GalleryImage create(@RequestBody GalleryImage image) {
        image.setId(null);
        return repo.save(image);
    }

    @PutMapping("/admin/gallery/{id}")
    public GalleryImage update(@PathVariable String id, @RequestBody GalleryImage image) {
        GalleryImage existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That photo no longer exists."));
        image.setId(existing.getId());
        image.setCreatedAt(existing.getCreatedAt());
        return repo.save(image);
    }

    @DeleteMapping("/admin/gallery/{id}")
    public Map<String, String> delete(@PathVariable String id) {
        repo.deleteById(id);
        return Map.of("message", "Photo removed.");
    }
}
