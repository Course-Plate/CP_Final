package org.example.courseplate.preference;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "preferences")
@Data
public class PreferenceProfile {
    @Id
    private String id;
    private String userId;
    private List<String> likedFoods;
    private List<String> preferredAtmospheres;
    private Map<String, Integer> keywordCounts;
}
