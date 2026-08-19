package com.asanka.travel.controller;

import com.asanka.travel.model.Tour;
import com.asanka.travel.repo.TourRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TourController {

    private final TourRepository repo;

    public TourController(TourRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/tours")
    public List<Tour> list() {
        return repo.findByActiveTrueOrderBySortOrderAsc();
    }

    @GetMapping("/tours/{slug}")
    public Tour one(@PathVariable String slug) {
        return repo.findBySlug(slug)
                .or(() -> repo.findById(slug))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That tour is no longer listed."));
    }

    @GetMapping("/admin/tours")
    public List<Tour> listAll() {
        return repo.findAll();
    }

    @PostMapping("/admin/tours")
    public Tour create(@RequestBody Tour tour) {
        tour.setId(null);
        if (tour.getSlug() == null || tour.getSlug().isBlank()) {
            tour.setSlug(Slugs.of(tour.getTitle()));
        }
        return repo.save(tour);
    }

    @PutMapping("/admin/tours/{id}")
    public Tour update(@PathVariable String id, @RequestBody Tour tour) {
        Tour existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That tour no longer exists."));
        tour.setId(existing.getId());
        tour.setCreatedAt(existing.getCreatedAt());
        if (tour.getSlug() == null || tour.getSlug().isBlank()) {
            tour.setSlug(Slugs.of(tour.getTitle()));
        }
        return repo.save(tour);
    }

    @DeleteMapping("/admin/tours/{id}")
    public Map<String, String> delete(@PathVariable String id) {
        repo.deleteById(id);
        return Map.of("message", "Tour removed.");
    }
}