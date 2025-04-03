package org.example.courseplate.user;

import org.example.courseplate.domain.member.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    // 사용자 회원가입 메서드
    @Override
    public User signup(User user) {
        String hashedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        user.setRole(Role.ROLE_USER);
        return userRepository.save(user);
    }

    // 사용자 탈퇴 메서드
    @Override
    public void deleteUser(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 아이디가 없습니다."));
        userRepository.delete(user);
    }

    // 사용자 아이디로 사용자 정보를 가져오는 메서드
    @Override
    public User getUserByUserId(String userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 아이디가 존재하지 않습니다."));
    }

    // 사용자 로그인 메서드
    @Override
    public User login(String userId, String password) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 아이디가 존재하지 않습니다."));

        if (!bCryptPasswordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        return user;
    }

    // 사용자 아이디가 존재하는지 확인하는 메서드
    @Override
    public boolean isUserIdExist(String userId) {
        return userRepository.findByUserId(userId).isPresent();
    }

    // 사용자 전화번호로 사용자 정보를 가져오는 메서드
    @Override
    public User getUserByPhoneNum(Integer phoneNum) {
        return userRepository.findByPhoneNum(phoneNum)
                .orElseThrow(() -> new IllegalArgumentException("해당 전화번호를 가진 사용자가 없습니다."));
    }
}
