package com.asanka.travel.repo;

import com.asanka.travel.model.GalleryImage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GalleryRepository extends MongoRepository<GalleryImage, String> {
    List<GalleryImage> findByActiveTrueOrderBySortOrderAsc();
}
