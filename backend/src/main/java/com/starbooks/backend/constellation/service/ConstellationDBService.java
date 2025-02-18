package com.starbooks.backend.constellation.service;

import com.starbooks.backend.constellation.dto.ConstellationDto;
import com.starbooks.backend.constellation.dto.ConstellationLineDto;
import com.starbooks.backend.constellation.model.Constellation;
import com.starbooks.backend.constellation.model.ConstellationLine;
import com.starbooks.backend.constellation.repository.ConstellationLineRepository;
import com.starbooks.backend.constellation.repository.ConstellationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConstellationDBService {

    private final ConstellationRepository constellationRepository;
    private final ConstellationLineRepository constellationLineRepository;

    /**
     * 🌟 AI에서 생성된 별자리 선 데이터를 DB에 저장
     */
    @Transactional
    public ConstellationDto saveConstellation(Long userId, List<ConstellationLineDto> lines) {
        log.info("🌟 별자리 저장 요청 - userId: {}", userId);

        Constellation newConstellation = Constellation.builder()
                .userId(userId)
                .createdAt(LocalDateTime.now())
                .build();
        Constellation savedConstellation = constellationRepository.save(newConstellation);

        List<ConstellationLine> lineEntities = lines.stream()
                .map(line -> {
                    ConstellationLine lineEntity = ConstellationLine.builder()
                            .startX(line.getStartX())
                            .startY(line.getStartY())
                            .endX(line.getEndX())
                            .endY(line.getEndY())
                            .build();
                    lineEntity.setConstellation(savedConstellation);  // ✅ 별도로 constellation 세팅
                    return lineEntity;
                })
                .collect(Collectors.toList());

        constellationLineRepository.saveAll(lineEntities);

        log.info("✅ 별자리 저장 완료 - ID: {}", savedConstellation.getConstellationId());

        return ConstellationDto.builder()
                .constellationId(savedConstellation.getConstellationId())
                .userId(savedConstellation.getUserId())
                .createdAt(savedConstellation.getCreatedAt())
                .lines(lines)
                .build();
    }



    /**
     * 🔍 특정 유저의 별자리 목록 조회
     */
    public List<ConstellationDto> getConstellationsByUser(Long userId) {
        return constellationRepository.findByUserId(userId).stream()
                .map(constellation -> ConstellationDto.builder()
                        .constellationId(constellation.getConstellationId())
                        .userId(constellation.getUserId())
                        .createdAt(constellation.getCreatedAt())
                        .lines(constellation.getLines().stream()
                                .map(line -> new ConstellationLineDto(
                                        line.getLineId(),
                                        line.getConstellation().getConstellationId(),
                                        line.getStartX(),
                                        line.getStartY(),
                                        line.getEndX(),
                                        line.getEndY()))
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 🔍 특정 별자리의 선 데이터 조회
     */
    public List<ConstellationLineDto> getLinesByConstellationId(Long constellationId) {
        return constellationLineRepository.findByConstellation_ConstellationId(constellationId).stream()
                .map(line -> new ConstellationLineDto(
                        line.getLineId(),
                        line.getConstellation().getConstellationId(),
                        line.getStartX(),
                        line.getStartY(),
                        line.getEndX(),
                        line.getEndY()))
                .collect(Collectors.toList());
    }

    @Transactional
    public ConstellationDto saveUserConstellation(Long userId, ConstellationDto constellationDto) {
        log.info("🌟 유저가 직접 입력한 별자리 저장 요청 - userId: {}", userId);

        // Constellation 엔티티 생성 및 저장
        Constellation newConstellation = Constellation.builder()
                .userId(userId)
                .createdAt(LocalDateTime.now())
                .build();
        Constellation savedConstellation = constellationRepository.save(newConstellation);

        // 유저가 입력한 선 데이터 저장
        List<ConstellationLine> lineEntities = constellationDto.getLines().stream()
                .map(line -> {
                    ConstellationLine lineEntity = ConstellationLine.builder()
                            .startX(line.getStartX())
                            .startY(line.getStartY())
                            .endX(line.getEndX())
                            .endY(line.getEndY())
                            .build();
                    lineEntity.setConstellation(savedConstellation);
                    return lineEntity;
                })
                .collect(Collectors.toList());

        constellationLineRepository.saveAll(lineEntities);

        log.info("✅ 유저 별자리 저장 완료 - ID: {}", savedConstellation.getConstellationId());

        return ConstellationDto.builder()
                .constellationId(savedConstellation.getConstellationId())
                .userId(savedConstellation.getUserId())
                .createdAt(savedConstellation.getCreatedAt())
                .lines(constellationDto.getLines())
                .build();
    }
}
