package org.example.courseplate.naver;

import lombok.Data;
import java.util.List;

@Data
public class KeywordFilterRequest {
    private List<String> likedKeywords;
    private List<String> dislikedKeywords;
}
