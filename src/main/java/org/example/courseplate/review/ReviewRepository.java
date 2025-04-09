package org.example.courseplate.review;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReviewRepository extends MongoRepository<Review, String> {
    // 기본 CRUD 사용
}
