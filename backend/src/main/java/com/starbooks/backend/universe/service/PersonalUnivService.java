package com.starbooks.backend.universe.service;

import com.starbooks.backend.universe.dto.request.RequestPersonalUnivDTO;
import com.starbooks.backend.universe.dto.response.ResponsePersonalUnivDTO;
import com.starbooks.backend.universe.model.PersonalUniv;
import com.starbooks.backend.universe.repository.PersonalUnivRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        // 월의 시작 날짜: 해당 연도, 월의 1일 00:00:00
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);

        // 월의 마지막 날짜: 해당 연도, 월의 마지막 날 23:59:59.999999999
        LocalDateTime end = start.withDayOfMonth(start.toLocalDate().lengthOfMonth()).withHour(23).withMinute(59).withSecond(59).withNano(999999999);

        log.info("🔍 Fetching monthly data for userId={} from {} to {}", userId, start, end);

        List<PersonalUniv> personalUnivs = personalUnivRepository.findByUserIdAndUpdatedAtBetween(userId, start, end);

        return personalUnivs.stream().map(ResponsePersonalUnivDTO::new).collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public List<ResponsePersonalUnivDTO> getYearlyPersonalUniv(Long userId, int year) {
        LocalDateTime start = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime end = start.plusYears(1).minusSeconds(1);
        log.info("🔍 Searching for userId={} from {} to {}", userId, start, end); // ✅ 로그로 날짜 확인

        List<PersonalUniv> personalUnivs = personalUnivRepository.findByUserIdAndUpdatedAtBetween(userId, start, end);
        return personalUnivs.stream().map(ResponsePersonalUnivDTO::new).collect(Collectors.toList());
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
