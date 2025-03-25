package org.example.courseplate.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class SmsAuthController {

    private final SmsAuthService smsAuthService;

    public SmsAuthController(SmsAuthService smsAuthService) {
        this.smsAuthService = smsAuthService;
    }

    // 인증번호 요청 API
    @PostMapping("/send-sms")
    public ResponseEntity<String> sendSms(@RequestBody Map<String, Integer> request) {
        Integer phoneNum = request.get("phoneNum");
        smsAuthService.sendSmsAuthCode(phoneNum);
        return ResponseEntity.ok("인증번호가 발송되었습니다.");
    }

    // 인증번호 확인 API
    @PostMapping("/verify-sms")
    public ResponseEntity<Boolean> verifySms(@RequestBody Map<String, String> request) {
        Integer phoneNum = Integer.valueOf(request.get("phoneNum"));
        String authCode = request.get("authCode");

        boolean isValid = smsAuthService.verifySmsCode(phoneNum, authCode);
        return ResponseEntity.ok(isValid);
    }
}
