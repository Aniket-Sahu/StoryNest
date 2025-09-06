package com.aniket.newproject.controller;

import com.aniket.newproject.model.Rating;
import com.aniket.newproject.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/stories/{storyId}/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @GetMapping
    public ResponseEntity<Rating> getByStoryIdFromUser(
            @PathVariable UUID storyId,
            @RequestParam UUID userId) {

        Rating rating = ratingService.getRatingByUserAndStory(userId, storyId);
        if (rating == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(rating);
    }


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
