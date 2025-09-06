package com.aniket.newproject.controller;

import com.aniket.newproject.model.Read;
import com.aniket.newproject.model.ReadStatus;
import com.aniket.newproject.service.ReadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reads")
@RequiredArgsConstructor
public class ReadController {

    private final ReadService readService;

    @PostMapping("/update-status")
    public ResponseEntity<Read> updateReadStatus(
            @RequestParam UUID userId,
            @RequestParam UUID storyId,
            @RequestParam ReadStatus status
    ) {
        return ResponseEntity.ok(readService.updateReadStatus(userId, storyId, status));
    }

    @GetMapping("/{userId}/{status}")
    public ResponseEntity<List<Read>> getByUserAndStatus(
            @PathVariable UUID userId,
            @PathVariable ReadStatus status
    ) {
        return ResponseEntity.ok(readService.getReadsByStatus(userId, status));
    }
}
