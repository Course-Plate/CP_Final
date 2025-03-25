package org.example.courseplate.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "User")
@Getter
@Setter
public class User {

    @Id
    private String id; // 사용자 ID

    private String userId; // 사용자 아이디
    private String userName; // 사용자 이름
    private String password; // 사용자 비밀번호
    private Integer phoneNum; // 사용자 전화번호
    private String email; // 사용자 이메일
    private String sex; // 사용자 성별

}
