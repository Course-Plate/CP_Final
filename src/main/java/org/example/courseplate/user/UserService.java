package org.example.courseplate.user;

// 사용자 관리 서비스 인터페이스
public interface UserService {
    // 새로운 사용자 생성
    User signup(User user);

    //사용자 탈퇴
    void deleteUser(String userId);

    // 특정 userID를 가진 사용자 조회
    User getUserByUserId(String userId);

    // 아이디와 비밀번호를 사용하여 로그인
    User login(String userId, String password);

    // 특정 아이디를 가진 사용자의 존재 여부 확인
    boolean isUserIdExist(String userId);
}