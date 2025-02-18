package com.starbooks.backend.constellation.model;  // 패키지 경로 확인

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "constellation")  // 테이블 이름 지정
public class Constellation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long constellationId; // 별자리 ID (PK)

    @Column(nullable = false)
    private Long userId; // 생성한 사용자 ID

    @Column(nullable = false)
    private LocalDateTime createdAt; // 생성 날짜

    @OneToMany(mappedBy = "constellation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ConstellationLine> lines; // 선분 리스트
}
