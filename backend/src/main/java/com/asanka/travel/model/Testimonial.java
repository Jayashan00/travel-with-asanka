package com.asanka.travel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document("testimonials")
public class Testimonial {
    @Id
    private String id;
    private String name;
    private String country;
    private String avatar;
    private String source = "Facebook";
    private Integer rating = 5;
    private String message;
    private Boolean approved = true;
    private Boolean featured = false;
    private Instant createdAt = Instant.now();
}
