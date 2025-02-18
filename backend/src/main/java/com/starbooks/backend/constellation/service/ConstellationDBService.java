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

    /**
     * 🔄 AI가 생성한 별자리 데이터의 선 정보 업데이트
     */
    @Transactional
    public boolean updateConstellationLines(Long userId, Long constellationId, List<ConstellationLineDto> updatedLines) {
        log.info("🔄 별자리 데이터 수정 요청 - userId: {}, constellationId: {}", userId, constellationId);

        // 해당 별자리가 AI가 생성한 데이터인지 확인 (유저가 직접 업로드한 데이터는 수정 불가)
        Constellation constellation = constellationRepository.findById(constellationId)
                .orElseThrow(() -> new IllegalArgumentException("해당 별자리를 찾을 수 없습니다."));

        if (!constellation.getUserId().equals(userId)) {
            log.warn("⛔️ 사용자 권한 없음 - userId: {}, constellationId: {}", userId, constellationId);
            return false;
        }

        // 기존 선 데이터를 모두 삭제하고 새로운 선 데이터로 업데이트
        constellationLineRepository.deleteByConstellation_ConstellationId(constellationId);

        List<ConstellationLine> newLines = updatedLines.stream()
                .map(lineDto -> ConstellationLine.builder()
                        .constellation(constellation)
                        .startX(lineDto.getStartX())
                        .startY(lineDto.getStartY())
                        .endX(lineDto.getEndX())
                        .endY(lineDto.getEndY())
                        .build())
                .collect(Collectors.toList());

        constellationLineRepository.saveAll(newLines);
        log.info("✅ 별자리 데이터 수정 완료 - constellationId: {}", constellationId);

        return true;
    }

    /**
     * ❌ AI가 생성한 별자리 삭제 (선 데이터 포함)
     */
    @Transactional
    public boolean deleteConstellation(Long userId, Long constellationId) {
        log.info("❌ 별자리 삭제 요청 - userId: {}, constellationId: {}", userId, constellationId);

        // 해당 별자리가 존재하는지 및 AI 생성 여부 확인
        Optional<Constellation> constellationOpt = constellationRepository.findByConstellationIdAndGeneratedByAI(constellationId, true);

        if (constellationOpt.isEmpty()) {
            log.warn("⛔️ 존재하지 않는 별자리 - constellationId: {}", constellationId);
            return false;
        }

        Constellation constellation = constellationOpt.get();

        // 현재 사용자가 해당 별자리의 주인인지 확인
        if (!constellation.getUserId().equals(userId)) {
            log.warn("⛔️ 사용자 권한 없음 - userId: {}, constellationId: {}", userId, constellationId);
            return false;
        }

        // 별자리의 선 데이터 삭제
        constellationLineRepository.deleteByConstellation_ConstellationId(constellationId);

        // 별자리 자체 삭제
        constellationRepository.delete(constellation);
        log.info("✅ 별자리 삭제 완료 - constellationId: {}", constellationId);

        return true;
    }


}
