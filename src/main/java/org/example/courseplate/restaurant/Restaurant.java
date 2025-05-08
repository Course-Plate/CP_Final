package org.example.courseplate.restaurant;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "restaurants")
public class Restaurant {

    @Id
    private String id;
    private String restaurantName;
    private String address;
    private String category;
    private String phone;
    private double rating;

    // ✅ 키워드 필드 - 기본값으로 빈 리스트로 초기화
    @Builder.Default
    private List<String> keywords = new ArrayList<>();
}
