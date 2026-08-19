package com.asanka.travel.repo;

import com.asanka.travel.model.Tour;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TourRepository extends MongoRepository<Tour, String> {
    List<Tour> findByActiveTrueOrderBySortOrderAsc();
    Optional<Tour> findBySlug(String slug);
}