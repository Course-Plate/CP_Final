package org.example.courseplate.auth;

import net.nurigo.java_sdk.api.Message;
import net.nurigo.java_sdk.exceptions.CoolsmsException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.*;

@Service
public class SmsAuthServiceImpl implements SmsAuthService {

    private final Map<Integer, String> authCodeStorage = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Value("${coolsms.api.key}")
    private String apiKey;

    @Value("${coolsms.api.secret}")
    private String apiSecret;

    @Value("${coolsms.from.phone}")
    private String fromPhone;

    // 6자리 랜덤 인증번호 생성
    private String generateAuthCode() {
        Random random = new Random();
        return String.valueOf(100000 + random.nextInt(900000));
    }

    // SMS 인증번호 전송
    @Override
    public void sendSmsAuthCode(Integer phoneNum) {
        String authCode = generateAuthCode();

        // 기존 코드 덮어쓰기
        authCodeStorage.put(phoneNum, authCode);

        // 5분 후 자동 삭제
        scheduler.schedule(() -> authCodeStorage.remove(phoneNum), 5, TimeUnit.MINUTES);

        // CoolSMS API 연동
        Message message = new Message(apiKey, apiSecret);
        HashMap<String, String> params = new HashMap<>();
        params.put("to", String.valueOf(phoneNum));
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
    public boolean verifySmsCode(Integer phoneNum, String authCode) {
        return authCodeStorage.getOrDefault(phoneNum, "").equals(authCode);
    }
}
