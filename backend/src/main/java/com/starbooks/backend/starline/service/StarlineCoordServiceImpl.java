package com.starbooks.backend.starline.service;

import com.starbooks.backend.starline.dto.request.StarlineCoordRequest;
import com.starbooks.backend.starline.dto.response.StarlineCoordResponse;
import com.starbooks.backend.starline.model.StarlineCoord;
import com.starbooks.backend.starline.repository.StarlineCoordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StarlineCoordServiceImpl implements StarlineCoordService {

    private final StarlineCoordRepository starlineCoordRepository;

    @Override
    public List<StarlineCoordResponse> getYearlyStarlineCoords(Long userId, int year) {
        List<StarlineCoord> starlineCoords = starlineCoordRepository.findByUserIdAndYear(userId, year);
        return starlineCoords.stream().map(StarlineCoordResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    public List<StarlineCoordResponse> getMonthlyStarlineCoords(Long userId, int year, int month) {
        List<StarlineCoord> starlineCoords = starlineCoordRepository.findByUserIdAndYearAndMonth(userId, year, month);
        return starlineCoords.stream().map(StarlineCoordResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void updateStarlineCoords(Long userId, List<StarlineCoordRequest> starlineCoordRequests) {
        if (starlineCoordRequests.isEmpty()) {
            log.warn("❌ No starline data received, skipping update.");
            return;
        }

        int year = starlineCoordRequests.get(0).getYear();
        int month = starlineCoordRequests.get(0).getMonth();

        log.info("🔄 Fetching existing starline IDs for userId={}, year={}, month={}", userId, year, month);
        List<Long> starlineCoordIds = starlineCoordRepository.findStarlineCoordIdsForDeletion(userId, year, month);

        if (!starlineCoordIds.isEmpty()) {
            log.info("🗑 Deleting {} existing starline records.", starlineCoordIds.size());
            starlineCoordRepository.deleteByIds(starlineCoordIds);
        } else {
            log.info("✅ No existing records to delete.");
        }

        List<StarlineCoord> newStarlineCoords = starlineCoordRequests.stream()
                .map(request -> StarlineCoord.builder()
                        .startEmotionId(request.getStartEmotionId())
                        .endEmotionId(request.getEndEmotionId())
                        .year(request.getYear())
                        .month(request.getMonth())
                        .build())
                .collect(Collectors.toList());

        starlineCoordRepository.saveAll(newStarlineCoords);
        log.info("✅ Inserted {} new records for userId={}", newStarlineCoords.size(), userId);
    }
}
