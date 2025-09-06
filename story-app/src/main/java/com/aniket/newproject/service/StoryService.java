package com.aniket.newproject.service;

import com.aniket.newproject.model.Story;
import com.aniket.newproject.model.Genre;
import com.aniket.newproject.model.Chapter;
import com.aniket.newproject.model.User;
import com.aniket.newproject.repo.StoryRepository;
import com.aniket.newproject.repo.ChapterRepository;
import com.aniket.newproject.repo.GenreRepository;
import com.aniket.newproject.repo.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final GenreRepository genreRepository;
    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;

    public Story createStory(Story story) {
        story.setCreatedAt(LocalDateTime.now());
        story.setUpdatedAt(LocalDateTime.now());
        return storyRepository.save(story);
    }

    public List<Story> getStoriesByGenre(String genreName) {
        Genre genre = genreRepository.findByName(genreName)
                .orElseThrow(() -> new RuntimeException("Genre not found"));
        return storyRepository.findByGenre(genre);
    }

    public List<Story> getStoriesByUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return storyRepository.findByAuthor(user);
    }

    public Story getStoryById(UUID storyId) {
        return storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));
    }

    public List<Story> searchStories(String query) {
        return storyRepository.findByTitleContainingIgnoreCase(query);
    }

    public List<Chapter> getChaptersByStoryId(UUID storyId) {
        return chapterRepository.findByStoryIdOrderByNumber(storyId);
    }

    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }
}
