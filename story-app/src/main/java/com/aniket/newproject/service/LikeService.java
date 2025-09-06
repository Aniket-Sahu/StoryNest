package com.aniket.newproject.service;

import com.aniket.newproject.model.*;
import com.aniket.newproject.repo.LikeRepository;
import com.aniket.newproject.repo.StoryRepository;
import com.aniket.newproject.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final StoryRepository storyRepository;

    public void like(UUID userId, UUID storyId) {
        User user = userRepository.findById(userId).orElseThrow();
        Story story = storyRepository.findById(storyId).orElseThrow();
        LikeId id = new LikeId(userId, storyId);

        if (!likeRepository.existsById(id)) {
            Like like = new Like(id, user, story, LocalDateTime.now());
            likeRepository.save(like);
            story.setLikeCount(story.getLikeCount() + 1);
            storyRepository.save(story);
        }
    }

    public void unlike(UUID userId, UUID storyId) {
        LikeId id = new LikeId(userId, storyId);
        if (likeRepository.existsById(id)) {
            likeRepository.deleteById(id);
            Story story = storyRepository.findById(storyId).orElseThrow();
            story.setLikeCount(Math.max(0, story.getLikeCount() - 1));
            storyRepository.save(story);
        }
    }

    public boolean hasUserLikedStory(UUID userId, UUID storyId) {
        return likeRepository.existsByUserIdAndStoryId(userId, storyId);
    }
}
