package org.example.courseplate.user;

// 사용자 관리 서비스 인터페이스
public interface UserService {

    //사용자 탈퇴
    void deleteUser(String userId);

    // 특정 userID를 가진 사용자 조회
    User getUserByUserId(String userId);

    // 특정 아이디를 가진 사용자의 존재 여부 확인
    boolean isUserIdExist(String userId);

    // 사용자의 핸드폰 번호를 출력
    User getUserByPhoneNum(Integer phoneNum);
}