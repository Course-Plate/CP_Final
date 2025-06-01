package org.example.courseplate.place;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("Place")
@Getter
@Setter
public class Place {

    @Id
    private String id;

    private String placeId; //장소 ID
    private String placeName; //장소이름
    private String address; //장소 주소
    private String explain; //장소 설명
    private String type; //장소 타입
    private String latitude; //위도
    private String longitude; //경도
}
