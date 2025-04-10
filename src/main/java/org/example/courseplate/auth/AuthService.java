package org.example.courseplate.auth;

import org.example.courseplate.user.User;

public interface AuthService {
    void sendSmsAuthCode(Integer phoneNum);
    boolean verifySmsCode(Integer phoneNum, String authCode);


    // 아이디와 비밀번호를 사용하여 로그인
    User login(String userId, String password);

    // 새로운 사용자 생성
    User signup(User user);

}
