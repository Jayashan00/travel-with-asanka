package com.asanka.travel.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document("bookings")
public class Booking {
    @Id
    private String id;
    private String reference;
    @NotBlank(message = "Enter your name")
    private String name;
    @NotBlank(message = "Enter your email")
    @Email(message = "Enter a valid email address")
    private String email;
    private String phone;
    private String country;
    @NotBlank(message = "Choose a service")
    private String serviceType = "Tour around Sri Lanka";
    private String vehicleId;
    private String vehicleName;
    private String pickupLocation;
    private String dropLocation;
    private String pickupDate;
    private String pickupTime;
    private Integer passengers = 2;
    private Integer days = 1;
    private String notes;
    private String status = "New";
    private Instant createdAt = Instant.now();
}
