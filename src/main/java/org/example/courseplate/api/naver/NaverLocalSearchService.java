package org.example.courseplate.api.naver;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.courseplate.domain.restaurant.Restaurant;
import org.example.courseplate.domain.restaurant.RestaurantRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class NaverLocalSearchService {

    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    private final RestaurantRepository restaurantRepository;

    public void searchAndSaveRestaurants(String query, String location) {
        try {
            String apiURL = "https://openapi.naver.com/v1/search/local.json?query="
                    + URLEncoder.encode(query + " " + location, "UTF-8")
                    + "&display=10&start=1&sort=random";

            HttpURLConnection con = (HttpURLConnection) new URL(apiURL).openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("X-Naver-Client-Id", clientId);
            con.setRequestProperty("X-Naver-Client-Secret", clientSecret);

            BufferedReader br = new BufferedReader(
                    new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8));

            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) response.append(line);
            br.close();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response.toString());
            JsonNode items = root.path("items");

            for (JsonNode item : items) {
                Restaurant restaurant = new Restaurant();
                restaurant.setName(item.path("title").asText().replaceAll("<[^>]*>", ""));
                restaurant.setCategory(item.path("category").asText());
                restaurant.setAddress(item.path("roadAddress").asText());
                restaurant.setRating(0.0);

                restaurantRepository.save(restaurant);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}