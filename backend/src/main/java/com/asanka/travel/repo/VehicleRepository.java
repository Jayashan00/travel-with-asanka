package com.asanka.travel.repo;

import com.asanka.travel.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    List<Vehicle> findByActiveTrueOrderBySortOrderAsc();
    Optional<Vehicle> findBySlug(String slug);
}
