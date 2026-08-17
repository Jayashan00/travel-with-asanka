package com.asanka.travel.repo;

import com.asanka.travel.model.SiteSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SettingsRepository extends MongoRepository<SiteSettings, String> {
}
