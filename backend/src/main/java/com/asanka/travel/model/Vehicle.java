package com.asanka.travel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Document("vehicles")
public class Vehicle {
    @Id
    private String id;
    private String name;
    private String slug;
    private String category;
    private String image;
    private List<String> gallery = new ArrayList<>();
    private String description;
    private Integer seats = 4;
    private Integer luggage = 2;
    private String transmission = "Automatic";
    private String fuel = "Petrol";
    private Boolean airConditioned = true;
    private Double pricePerKm;
    private Double pricePerDay;
    private Integer freeKmPerDay = 100;
    private List<String> features = new ArrayList<>();
    private Boolean bestSelling = false;
    private Boolean topRated = false;
    private Boolean active = true;
    private Integer sortOrder = 0;
    private Instant createdAt = Instant.now();
}
