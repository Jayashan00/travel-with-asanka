package com.asanka.travel.controller;

import com.asanka.travel.model.Testimonial;
import com.asanka.travel.repo.TestimonialRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestimonialController {

    private final TestimonialRepository repo;

    public TestimonialController(TestimonialRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/testimonials")
    public List<Testimonial> list() {
        return repo.findByApprovedTrueOrderByCreatedAtDesc();
    }

    /** Visitors can leave a review; it stays hidden until an admin approves it. */
    @PostMapping("/testimonials")
    public Map<String, String> submit(@RequestBody Testimonial testimonial) {
        testimonial.setId(null);
        testimonial.setApproved(false);
        testimonial.setFeatured(false);
        repo.save(testimonial);
        return Map.of("message", "Thanks! Your review is with the team and will appear once it's checked.");
    }

    @GetMapping("/admin/testimonials")
    public List<Testimonial> listAll() {
        return repo.findAll();
    }

    @PostMapping("/admin/testimonials")
    public Testimonial create(@RequestBody Testimonial testimonial) {
        testimonial.setId(null);
        return repo.save(testimonial);
    }

    @PutMapping("/admin/testimonials/{id}")
    public Testimonial update(@PathVariable String id, @RequestBody Testimonial testimonial) {
        Testimonial existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That review no longer exists."));
        testimonial.setId(existing.getId());
        testimonial.setCreatedAt(existing.getCreatedAt());
        return repo.save(testimonial);
    }

    @DeleteMapping("/admin/testimonials/{id}")
    public Map<String, String> delete(@PathVariable String id) {
        repo.deleteById(id);
        return Map.of("message", "Review removed.");
    }
}
