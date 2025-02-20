package com.starbooks.backend.emotion.service;

import com.starbooks.backend.emotion.model.EmotionPoint;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class EmotionService {

    // 해시태그별 (Valence, Arousal) 평균 좌표
    private static final Map<String, EmotionPoint> tagCoordinateMap = new HashMap<>();

    // 표준편차(가중치)를 임의로 설정(필요시 해시태그마다 다르게 둘 수도 있음)
    private static final double DEFAULT_STD_DEV = 0.7;

    // 난수 생성기
    private final Random random = new Random();

    static {
        // Positive (10개)
        tagCoordinateMap.put("행복한",    new EmotionPoint( 4.5,  3.5));
        tagCoordinateMap.put("기쁜",      new EmotionPoint( 4.0,  3.0));
        tagCoordinateMap.put("만족스러운", new EmotionPoint( 3.5,  2.5));
        tagCoordinateMap.put("신나는",    new EmotionPoint( 4.0,  4.5));
        tagCoordinateMap.put("감동적인",  new EmotionPoint( 3.0,  2.0));
        tagCoordinateMap.put("설레는",    new EmotionPoint( 3.5,  3.5));
        tagCoordinateMap.put("평온한",    new EmotionPoint( 3.0, -0.5));
        tagCoordinateMap.put("차분한",    new EmotionPoint( 2.5, -1.0));
        tagCoordinateMap.put("편안한",    new EmotionPoint( 3.0,  0.0));
        tagCoordinateMap.put("후련한",    new EmotionPoint( 2.5,  0.5));

        // Negative (10개)
        tagCoordinateMap.put("불안한",    new EmotionPoint(-3.0,  3.0));
        tagCoordinateMap.put("초조한",    new EmotionPoint(-2.5,  3.5));
        tagCoordinateMap.put("화난",      new EmotionPoint(-4.0,  4.0));
        tagCoordinateMap.put("짜증나는",  new EmotionPoint(-3.5,  2.5));
        tagCoordinateMap.put("답답한",    new EmotionPoint(-3.0,  2.0));
        tagCoordinateMap.put("속상한",    new EmotionPoint(-3.0,  1.5));
        tagCoordinateMap.put("슬픈",      new EmotionPoint(-4.0, -2.0));
        tagCoordinateMap.put("우울한",    new EmotionPoint(-4.5, -3.0));
        tagCoordinateMap.put("지친",      new EmotionPoint(-3.5, -2.5));
        tagCoordinateMap.put("무기력한",  new EmotionPoint(-4.0, -4.0));

        // Neutral (10개)
        tagCoordinateMap.put("그저그런", new EmotionPoint( 0.0,  0.0));
        tagCoordinateMap.put("담담한",    new EmotionPoint( 0.5, -1.0));
        tagCoordinateMap.put("멍한",      new EmotionPoint( 0.0, -2.0));
        tagCoordinateMap.put("고민되는",  new EmotionPoint( 0.0,  1.0));
        tagCoordinateMap.put("조용한",    new EmotionPoint( 0.0, -1.5));
        tagCoordinateMap.put("느긋한",    new EmotionPoint( 1.0, -0.5));
        tagCoordinateMap.put("궁금한",    new EmotionPoint( 0.5,  1.0));
        tagCoordinateMap.put("심심한",    new EmotionPoint( 0.0, -0.5));
        tagCoordinateMap.put("무심한",    new EmotionPoint(-0.5, -1.0));
        tagCoordinateMap.put("졸린",      new EmotionPoint( 0.0, -3.0));
    }

    /**
     * 해시태그 목록을 받아서, 각 해시태그의 평균 좌표 주변에서
     * 2차원 정규분포 난수를 샘플링한 뒤, 전체 평균을 낸다.
     *
     * - 여러 해시태그가 들어오면, 해시태그 개수만큼 샘플링 결과를 합산/평균
     * - 최종 Valence/Arousal은 [-5, 5] 범위로 clamp
     */
    public EmotionPoint calculateWeightedPoint(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return new EmotionPoint(0.0, 0.0);
        }

        double sumValence = 0.0;
        double sumArousal = 0.0;
        double count = 0.0;

        for (String tag : tags) {
            EmotionPoint basePoint = tagCoordinateMap.get(tag);
            if (basePoint != null) {
                // 2차원 정규분포라고 가정하되, 여기서는 독립성(상관=0)으로 간단화하여
                // 각 축마다 Gaussian 샘플링을 적용
                double sampledValence = basePoint.getxvalue() + random.nextGaussian() * DEFAULT_STD_DEV;
                double sampledArousal = basePoint.getyvalue() + random.nextGaussian() * DEFAULT_STD_DEV;

                sumValence += sampledValence;
                sumArousal += sampledArousal;
                count++;
            }
        }

        if (count == 0.0) {
            return new EmotionPoint(0.0, 0.0);
        }

        double finalValence = sumValence / count;
        double finalArousal = sumArousal / count;

        // -5 ~ 5 범위 제한
        finalValence = clamp(finalValence, -5.0, 5.0);
        finalArousal = clamp(finalArousal, -5.0, 5.0);

        return new EmotionPoint(finalValence, finalArousal);
    }

    /**
     * 단일 해시태그의 좌표(기본 mean)만 보고 싶을 때
     */
    public EmotionPoint getTagCoordinate(String tag) {
        return tagCoordinateMap.getOrDefault(tag, new EmotionPoint(0.0, 0.0));
    }

    /**
     * 범위 제한 함수
     */
    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }
}
