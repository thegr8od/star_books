package com.starbooks.backend.universe.model;

import com.starbooks.backend.diary.model.DiaryEmotion;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "personal_univ")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalUniv {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "universe_id")
    private Long universeId;  // 기본 키

    @OneToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "diary_emotion_id", nullable = false, unique = true)  // ✅ Unique Key 역할
    private DiaryEmotion diaryEmotion;


    @Column(name = "x_coord")
    private Float xCoord;

    @Column(name = "y_coord")
    private Float yCoord;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
