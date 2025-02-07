package com.starbooks.backend.radio.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.sql.Timestamp;

@Entity(name = "radio")
@Getter
@Table(name = "radio")
public class BroadcastRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int radio_id;

    @JoinColumn(name = "user_id")
    private int user_id;

    private String title;

    private Timestamp start_time;

    public enum status {
        start,stopped,paused
    }


}
