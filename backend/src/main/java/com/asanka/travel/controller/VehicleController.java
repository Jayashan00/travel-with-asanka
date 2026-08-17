package com.asanka.travel.controller;

import com.asanka.travel.model.Vehicle;
import com.asanka.travel.repo.VehicleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class VehicleController {

    private final VehicleRepository repo;

    public VehicleController(VehicleRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/vehicles")
    public List<Vehicle> list() {
        return repo.findByActiveTrueOrderBySortOrderAsc();
    }

    @GetMapping("/vehicles/{slug}")
    public Vehicle one(@PathVariable String slug) {
        return repo.findBySlug(slug)
                .or(() -> repo.findById(slug))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That vehicle is no longer listed."));
    }

    @GetMapping("/admin/vehicles")
    public List<Vehicle> listAll() {
        return repo.findAll();
    }

    @PostMapping("/admin/vehicles")
    public Vehicle create(@RequestBody Vehicle vehicle) {
        vehicle.setId(null);
        if (vehicle.getSlug() == null || vehicle.getSlug().isBlank()) {
            vehicle.setSlug(Slugs.of(vehicle.getName()));
        }
        return repo.save(vehicle);
    }

    @PutMapping("/admin/vehicles/{id}")
    public Vehicle update(@PathVariable String id, @RequestBody Vehicle vehicle) {
        Vehicle existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That vehicle no longer exists."));
        vehicle.setId(existing.getId());
        vehicle.setCreatedAt(existing.getCreatedAt());
        if (vehicle.getSlug() == null || vehicle.getSlug().isBlank()) {
            vehicle.setSlug(Slugs.of(vehicle.getName()));
        }
        return repo.save(vehicle);
    }

    @DeleteMapping("/admin/vehicles/{id}")
    public Map<String, String> delete(@PathVariable String id) {
        repo.deleteById(id);
        return Map.of("message", "Vehicle removed.");
    }
}
