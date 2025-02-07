package com.starbooks.backend.radio.service;

import com.starbooks.backend.radio.dto.request.StartBroadcastRequest;
import com.starbooks.backend.radio.dto.responese.BroadcastResponse;
import com.starbooks.backend.radio.exception.BroadcastException;
import com.starbooks.backend.radio.handler.MediasoupHandler;
import com.starbooks.backend.radio.model.BroadcastRoom;
import com.starbooks.backend.radio.repository.BroadcastRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BroadcastService {

    private final BroadcastRoomRepository roomRepository;
    private final MediasoupHandler mediasoupHandler;

    public BroadcastResponse startBroadcast(StartBroadcastRequest request, String userId) {
        // Mediasoup 워커 생성 및 방 설정
        String roomId = mediasoupHandler.createRoom();

        BroadcastRoom room = BroadcastRoom.builder()
                .roomId(roomId)
                .title(request.getTitle())
                .hostId(userId)
                .status(BroadcastStatus.LIVE)
                .build();

        roomRepository.save(room);

        return BroadcastResponse.from(room);
    }

    public void stopBroadcast(String roomId, String userId) {
        BroadcastRoom room = roomRepository.findById(roomId)
                .orElseThrow(() -> new BroadcastException("Room not found"));

        if (!room.getHostId().equals(userId)) {
            throw new BroadcastException("Unauthorized operation");
        }

        mediasoupHandler.closeRoom(roomId);
        room.setStatus(BroadcastStatus.OFFLINE);
        roomRepository.save(room);
    }
}