package com.asanka.travel.controller;

import com.asanka.travel.model.ContactMessage;
import com.asanka.travel.repo.MessageRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MessageController {

    private final MessageRepository repo;

    public MessageController(MessageRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/messages")
    public Map<String, String> send(@Valid @RequestBody ContactMessage message) {
        message.setId(null);
        message.setRead(false);
        repo.save(message);
        return Map.of("message", "Message sent. Asanka usually replies within a few hours.");
    }

    @GetMapping("/admin/messages")
    public List<ContactMessage> list() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    @PatchMapping("/admin/messages/{id}/read")
    public ContactMessage markRead(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        ContactMessage msg = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "That message no longer exists."));
        msg.setRead(body.getOrDefault("read", true));
        return repo.save(msg);
    }

    @DeleteMapping("/admin/messages/{id}")
    public Map<String, String> delete(@PathVariable String id) {
        repo.deleteById(id);
        return Map.of("message", "Message deleted.");
    }
}
