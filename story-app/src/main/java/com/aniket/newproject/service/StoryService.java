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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final GenreRepository genreRepository;
    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;

    @Transactional
    public Story createStory(Story story) {
        if ("draft".equalsIgnoreCase(story.getStatus())) {
            story.setPublished(false);
        } else {
            story.setPublished(true);
        }
        story.setCreatedAt(LocalDateTime.now());
        story.setUpdatedAt(LocalDateTime.now());
        return storyRepository.save(story);
    }

    public List<Story> getStoriesByGenre(String genreName) {
        Genre genre = genreRepository.findByName(genreName)
                .orElseThrow(() -> new RuntimeException("Genre not found"));
        return storyRepository.findByGenre(genre);
    }

    public Page<Story> getStoriesByGenrePaginated(String genreName, Pageable pageable) {
        Genre genre = genreRepository.findByName(genreName)
                .orElseThrow(() -> new RuntimeException("Genre not found"));
        return storyRepository.findByGenreAndIsPublishedTrue(genre, pageable);
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

    public List<Story> searchStories(String query, Pageable pageable) {
        return storyRepository.findByTitleContainingIgnoreCaseAndIsPublishedTrue(query, pageable);
    }

    public List<Chapter> getChaptersByStoryId(UUID storyId) {
        return chapterRepository.findByStoryIdOrderByNumber(storyId);
    }

    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }

    public Page<Story> getAllStoriesPaginated(Pageable pageable) {
        return storyRepository.findByIsPublishedTrue(pageable);
    }

    public List<Story> getTrendingStories(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Order.desc("ratingAvg"),
                Sort.Order.desc("likeCount"),
                Sort.Order.desc("readCount")));
        return storyRepository.findTrendingStories(pageable);
    }

    public List<Story> getRecentStories(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Order.desc("updatedAt")));
        return storyRepository.findByIsPublishedTrue(pageable).getContent();
    }

    public List<Story> getTrendingStoriesByGenre(String genreName, int limit, int page) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Order.desc("ratingAvg"),
                        Sort.Order.desc("likeCount"),
                        Sort.Order.desc("readCount")));

        return storyRepository.findTrendingStoriesByGenre(genreName, pageable);
    }

    public List<Story> getPopularStoriesByGenre(String genreName, int limit, int page) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Order.desc("readCount"),
                        Sort.Order.desc("likeCount"),
                        Sort.Order.desc("ratingAvg")));

        return storyRepository.findPopularStoriesByGenre(genreName, pageable);
    }
}
