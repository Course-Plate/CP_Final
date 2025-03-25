package org.example.courseplate.auth;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "sms_auth")
@Getter
@Setter
public class SmsAuth {
    @Id
    private String id;
    private Integer phoneNum;
    private String authCode;
    private LocalDateTime createdAt;

    public SmsAuth(Integer phoneNum, String authCode) {
        this.phoneNum = phoneNum;
        this.authCode = authCode;
        this.createdAt = LocalDateTime.now();
    }
}
