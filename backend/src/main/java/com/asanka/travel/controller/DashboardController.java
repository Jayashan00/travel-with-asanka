package com.asanka.travel.controller;

import com.asanka.travel.repo.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class DashboardController {

    private final BookingRepository bookings;
    private final MessageRepository messages;
    private final VehicleRepository vehicles;
    private final PostRepository posts;
    private final TestimonialRepository testimonials;
    private final GalleryRepository gallery;

    public DashboardController(BookingRepository bookings, MessageRepository messages, VehicleRepository vehicles,
                               PostRepository posts, TestimonialRepository testimonials, GalleryRepository gallery) {
        this.bookings = bookings;
        this.messages = messages;
        this.vehicles = vehicles;
        this.posts = posts;
        this.testimonials = testimonials;
        this.gallery = gallery;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("newBookings", bookings.countByStatus("New"));
        out.put("totalBookings", bookings.count());
        out.put("unreadMessages", messages.countByReadFalse());
        out.put("totalMessages", messages.count());
        out.put("vehicles", vehicles.count());
        out.put("posts", posts.count());
        out.put("testimonials", testimonials.count());
        out.put("photos", gallery.count());
        return out;
    }
}
