package org.example.courseplate.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

// 사용자 관련 HTTP 요청을 처리하는 컨트롤러
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 새로운 사용자 생성
    @PostMapping
    public User signup(@RequestBody User user) {
        return userService.signup(user);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser(@RequestParam String userId) {
        try{
            userService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 특정 아이디를 가진 사용자 조회
    @GetMapping("/userid/{userId}")
    public User getUserByUserId(@PathVariable String userId) {
        return userService.getUserByUserId(userId);
    }

    // 아이디와 비밀번호를 사용하여 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String userId = credentials.get("userId");
        String password = credentials.get("password");
        User user = userService.login(userId, password);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }


    // 특정 아이디를 가진 사용자의 존재 여부 확인
    @GetMapping("/userid/{userId}/exists")
    public boolean isUserIdExist(@PathVariable String userId) {
        return userService.isUserIdExist(userId);
    }
}