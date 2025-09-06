package com.aniket.newproject.controller;

import com.aniket.newproject.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/stories/{storyId}/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @GetMapping
    public ResponseEntity<Boolean> hasUserLikedStory(
            @PathVariable UUID storyId,
            @RequestParam UUID userId) {
        boolean liked = likeService.hasUserLikedStory(userId, storyId);
        return ResponseEntity.ok(liked);
    }

    @PostMapping
    public ResponseEntity<String> likeStory(
            @PathVariable UUID storyId,
            @RequestParam UUID userId
    ) {
        likeService.like(userId, storyId);
        return ResponseEntity.ok("Liked story");
    }

    @DeleteMapping
    public ResponseEntity<String> unlikeStory(
            @PathVariable UUID storyId,
            @RequestParam UUID userId
    ) {
        likeService.unlike(userId, storyId);
        return ResponseEntity.ok("Unliked story");
    }
}
