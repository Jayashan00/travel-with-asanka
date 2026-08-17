package com.asanka.travel.repo;

import com.asanka.travel.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByPublishedTrueOrderByPublishedAtDesc();
    Optional<Post> findBySlug(String slug);
}
