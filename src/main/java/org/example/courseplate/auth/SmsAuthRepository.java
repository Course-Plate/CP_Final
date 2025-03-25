package org.example.courseplate.auth;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SmsAuthRepository extends MongoRepository<SmsAuth, String> {
    Optional<SmsAuth> findByPhoneNum(Integer phoneNum);
}
