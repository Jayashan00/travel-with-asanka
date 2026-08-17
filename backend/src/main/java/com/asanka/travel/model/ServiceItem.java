package com.asanka.travel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("services")
public class ServiceItem {
    @Id
    private String id;
    private String title;
    private String description;
    private String icon = "map";
    private String image;
    private Integer sortOrder = 0;
    private Boolean active = true;
}
