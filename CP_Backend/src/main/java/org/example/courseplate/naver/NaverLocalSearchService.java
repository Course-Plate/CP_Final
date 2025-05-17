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
import java.util.HashSet;
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

    /**
     * 사용자 프로필 기반으로 네이버 API를 통해 맛집 검색 및 필터링
     * @param query 검색할 키워드 (예: "맛집")
     * @param location 검색할 위치 (예: "서울")
     * @param userId 사용자 ID
     * @return 필터링된 JSON 결과
     */
    public String searchAndFilterByUserProfile(String query, String location, String userId) {
        // MongoDB에서 사용자 프로필 불러오기
        var profile = preferenceRepo.findByUserId(userId);
        if (profile == null) {
            return "{\"error\": \"사용자 프로필을 찾을 수 없습니다.\"}";
        }

        // 사용자 선호/비선호 키워드 가져오기
        Set<String> likedKeywords = new HashSet<>();
        Set<String> dislikedKeywords = new HashSet<>();

        if (profile.getSurvey() != null) {
            likedKeywords.addAll(profile.getSurvey().getLikeKeywords());
            dislikedKeywords.addAll(profile.getSurvey().getDislikeKeywords());
        }
        if (profile.getReview() != null) {
            likedKeywords.addAll(profile.getReview().getPositiveKeywords());
            dislikedKeywords.addAll(profile.getReview().getNegativeKeywords());
        }

        System.out.println("✅ 설문조사 키워드 로드 완료");
        System.out.println("✅ 리뷰 키워드 로드 완료");
        System.out.println("👍 최종 좋아하는 키워드: " + likedKeywords);
        System.out.println("👎 최종 싫어하는 키워드: " + dislikedKeywords);

        // 1차 시도: 기본 50개 로드
        String rawJson = searchRestaurants(query, location, 50);
        String filteredJson = filterRestaurants(rawJson, List.copyOf(likedKeywords), List.copyOf(dislikedKeywords));

        // 2차 시도: 100개 로드 (필터링된 결과가 0개일 경우)
        if (isFilteredResultEmpty(filteredJson)) {
            System.out.println("🔄 필터링된 결과가 0개, 결과 수를 100개로 증가하여 재검색");
            rawJson = searchRestaurants(query, location, 100);
            filteredJson = filterRestaurants(rawJson, List.copyOf(likedKeywords), List.copyOf(dislikedKeywords));
        }

        // 3차 시도: 싫어하는 키워드 무시 (필터링된 결과가 0개일 경우)
        if (isFilteredResultEmpty(filteredJson)) {
            System.out.println("🔄 필터링된 결과가 0개, 싫어하는 키워드를 무시하고 재검색");
            filteredJson = filterRestaurants(rawJson, List.copyOf(likedKeywords), List.of());
        }

        return filteredJson;
    }

    /**
     * 네이버 API 호출 (검색 결과 개수를 설정 가능)
     * @param query 검색할 키워드
     * @param location 검색할 위치
     * @param count 검색 결과 수 (최대 100)
     * @return 네이버 API JSON 응답
     */
    public String searchRestaurants(String query, String location, int count) {
        try {
            String apiURL = "https://openapi.naver.com/v1/search/local.json?query="
                    + URLEncoder.encode(query + " " + location, StandardCharsets.UTF_8)
                    + "&display=" + count + "&start=1&sort=random";

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

            System.out.println("✅ 네이버 API 호출 성공: " + count + "개 로드");
            return response.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"네이버 API 호출 실패\"}";
        }
    }

    /**
     * JSON 결과 필터링 (좋아하는 키워드 포함 & 싫어하는 키워드 미포함)
     * @param json 네이버 API 결과 JSON 문자열
     * @param likedKeywords 사용자가 좋아하는 키워드 목록
     * @param dislikedKeywords 사용자가 싫어하는 키워드 목록
     * @return 필터링된 JSON 결과
     */
    public String filterRestaurants(String json, List<String> likedKeywords, List<String> dislikedKeywords) {
        try {
            JsonNode root = mapper.readTree(json);
            JsonNode items = root.get("items");
            ArrayNode filtered = mapper.createArrayNode();

            for (JsonNode item : items) {
                String title = item.get("title").asText().toLowerCase();
                String description = item.get("description").asText().toLowerCase();
                String address = item.has("address") ? item.get("address").asText().toLowerCase() : "";
                String category = item.has("category") ? item.get("category").asText().toLowerCase() : "";

                // 통합 정보 (이름, 설명, 주소, 카테고리)
                String combinedInfo = title + " " + description + " " + address + " " + category;

                boolean containsLiked = likedKeywords.stream()
                        .anyMatch(k -> combinedInfo.contains(k.toLowerCase()));

                boolean containsDisliked = dislikedKeywords.stream()
                        .anyMatch(k -> combinedInfo.contains(k.toLowerCase()));

                System.out.println("🔍 필터링: " + title);
                System.out.println("👍 포함된 좋아하는 키워드: " + containsLiked);
                System.out.println("👎 포함된 싫어하는 키워드: " + containsDisliked);

                if (containsLiked && !containsDisliked) {
                    filtered.add(item);
                }
            }

            System.out.println("✅ 필터링 완료: " + filtered.size() + "개");

            ObjectNode result = mapper.createObjectNode();
            result.set("items", filtered);
            return mapper.writeValueAsString(result);

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"JSON 필터링 실패\"}";
        }
    }

    /**
     * 필터링된 결과가 비어있는지 확인
     * @param filteredJson 필터링된 JSON 문자열
     * @return 결과가 0개인지 여부
     */
    private boolean isFilteredResultEmpty(String filteredJson) {
        try {
            JsonNode root = mapper.readTree(filteredJson);
            return root.get("items").size() == 0;
        } catch (Exception e) {
            e.printStackTrace();
            return true;
        }
    }
}
