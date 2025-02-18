package com.starbooks.backend.constellation.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "constellation_line")
public class ConstellationLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lineId;

    @ManyToOne
    @JoinColumn(name = "constellation_id", nullable = false)
    private Constellation constellation;

    @Column(nullable = false)
    private int startX;

    @Column(nullable = false)
    private int startY;

    @Column(nullable = false)
    private int endX;

    @Column(nullable = false)
    private int endY;
}
