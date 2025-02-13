package com.starbooks.backend.starline.service;

import com.starbooks.backend.starline.dto.request.StarlineCoordRequest;
import com.starbooks.backend.starline.dto.response.StarlineCoordResponse;

import java.util.List;

public interface StarlineCoordService {
    List<StarlineCoordResponse> getYearlyStarlineCoords(Long userId, int year);
    List<StarlineCoordResponse> getMonthlyStarlineCoords(Long userId, int year, int month);
    void updateStarlineCoords(Long userId, List<StarlineCoordRequest> starlineCoordRequests);
}
