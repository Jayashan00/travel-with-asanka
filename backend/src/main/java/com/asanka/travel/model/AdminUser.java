package com.asanka.travel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("admins")
public class AdminUser {
    @Id
    private String id;
    @Indexed(unique = true)
    private String username;
    private String passwordHash;
    private String displayName = "Administrator";
}
