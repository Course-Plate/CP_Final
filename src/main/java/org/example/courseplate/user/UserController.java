package org.example.courseplate.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import org.example.courseplate.security.JwtUtil;

// 사용자 관련 HTTP 요청을 처리하는 컨트롤러
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;


    @Autowired
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // 새로운 사용자 생성
    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody User user) {
        User createdUser = userService.signup(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PreAuthorize("isAuthenticated()") // 로그인한 사용자만 허용
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser(@RequestParam String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }


    // 특정 아이디를 가진 사용자 조회
    @GetMapping("/userid/{userId}")
    public User getUserByUserId(@PathVariable String userId) {
        return userService.getUserByUserId(userId);
    }

    // 로그인 + JWT 토큰 발급
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String userId = credentials.get("userId");
        String password = credentials.get("password");

        userService.login(userId, password); // 로그인 검증 (예외 발생 시 400 응답)
        String role = String.valueOf(userService.getUserByUserId(userId).getRole()); // DB에서 역할(Role) 가져오기

        String token = jwtUtil.generateToken(userId, role); // JWT 토큰 생성 (role 포함)

        return ResponseEntity.ok(Map.of("token", "Bearer " + token));
    }

    // 특정 아이디를 가진 사용자의 존재 여부 확인
    @GetMapping("/userid/{userId}/exists")
    public boolean isUserIdExist(@PathVariable String userId) {
        return userService.isUserIdExist(userId);
    }

    // 예외 핸들러 추가
    @RestControllerAdvice
    public class GlobalExceptionHandler {
        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}