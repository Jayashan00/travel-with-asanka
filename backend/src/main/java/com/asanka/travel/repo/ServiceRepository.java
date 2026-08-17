package com.asanka.travel.repo;

import com.asanka.travel.model.ServiceItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ServiceRepository extends MongoRepository<ServiceItem, String> {
    List<ServiceItem> findByActiveTrueOrderBySortOrderAsc();
}
