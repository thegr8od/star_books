package com.starbooks.backend.starline.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "starline_coord")
public class StarlineCoord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "starline_coord_id") // 기존 PK 컬럼명과 일치하도록 변경
    private Long starlineCoordId;

    private Long startEmotionId;
    private Long endEmotionId;
    private int year;
    private int month;
}
