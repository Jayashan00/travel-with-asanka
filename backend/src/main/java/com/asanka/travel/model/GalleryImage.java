package com.asanka.travel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document("gallery")
public class GalleryImage {
    @Id
    private String id;
    private String url;
    private String caption;
    private String album = "Tours";
    private Integer sortOrder = 0;
    private Boolean active = true;
    private Instant createdAt = Instant.now();
}
