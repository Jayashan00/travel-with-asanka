package com.asanka.travel.controller;

import com.asanka.travel.model.AdminUser;
import com.asanka.travel.repo.AdminRepository;
import com.asanka.travel.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AdminRepository admins;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(AdminRepository admins, PasswordEncoder encoder, JwtService jwt) {
        this.admins = admins;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/auth/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "").trim();
        String password = body.getOrDefault("password", "");

        Optional<AdminUser> found = admins.findByUsername(username);
        if (found.isEmpty() || !encoder.matches(password, found.get().getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "That username and password don't match.");
        }

        Map<String, Object> res = new HashMap<>();
        res.put("token", jwt.generate(username));
        res.put("displayName", found.get().getDisplayName());
        res.put("username", username);
        return res;
    }

    @GetMapping("/admin/auth/me")
    public Map<String, Object> me(@RequestAttribute("adminUsername") String username) {
        Map<String, Object> res = new HashMap<>();
        res.put("username", username);
        res.put("displayName", admins.findByUsername(username)
                .map(AdminUser::getDisplayName).orElse("Administrator"));
        return res;
    }

    @PostMapping("/admin/auth/password")
    public Map<String, Object> changePassword(@RequestAttribute("adminUsername") String username,
                                              @RequestBody Map<String, String> body) {
        AdminUser user = admins.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found."));
        if (!encoder.matches(body.getOrDefault("currentPassword", ""), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The current password is incorrect.");
        }
        String next = body.getOrDefault("newPassword", "");
        if (next.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use at least 6 characters for the new password.");
        }
        user.setPasswordHash(encoder.encode(next));
        admins.save(user);
        return Map.of("message", "Password updated.");
    }
}
