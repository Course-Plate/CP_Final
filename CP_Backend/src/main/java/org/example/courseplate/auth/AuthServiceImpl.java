package org.example.courseplate.auth;

import net.nurigo.java_sdk.api.Message;
import net.nurigo.java_sdk.exceptions.CoolsmsException;
import org.example.courseplate.domain.member.Role;
import org.example.courseplate.user.User;
import org.example.courseplate.user.UserRepository;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.*;

@Service
public class AuthServiceImpl implements AuthService {

    private final Map<String, String> authCodeStorage = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Value("${coolsms.api.key}")
    private String apiKey;

    @Value("${coolsms.api.secret}")
    private String apiSecret;

    @Value("${coolsms.from.phone}")
    private String fromPhone;

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    // 사용자 회원가입 메서드
    @Override
    public User signup(User user) {
        String hashedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        user.setRole(Role.ROLE_USER);
        return userRepository.save(user);
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

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }
    // 6자리 랜덤 인증번호 생성
    private String generateAuthCode() {
        Random random = new Random();
        return String.valueOf(100000 + random.nextInt(900000));
    }

    // SMS 인증번호 전송
    @Override
    public void sendSmsAuthCode(String phoneNum) {
        String authCode = generateAuthCode();

        // 기존 코드 덮어쓰기
        authCodeStorage.put(phoneNum, authCode);

        // 5분 후 자동 삭제
        scheduler.schedule(() -> authCodeStorage.remove(phoneNum), 5, TimeUnit.MINUTES);

        System.out.println(phoneNum);
        // CoolSMS API 연동
        Message message = new Message(apiKey, apiSecret);
        HashMap<String, String> params = new HashMap<>();
        params.put("to", phoneNum);
        params.put("from", fromPhone);
        params.put("type", "SMS");
        params.put("text", "[CoursePlate] 인증번호: " + authCode);
        params.put("app_version", "test 1.0");

        try {
            JSONObject response = message.send(params);
            System.out.println("SMS 전송 결과: " + response);
        } catch (CoolsmsException e) {
            System.err.println("SMS 전송 실패: " + e.getMessage());
        }
    }

    // SMS 인증번호 검증
    @Override
    public boolean verifySmsCode(String phoneNum, String authCode) {
        return authCodeStorage.getOrDefault(phoneNum, "").equals(authCode);
    }
}
