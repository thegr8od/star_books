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
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConstellationDBService {

    private final ConstellationRepository constellationRepository;
    private final ConstellationLineRepository constellationLineRepository;

    /**
     * 🌟 별자리 저장 (AI 생성 & 유저 직접 업로드 모두 처리 가능)
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
                .map(line -> ConstellationLine.builder()
                        .constellation(savedConstellation)
                        .startX(line.getStartX())
                        .startY(line.getStartY())
                        .endX(line.getEndX())
                        .endY(line.getEndY())
                        .build())
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
                        .lines(getLinesByConstellationId(constellation.getConstellationId()))
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

    /**
     * 🔄 별자리 데이터 수정 (해당 별자리의 소유자가 맞는지만 확인)
     */
    @Transactional
    public boolean updateConstellationLines(Long userId, Long constellationId, List<ConstellationLineDto> updatedLines) {
        log.info("🔄 별자리 데이터 수정 요청 - userId: {}, constellationId: {}", userId, constellationId);

        // 해당 별자리가 존재하는지 확인
        Optional<Constellation> optionalConstellation = constellationRepository.findById(constellationId);
        if (optionalConstellation.isEmpty()) {
            log.warn("⛔ 존재하지 않는 별자리 - constellationId: {}", constellationId);
            return false;
        }

        Constellation constellation = optionalConstellation.get();

        // 사용자가 소유한 별자리인지 확인
        if (!constellation.getUserId().equals(userId)) {
            log.warn("⛔ 사용자가 소유하지 않은 별자리 수정 시도 - userId: {}, constellationId: {}", userId, constellationId);
            return false;
        }

        // 기존 선 데이터 삭제 후 업데이트
        constellationLineRepository.deleteByConstellation_ConstellationId(constellationId);

        List<ConstellationLine> newLines = updatedLines.stream()
                .map(line -> ConstellationLine.builder()
                        .constellation(constellation)
                        .startX(line.getStartX())
                        .startY(line.getStartY())
                        .endX(line.getEndX())
                        .endY(line.getEndY())
                        .build())
                .collect(Collectors.toList());

        constellationLineRepository.saveAll(newLines);
        log.info("✅ 별자리 데이터 수정 완료 - constellationId: {}", constellationId);

        return true;
    }

    /**
     * ❌ 별자리 삭제 (해당 별자리의 소유자가 맞는지만 확인)
     */
    @Transactional
    public boolean deleteConstellation(Long userId, Long constellationId) {
        log.info("❌ 별자리 삭제 요청 - userId: {}, constellationId: {}", userId, constellationId);

        // 해당 별자리가 존재하는지 확인
        Optional<Constellation> optionalConstellation = constellationRepository.findById(constellationId);
        if (optionalConstellation.isEmpty()) {
            log.warn("⛔ 존재하지 않는 별자리 - constellationId: {}", constellationId);
            return false;
        }

        Constellation constellation = optionalConstellation.get();

        // 사용자가 소유한 별자리인지 확인
        if (!constellation.getUserId().equals(userId)) {
            log.warn("⛔ 사용자가 소유하지 않은 별자리 삭제 시도 - userId: {}, constellationId: {}", userId, constellationId);
            return false;
        }

        // 기존 선 데이터 삭제 후 별자리 삭제
        constellationLineRepository.deleteByConstellation_ConstellationId(constellationId);
        constellationRepository.delete(constellation);
        log.info("✅ 별자리 삭제 완료 - constellationId: {}", constellationId);

        return true;
    }
}
