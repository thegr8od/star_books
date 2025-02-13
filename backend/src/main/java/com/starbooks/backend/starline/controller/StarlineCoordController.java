package com.starbooks.backend.starline.controller;

import com.starbooks.backend.starline.dto.request.StarlineCoordRequest;
import com.starbooks.backend.starline.dto.response.StarlineCoordResponse;
import com.starbooks.backend.starline.service.StarlineCoordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 별자리 선 관련 API 요청을 처리하는 컨트롤러
 */
@RestController
@RequestMapping("/api/starline")
@RequiredArgsConstructor
public class StarlineCoordController {

    private final StarlineCoordService starlineCoordService;

    /**
     * 새로운 별자리 선을 생성하는 API
     */
    @PostMapping("/create")
    public ResponseEntity<StarlineCoordResponse> createStarline(@RequestBody StarlineCoordRequest request) {
        return ResponseEntity.ok(starlineCoordService.createStarlineCoord(request));
    }

    /**
     * 모든 별자리 선 목록을 반환하는 API
     */
    @GetMapping("/all")
    public ResponseEntity<List<StarlineCoordResponse>> getAllStarlines() {
        return ResponseEntity.ok(starlineCoordService.getAllStarlineCoords());
    }

    /**
     * 특정 ID의 별자리 선을 조회하는 API
     */
    @GetMapping("/{id}")
    public ResponseEntity<StarlineCoordResponse> getStarlineById(@PathVariable Long id) {
        return ResponseEntity.ok(starlineCoordService.getStarlineCoordById(id));
    }
}
