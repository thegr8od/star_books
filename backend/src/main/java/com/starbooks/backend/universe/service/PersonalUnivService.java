package com.starbooks.backend.universe.service;

import com.starbooks.backend.universe.dto.request.RequestPersonalUnivDTO;
import com.starbooks.backend.universe.dto.response.ResponsePersonalUnivDTO;
import com.starbooks.backend.universe.model.PersonalUniv;
import com.starbooks.backend.universe.repository.PersonalUnivRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PersonalUnivService {

    private final PersonalUnivRepository personalUnivRepository;

    @Transactional(readOnly = true)
    public List<ResponsePersonalUnivDTO> getMonthlyPersonalUniv(Long userId, int year, int month) {

        // 월의 시작일 (예: 2023-06-01)
        LocalDate startDate = LocalDate.of(year, month, 1);

        // 월의 마지막일 (예: 2023-06-30)
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        log.info("🔍 Fetching monthly data by diary_date for userId={} from {} to {}",
                userId, startDate, endDate);

        // diary_date 기준 조회
        List<PersonalUniv> personalUnivs =
                personalUnivRepository.findByUserIdAndDiaryDateBetween(userId, startDate, endDate);

        return personalUnivs.stream()
                .map(ResponsePersonalUnivDTO::new)
                .collect(Collectors.toList());
    }



    @Transactional(readOnly = true)
    public List<ResponsePersonalUnivDTO> getYearlyPersonalUniv(Long userId, int year) {

        // 연초 (예: 2023-01-01)
        LocalDate startDate = LocalDate.of(year, 1, 1);

        // 연말 (예: 2023-12-31)
        LocalDate endDate = LocalDate.of(year, 12, 31);

        log.info("🔍 Searching for userId={} by diary_date from {} to {}", userId, startDate, endDate);

        List<PersonalUniv> personalUnivs =
                personalUnivRepository.findByUserIdAndDiaryDateBetween(userId, startDate, endDate);

        return personalUnivs.stream()
                .map(ResponsePersonalUnivDTO::new)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public ResponsePersonalUnivDTO getPersonalUniv(Long userId, Long universeId) {
        return personalUnivRepository.findByUserIdAndUniverseId(userId, universeId)
                .map(ResponsePersonalUnivDTO::new)
                .orElse(null);
    }

    @Transactional
    public List<ResponsePersonalUnivDTO> saveOrUpdatePersonalUnivs(Long userId, List<RequestPersonalUnivDTO> requestList) {
        List<ResponsePersonalUnivDTO> responseList = new ArrayList<>();

        for (RequestPersonalUnivDTO request : requestList) {
            Optional<PersonalUniv> existingUniv = personalUnivRepository.findByUserIdAndDiaryEmotionId(userId, request.getDiaryEmotionId());

            PersonalUniv personalUniv;
            if (existingUniv.isPresent()) {
                // ✅ 기존 데이터 업데이트
                personalUniv = existingUniv.get();
                personalUniv.setXCoord(request.getXCoord());
                personalUniv.setYCoord(request.getYCoord());
                personalUniv.setUpdatedAt(LocalDateTime.now());
            } else {
                // ✅ 새로운 데이터 생성
                personalUniv = new PersonalUniv();
                personalUniv.setDiaryEmotion(existingUniv.map(PersonalUniv::getDiaryEmotion)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 diaryEmotionId")));

                personalUniv.setXCoord(request.getXCoord());
                personalUniv.setYCoord(request.getYCoord());
                personalUniv.setUpdatedAt(LocalDateTime.now());
            }

            personalUnivRepository.save(personalUniv);
            responseList.add(new ResponsePersonalUnivDTO(personalUniv));  // 변환 후 리스트에 추가
        }

        return responseList;
    }
}
