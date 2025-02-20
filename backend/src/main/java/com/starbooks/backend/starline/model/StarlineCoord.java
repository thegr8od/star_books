package com.starbooks.backend.starline.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "starline_coord")
public class StarlineCoord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "starline_coord_id")
    private Long starlineCoordId;

    @Column(nullable = false)
    private Long startEmotionId;

    @Column(nullable = false)
    private Long endEmotionId;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private int month;
}
