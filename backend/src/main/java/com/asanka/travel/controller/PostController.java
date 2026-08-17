package com.asanka.travel.controller;

import com.asanka.travel.model.Post;
import com.asanka.travel.repo.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PostController {

    private final PostRepository repo;

    public PostController(PostRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/posts")
    public List<Post> list() {
        return repo.findByPublishedTrueOrderByPublishedAtDesc();
    }

    @GetMapping("/posts/{slug}")
    public Post one(@PathVariable String slug) {
        return repo.findBySlug(slug)
                .or(() -> repo.findById(slug))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That story isn't published."));
    }

    @GetMapping("/admin/posts")
    public List<Post> listAll() {
        return repo.findAll();
    }

    @PostMapping("/admin/posts")
    public Post create(@RequestBody Post post) {
        post.setId(null);
        if (post.getSlug() == null || post.getSlug().isBlank()) {
            post.setSlug(Slugs.of(post.getTitle()));
        }
        return repo.save(post);
    }

    @PutMapping("/admin/posts/{id}")
    public Post update(@PathVariable String id, @RequestBody Post post) {
        Post existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That story no longer exists."));
        post.setId(existing.getId());
        post.setCreatedAt(existing.getCreatedAt());
        if (post.getSlug() == null || post.getSlug().isBlank()) {
            post.setSlug(Slugs.of(post.getTitle()));
        }
        return repo.save(post);
    }

    @DeleteMapping("/admin/posts/{id}")
    public Map<String, String> delete(@PathVariable String id) {
        repo.deleteById(id);
        return Map.of("message", "Story removed.");
    }
}
