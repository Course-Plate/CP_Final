package org.example.courseplate.auth;

import net.nurigo.java_sdk.api.Message;
import net.nurigo.java_sdk.exceptions.CoolsmsException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Optional;
import java.util.Random;

@Service
public class SmsAuthServiceImpl implements SmsAuthService {

    private final SmsAuthRepository smsAuthRepository;

    @Value("${coolsms.api.key}")
    private String apiKey;

    @Value("${coolsms.api.secret}")
    private String apiSecret;

    @Value("${coolsms.from.phone}")
    private String fromPhone;

    public SmsAuthServiceImpl(SmsAuthRepository smsAuthRepository) {
        this.smsAuthRepository = smsAuthRepository;
    }

    // 6자리 랜덤 인증번호 생성
    private String generateAuthCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    // SMS 인증번호 전송
    @Override
    @Transactional
    public void sendSmsAuthCode(Integer phoneNum) {
        String authCode = generateAuthCode();

        // 기존 인증번호 삭제 후 새로 저장
        smsAuthRepository.findByPhoneNum(phoneNum).ifPresent(smsAuthRepository::delete);
        SmsAuth smsAuth = new SmsAuth(phoneNum, authCode);
        smsAuthRepository.save(smsAuth);

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
        Optional<SmsAuth> smsAuthOpt = smsAuthRepository.findByPhoneNum(phoneNum);
        return smsAuthOpt.map(smsAuth -> smsAuth.getAuthCode().equals(authCode)).orElse(false);
    }
}
