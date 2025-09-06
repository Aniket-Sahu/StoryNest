package com.aniket.newproject.service;

import com.aniket.newproject.model.*;
import com.aniket.newproject.repo.RatingRepository;
import com.aniket.newproject.repo.StoryRepository;
import com.aniket.newproject.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final StoryRepository storyRepository;

    public void rate(UUID userId, UUID storyId, int ratingValue) {
        if (ratingValue < 1 || ratingValue > 5) throw new IllegalArgumentException("Invalid rating");

        User user = userRepository.findById(userId).orElseThrow();
        Story story = storyRepository.findById(storyId).orElseThrow();

        RatingId id = new RatingId(userId, storyId);
        Rating rating = new Rating(id, user, story, ratingValue, LocalDateTime.now());
        ratingRepository.save(rating);

        // update story ratingAvg
        List<Rating> ratings = ratingRepository.findByStory(story);
        double avg = ratings.stream().mapToInt(Rating::getRating).average().orElse(0);
        story.setRatingAvg((float) avg);
        storyRepository.save(story);
    }

    public Rating getRatingByUserAndStory(UUID userId, UUID storyId) {
        return ratingRepository.findByUserIdAndStoryId(userId, storyId).orElse(null);
    }
}
