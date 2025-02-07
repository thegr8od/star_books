package com.starbooks.backend.radio.dto.responese;


import com.starbooks.backend.radio.model.BroadcastRoom;
import com.starbooks.backend.radio.model.BroadcastRoom.status;
import java.time.Instant;

public record BroadcastResponse(
        String roomId,
        String title,
        status status,
        Instant createdAt
) {
    public static BroadcastResponse from(BroadcastRoom room) {
        return new BroadcastResponse(
                room.getRadio_id(),
                room.getTitle(),
                room.getStatus(),
                room.getCreatedAt()
        );
    }
}