package com.starbooks.backend.radio.handler;

import com.starbooks.backend.radio.exception.BroadcastException;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MediasoupHandler {
    // Mediasoup 워커 및 라우터 관리
    private final Map<String, Worker> workers = new ConcurrentHashMap<>();

    public String createRoom() {
        try {
            Worker worker = new Worker();
            Router router = worker.createRouter();
            String roomId = UUID.randomUUID().toString();
            workers.put(roomId, worker);
            return roomId;
        } catch (Exception e) {
            throw new BroadcastException("Failed to create mediasoup room");
        }
    }

    public void closeRoom(String roomId) {
        Worker worker = workers.remove(roomId);
        if (worker != null) {
            worker.close();
        }
    }
}
