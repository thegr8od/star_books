package com.starbooks.backend.radio.controller;

import com.starbooks.backend.radio.dto.request.StartBroadcastRequest;
import com.starbooks.backend.radio.dto.responese.BroadcastResponse;
import com.starbooks.backend.radio.service.BroadcastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/broadcast")
@RequiredArgsConstructor
public class RadioController {

    private final BroadcastService broadcastService;

    @PostMapping("/start")
    public ResponseEntity<BroadcastResponse> startBroadcast(
            @RequestBody StartBroadcastRequest request,
            Principal principal) {
        return ResponseEntity.ok(broadcastService.startBroadcast(request, principal.getName()));
    }

    @PostMapping("/stop/{roomId}")
    public ResponseEntity<Void> stopBroadcast(
            @PathVariable String roomId,
            Principal principal) {
        broadcastService.stopBroadcast(roomId, principal.getName());
        return ResponseEntity.ok().build();
    }
}
