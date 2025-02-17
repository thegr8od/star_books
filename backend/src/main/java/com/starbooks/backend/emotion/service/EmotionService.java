package com.starbooks.backend.emotion.service;

import com.starbooks.backend.emotion.model.EmotionPoint;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmotionService {

    // 해시태그별 감정 좌표 매핑 (실제 값은 필요에 따라 조정)
    private static final Map<String, EmotionPoint> tagCoordinateMap = new HashMap<>();

    static {
        // Positive (10개)
        tagCoordinateMap.put("행복한",    new EmotionPoint(4.5,  3.5));
        tagCoordinateMap.put("기쁜",      new EmotionPoint(4.0,  3.0));
        tagCoordinateMap.put("만족스러운", new EmotionPoint(3.5,  2.5));
        tagCoordinateMap.put("신나는",    new EmotionPoint(4.0,  4.5));
        tagCoordinateMap.put("감동적인",  new EmotionPoint(3.0,  2.0));
        tagCoordinateMap.put("설레는",    new EmotionPoint(3.5,  3.5));
        tagCoordinateMap.put("평온한",    new EmotionPoint(3.0, -0.5));
        tagCoordinateMap.put("차분한",    new EmotionPoint(2.5, -1.0));
        tagCoordinateMap.put("편안한",    new EmotionPoint(3.0,  0.0));
        tagCoordinateMap.put("후련한",    new EmotionPoint(2.5,  0.5));

        // Negative (10개)
        tagCoordinateMap.put("불안한",    new EmotionPoint(-3.0,  3.0));
        tagCoordinateMap.put("초조한",    new EmotionPoint(-2.5,  3.5));
        tagCoordinateMap.put("화난",      new EmotionPoint(-4.0,  4.0));
        tagCoordinateMap.put("짜증 나는", new EmotionPoint(-3.5,  2.5));
        tagCoordinateMap.put("답답한",    new EmotionPoint(-3.0,  2.0));
        tagCoordinateMap.put("속상한",    new EmotionPoint(-3.0,  1.5));
        tagCoordinateMap.put("슬픈",      new EmotionPoint(-4.0, -2.0));
        tagCoordinateMap.put("우울한",    new EmotionPoint(-4.5, -3.0));
        tagCoordinateMap.put("지친",      new EmotionPoint(-3.5, -2.5));
        tagCoordinateMap.put("무기력한",  new EmotionPoint(-4.0, -4.0));

        // Neutral (10개)
        tagCoordinateMap.put("그저 그런", new EmotionPoint(0.0,  0.0));
        tagCoordinateMap.put("담담한",    new EmotionPoint(0.5, -1.0));
        tagCoordinateMap.put("멍한",      new EmotionPoint(0.0, -2.0));
        tagCoordinateMap.put("고민되는",  new EmotionPoint(0.0,  1.0));
        tagCoordinateMap.put("조용한",    new EmotionPoint(0.0, -1.5));
        tagCoordinateMap.put("느긋한",    new EmotionPoint(1.0, -0.5));
        tagCoordinateMap.put("궁금한",    new EmotionPoint(0.5,  1.0));
        tagCoordinateMap.put("심심한",    new EmotionPoint(0.0, -0.5));
        tagCoordinateMap.put("무심한",    new EmotionPoint(-0.5, -1.0));
        tagCoordinateMap.put("졸린",      new EmotionPoint(0.0, -3.0));
    }

    /**
     * List<String> 형태의 해시태그를 입력받아,
     * 각 해시태그에 기본 가중치(1.0)를 적용한 가중 평균 감정 좌표를 계산합니다.
     */
    public EmotionPoint calculateWeightedPoint(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return new EmotionPoint(0.0, 0.0);
        }

        double sumValence = 0.0;
        double sumArousal = 0.0;
        double sumWeight = 0.0;

        // 각 태그마다 기본 weight 1.0 적용
        for (String tag : tags) {
            EmotionPoint point = tagCoordinateMap.get(tag);
            if (point != null) {
                double weight = 1.0;
                sumValence += (weight * point.getxvalue());
                sumArousal += (weight * point.getyvalue());
                sumWeight += weight;
            }
        }

        if (sumWeight == 0) {
            return new EmotionPoint(0.0, 0.0);
        }

        int weightedValence = (int)clamp(sumValence / sumWeight, -5.0, 5.0);
        int weightedArousal = (int)clamp(sumArousal / sumWeight, -5.0, 5.0);

        return new EmotionPoint(weightedValence, weightedArousal);
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }
}
