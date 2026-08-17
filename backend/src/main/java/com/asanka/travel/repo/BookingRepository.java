package com.asanka.travel.repo;

import com.asanka.travel.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
