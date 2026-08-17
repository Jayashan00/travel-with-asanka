package com.asanka.travel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Document("posts")
public class Post {
    @Id
    private String id;
    private String title;
    private String slug;
    private String category = "Location";
    private String excerpt;
    private String content;
    private String coverImage;
    private List<String> gallery = new ArrayList<>();
    private String district;
    private String bestTime;
    private String author = "Travel With Asanka";
    private Boolean published = true;
    private Boolean featured = false;
    private Instant publishedAt = Instant.now();
    private Instant createdAt = Instant.now();
}
