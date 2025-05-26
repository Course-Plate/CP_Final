package org.example.courseplate.auth;

import org.example.courseplate.security.JwtUtil;
import org.example.courseplate.user.User;
import org.example.courseplate.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, UserService userService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }


    // 새로운 사용자 생성
    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody User user) {
        User createdUser = authService.signup(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // 로그인 + JWT 토큰 발급
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String userId = credentials.get("userId");
        String password = credentials.get("password");


        authService.login(userId, password); // 로그인 검증 (예외 발생 시 400 응답)
        String role = String.valueOf(userService.getUserByUserId(userId).getRole()); // DB에서 역할(Role) 가져오기

        String token = jwtUtil.generateToken(userId, role); // JWT 토큰 생성 (role 포함)

        return ResponseEntity.ok(Map.of("token", "Bearer " + token));
    }

    // 인증번호 요청 API
    @PostMapping("/send-sms")
    public ResponseEntity<String> sendSms(@RequestBody Map<String, String> request) {
        String phoneNum = request.get("phoneNum");
        authService.sendSmsAuthCode(phoneNum);
        return ResponseEntity.ok("인증번호가 발송되었습니다.");
    }

    // 인증번호 확인 API
    @PostMapping("/verify-sms")
    public ResponseEntity<Boolean> verifySms(@RequestBody Map<String, String> request) {
        String phoneNum = request.get("phoneNum");
        String authCode = request.get("authCode");

        boolean isValid = authService.verifySmsCode(phoneNum, authCode);
        return ResponseEntity.ok(isValid);
    }
}
