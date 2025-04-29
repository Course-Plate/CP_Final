package org.example.courseplate.preference;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "user_preference")
public class PreferenceProfile {

    @Id
    private String userId;

    private SurveyPreference survey;
    private ReviewPreference review;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class SurveyPreference {
        private List<String> likeKeywords;
        private List<String> dislikeKeywords;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ReviewPreference {
        private List<String> positiveKeywords;
        private List<String> negativeKeywords;
    }
}
