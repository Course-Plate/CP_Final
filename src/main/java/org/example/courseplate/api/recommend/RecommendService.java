package org.example.courseplate.api.recommend;

import lombok.RequiredArgsConstructor;
import org.example.courseplate.domain.preference.PreferenceProfile;
import org.example.courseplate.domain.preference.PreferenceProfileRepository;
import org.example.courseplate.domain.restaurant.Restaurant;
import org.example.courseplate.domain.restaurant.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendService {

    private final RestaurantRepository restaurantRepository;
    private final PreferenceProfileRepository preferenceRepo;

    public List<Restaurant> recommendByUserProfile(String userId) {
        PreferenceProfile profile = preferenceRepo.findByUserId(userId);
        return restaurantRepository.findByCategoryInAndAtmosphereIn(
                profile.getLikedFoods(),
                profile.getPreferredAtmospheres()
        );
    }
}