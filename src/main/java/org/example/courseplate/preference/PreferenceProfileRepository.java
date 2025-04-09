package org.example.courseplate.preference;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PreferenceProfileRepository extends MongoRepository<PreferenceProfile, String> {
    PreferenceProfile findByUserId(String userId);
}
