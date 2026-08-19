package com.asanka.travel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * A ready made tour package shown on /tours.
 * Prices are per person and stored in the currency named on the record.
 */
@Data
@Document("tours")
public class Tour {
    @Id
    private String id;
    private String title;
    private String slug;
    private String category = "Cultural";
    private String image;
    private List<String> gallery = new ArrayList<>();
    private String summary;
    private String description;

    /** Districts or towns the tour covers. Feeds the "Location" filter. */
    private List<String> locations = new ArrayList<>();

    private Integer days = 3;
    private Integer nights = 2;
    private Integer maxGuests = 6;

    private Double price;
    /** Optional "was" price. Shown struck through when it is higher than the price. */
    private Double oldPrice;
    private String currency = "USD";

    private Double rating = 0.0;
    private Integer reviewCount = 0;

    private List<String> highlights = new ArrayList<>();
    private List<String> includes = new ArrayList<>();
    private List<String> excludes = new ArrayList<>();
    /** One line per day, e.g. "Day 1 — Airport to Sigiriya: ...". */
    private List<String> itinerary = new ArrayList<>();

    private Boolean featured = false;
    private Boolean active = true;
    private Integer sortOrder = 0;
    private Instant createdAt = Instant.now();
}