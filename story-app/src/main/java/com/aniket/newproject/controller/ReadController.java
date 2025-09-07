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

    // Add or update reading status (WANT_TO_READ, READING, COMPLETED, LIKED)
    @PostMapping("/status")
    public ResponseEntity<Read> addOrUpdateReadingStatus(
            @RequestParam UUID userId,
            @RequestParam UUID storyId,
            @RequestParam ReadStatus status
    ) {
        Read read = readService.addOrUpdateReadingStatus(userId, storyId, status);
        return ResponseEntity.ok(read);
    }

    // Get list of reads by user and status (e.g. READING, COMPLETED)
    @GetMapping("/{userId}/{status}")
    public ResponseEntity<List<Read>> getByUserAndStatus(
            @PathVariable UUID userId,
            @PathVariable ReadStatus status
    ) {
        return ResponseEntity.ok(readService.getReadsByStatus(userId, status));
    }

    // Get reading status record for specific user + story
    @GetMapping("/user/{userId}/story/{storyId}")
    public ResponseEntity<Read> getUserReadStatus(
            @PathVariable UUID userId,
            @PathVariable UUID storyId
    ) {
        Read read = readService.getUserReadStatus(userId, storyId);
        if (read != null) {
            return ResponseEntity.ok(read);
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/progress")
    public ResponseEntity<Read> updateReadingProgress(
            @RequestParam UUID userId,
            @RequestParam UUID storyId,
            @RequestParam Integer chapterNumber,
            @RequestParam(required = false) Integer progress
    ) {
        Read read = readService.updateReadingProgress(userId, storyId, chapterNumber, progress);
        return ResponseEntity.ok(read);
    }

    // Get all reads for a user (used by MyReads page)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Read>> getUserReads(@PathVariable UUID userId) {
        return ResponseEntity.ok(readService.getUserReads(userId));
    }

    // Remove a story from user's reading list
    @DeleteMapping("/user/{userId}/story/{storyId}")
    public ResponseEntity<Void> removeFromReadingList(
            @PathVariable UUID userId,
            @PathVariable UUID storyId
    ) {
        readService.removeFromReadingList(userId, storyId);
        return ResponseEntity.noContent().build();
    }
}
