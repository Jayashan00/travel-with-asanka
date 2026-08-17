package com.asanka.travel.controller;

import com.asanka.travel.model.ServiceItem;
import com.asanka.travel.repo.ServiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ServiceController {

    private final ServiceRepository repo;

    public ServiceController(ServiceRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/services")
    public List<ServiceItem> list() {
        return repo.findByActiveTrueOrderBySortOrderAsc();
    }

    @GetMapping("/admin/services")
    public List<ServiceItem> listAll() {
        return repo.findAll();
    }

    @PostMapping("/admin/services")
    public ServiceItem create(@RequestBody ServiceItem item) {
        item.setId(null);
        return repo.save(item);
    }

    @PutMapping("/admin/services/{id}")
    public ServiceItem update(@PathVariable String id, @RequestBody ServiceItem item) {
        ServiceItem existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That service no longer exists."));
        item.setId(existing.getId());
        return repo.save(item);
    }

    @DeleteMapping("/admin/services/{id}")
    public Map<String, String> delete(@PathVariable String id) {
        repo.deleteById(id);
        return Map.of("message", "Service removed.");
    }
}
