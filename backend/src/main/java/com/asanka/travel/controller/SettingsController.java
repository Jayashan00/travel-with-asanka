package com.asanka.travel.controller;

import com.asanka.travel.model.SiteSettings;
import com.asanka.travel.repo.SettingsRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SettingsController {

    private final SettingsRepository repo;

    public SettingsController(SettingsRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/settings")
    public SiteSettings get() {
        return repo.findById("site").orElseGet(SiteSettings::new);
    }

    @PutMapping("/admin/settings")
    public SiteSettings update(@RequestBody SiteSettings settings) {
        settings.setId("site");
        return repo.save(settings);
    }
}
