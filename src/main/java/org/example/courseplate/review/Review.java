package org.example.courseplate.review;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document("Review")
@Getter
@Setter
public class    Review {

    @Id
    private String id;

    private String userId;              //유저 아이디
    private String userName;            //유저 이름

    private String placeId;             //가게 아이디
    private String placeName;           //가게 이름

    private Integer score;              //점수

    private String reviewContent;       //유저 리뷰
    private String bossContent;         //사장 대댓글

    private byte[] reviewImg;           //사진들

    private LocalDateTime createdAt;    //게시일
    private LocalDateTime updatedAt;    //수정일
}
