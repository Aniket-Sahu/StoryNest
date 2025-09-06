package com.aniket.newproject.controller;

import com.aniket.newproject.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/stories/{storyId}/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<String> rateStory(
            @RequestParam UUID userId,
            @PathVariable UUID storyId,
            @RequestParam int rating
    ) {
        ratingService.rate(userId, storyId, rating);
        return ResponseEntity.ok("Rating submitted");
    }
}
