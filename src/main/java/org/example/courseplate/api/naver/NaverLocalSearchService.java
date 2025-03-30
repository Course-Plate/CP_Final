package org.example.courseplate.api.naver;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
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

    @Value("d0rEPpWd8iw0pnMQurZM")
    private String clientId;

    @Value("ke8hlrD2jL")
    private String clientSecret;

    // RestaurantRepository는 사용하지 않음
    // private final RestaurantRepository restaurantRepository;

    public String searchRestaurants(String query, String location) {
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

            // 받아온 JSON 문자열 그대로 반환
            return response.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"네이버 API 호출 실패\"}";
        }
    }
}
