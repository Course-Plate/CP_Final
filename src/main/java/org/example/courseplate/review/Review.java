package org.example.courseplate.review;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    @Id
    private String id;

    private String userId;
    private String restaurantName;
    private String menu;
    private String content;
    private String date;

    // ✅ 추가해야 하는 부분
    private String sentiment;  // 감정 결과 (positive / negative)
    private List<String> keywords;  // 추출된 키워드 리스트
}
