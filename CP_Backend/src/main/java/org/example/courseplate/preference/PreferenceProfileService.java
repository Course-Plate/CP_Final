package org.example.courseplate.preference;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PreferenceProfileService {

    private final PreferenceProfileRepository repository;

    public void saveSurveyKeywords(String userId, List<String> likeKeywords, List<String> dislikeKeywords) {
        PreferenceProfile pref = repository.findByUserId(userId);
        if (pref == null) {
            pref = PreferenceProfile.builder()
                    .userId(userId)
                    .survey(new PreferenceProfile.SurveyPreference(likeKeywords, dislikeKeywords))
                    .review(new PreferenceProfile.ReviewPreference(new ArrayList<>(), new ArrayList<>()))
                    .build();
        } else {
            pref.setSurvey(new PreferenceProfile.SurveyPreference(likeKeywords, dislikeKeywords));
        }
        repository.save(pref);
    }

    public void appendReviewKeywords(String userId, List<String> positiveKeywords, List<String> negativeKeywords) {
        PreferenceProfile pref = repository.findByUserId(userId);
        if (pref == null) {
            pref = PreferenceProfile.builder()
                    .userId(userId)
                    .survey(new PreferenceProfile.SurveyPreference(new ArrayList<>(), new ArrayList<>()))
                    .review(new PreferenceProfile.ReviewPreference(new ArrayList<>(), new ArrayList<>()))
                    .build();
        }

        List<String> pos = new ArrayList<>(pref.getReview().getPositiveKeywords());
        List<String> neg = new ArrayList<>(pref.getReview().getNegativeKeywords());

        pos.addAll(positiveKeywords);
        neg.addAll(negativeKeywords);

        pref.getReview().setPositiveKeywords(pos.stream().distinct().toList());
        pref.getReview().setNegativeKeywords(neg.stream().distinct().toList());

        repository.save(pref);
    }

    public PreferenceProfile getPreference(String userId) {
        return repository.findByUserId(userId);
    }
}
