package com.asanka.travel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document("settings")
public class SiteSettings {
    @Id
    private String id = "site";

    private String brandName = "Travel With Asanka";
    private String tagline = "Best affordable, friendly taxi and travel partner";
    private String logo;

    private List<HeroSlide> heroSlides = new ArrayList<>();
    private String heroEyebrow = "Sri Lanka, at your own pace";

    private String aboutTitle = "About Us";
    private String aboutIntro;
    private String aboutImage;
    private String aboutSecondaryTitle = "Working together";
    private String aboutSecondaryText;
    private String aboutSecondaryImage;

    private String contactAddress = "Kandy, Sri Lanka";
    private String contactEmail = "info@travelwithasanka.com";
    private String contactPhone = "+94 76 185 7110";
    private String whatsapp = "94761857110";
    private String facebookUrl = "https://www.facebook.com/";
    private String instagramUrl = "https://www.instagram.com/";
    private String tripadvisorUrl = "https://www.tripadvisor.com/";
    private String googleReviewUrl = "https://www.google.com/";
    private String mapEmbedUrl = "https://www.google.com/maps?q=Kandy,Sri%20Lanka&output=embed";

    private Double googleRating = 5.0;
    private Integer googleReviewCount = 60;
    private Double tripadvisorRating = 5.0;
    private Integer tripadvisorReviewCount = 60;

    private String ceylonSectionTitle = "Ceylon";
    private String ceylonSectionSubtitle = "Sri Lanka's beautiful places";
    private String ceylonImage;
    private String countryIntro;

    private String footerNote = "Copyright (c) 2026 Travel With Asanka";

    @Data
    public static class HeroSlide {
        private String image;
        private String title;
        private String subtitle;
        private String ctaLabel;
        private String ctaLink;
    }
}
