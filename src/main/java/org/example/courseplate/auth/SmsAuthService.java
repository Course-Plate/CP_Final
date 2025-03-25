package org.example.courseplate.auth;

public interface SmsAuthService {
    void sendSmsAuthCode(Integer phoneNum);
    boolean verifySmsCode(Integer phoneNum, String authCode);
}
