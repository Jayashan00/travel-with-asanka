package com.asanka.travel.repo;

import com.asanka.travel.model.Testimonial;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TestimonialRepository extends MongoRepository<Testimonial, String> {
    List<Testimonial> findByApprovedTrueOrderByCreatedAtDesc();
}
