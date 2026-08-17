package com.asanka.travel.controller;

import com.asanka.travel.model.Booking;
import com.asanka.travel.repo.BookingRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Locale;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingRepository repo;

    public BookingController(BookingRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/bookings")
    public Map<String, String> create(@Valid @RequestBody Booking booking) {
        booking.setId(null);
        booking.setStatus("New");
        booking.setReference("TWA-" + UUID.randomUUID().toString()
                .substring(0, 6).toUpperCase(Locale.ROOT));
        Booking saved = repo.save(booking);
        return Map.of(
                "reference", saved.getReference(),
                "message", "Booking request received. Asanka will confirm by email or WhatsApp."
        );
    }

    @GetMapping("/admin/bookings")
    public List<Booking> list() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    @PatchMapping("/admin/bookings/{id}/status")
    public Booking setStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        Booking booking = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That booking no longer exists."));
        booking.setStatus(body.getOrDefault("status", "New"));
        return repo.save(booking);
    }

    @DeleteMapping("/admin/bookings/{id}")
    public Map<String, String> delete(@PathVariable String id) {
        repo.deleteById(id);
        return Map.of("message", "Booking deleted.");
    }
}
