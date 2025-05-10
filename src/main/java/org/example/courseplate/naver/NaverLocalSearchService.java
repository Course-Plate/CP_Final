package org.example.courseplate.naver;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.example.courseplate.preference.PreferenceProfileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NaverLocalSearchService {

    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    private final ObjectMapper mapper = new ObjectMapper();
    private final PreferenceProfileRepository preferenceRepo;

    // 사용자 프로필에서 키워드 자동 불러오기
    public String searchAndFilterByUserProfile(String query, String location, String userId) {
        // MongoDB에서 사용자 프로필 불러오기
        var profile = preferenceRepo.findByUserId(userId);
        if (profile == null) {
            return "{\"error\": \"사용자 프로필을 찾을 수 없습니다.\"}";
        }

        // 사용자 선호/비선호 키워드 가져오기
        Set<String> likedKeywords = (Set<String>) profile.getSurvey().getLikeKeywords();
        Set<String> dislikedKeywords = (Set<String>) profile.getSurvey().getDislikeKeywords();
        likedKeywords.addAll(profile.getReview().getPositiveKeywords());
        dislikedKeywords.addAll(profile.getReview().getNegativeKeywords());

        // 네이버 API 호출 및 필터링
        String rawJson = searchRestaurants(query, location);
        return filterRestaurants(rawJson, likedKeywords.stream().toList(), dislikedKeywords.stream().toList());
    }

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
}
