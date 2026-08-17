package com.asanka.travel.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document("messages")
public class ContactMessage {
    @Id
    private String id;
    @NotBlank(message = "Enter your name")
    private String name;
    @NotBlank(message = "Enter your email")
    @Email(message = "Enter a valid email address")
    private String email;
    private String phone;
    private String subject;
    @NotBlank(message = "Write a short message")
    private String message;
    private Boolean read = false;
    private Instant createdAt = Instant.now();
}
