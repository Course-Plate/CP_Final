package org.example.courseplate.naver;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NaverLocalSearchService {

    @Value("d0rEPpWd8iw0pnMQurZM")
    private String clientId;

    @Value("ke8hlrD2jL")
    private String clientSecret;

    private final ObjectMapper mapper = new ObjectMapper();

    // 네이버 API 호출
    public String searchRestaurants(String query, String location) {
        try {
            String apiURL = "https://openapi.naver.com/v1/search/local.json?query="
                    + URLEncoder.encode(query + " " + location, "UTF-8")
                    + "&display=20&start=1&sort=random";

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

            return response.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"네이버 API 호출 실패\"}";
        }
    }

    // JSON 결과 필터링 (좋아하는 키워드 포함 & 싫어하는 키워드 미포함)
    public String filterRestaurants(String json, List<String> likedKeywords, List<String> dislikedKeywords) {
        try {
            JsonNode root = mapper.readTree(json);
            JsonNode items = root.get("items");
            ArrayNode filtered = mapper.createArrayNode();

            for (JsonNode item : items) {
                String title = item.get("title").asText();
                String description = item.get("description").asText();

                boolean containsLiked = likedKeywords.stream().anyMatch(k -> title.contains(k) || description.contains(k));
                boolean containsDisliked = dislikedKeywords.stream().anyMatch(k -> title.contains(k) || description.contains(k));

                if (containsLiked && !containsDisliked) {
                    filtered.add(item);
                }
            }

            ObjectNode result = mapper.createObjectNode();
            result.set("items", filtered);
            return mapper.writeValueAsString(result);

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"JSON 필터링 실패\"}";
        }
    }

    // 통합 메서드: 호출 + 필터링
    public String searchAndFilter(String query, String location, List<String> liked, List<String> disliked) {
        String rawJson = searchRestaurants(query, location);
        return filterRestaurants(rawJson, liked, disliked);
    }
}

