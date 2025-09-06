package com.aniket.newproject.service;

import com.aniket.newproject.model.Chapter;
import com.aniket.newproject.model.Story;
import com.aniket.newproject.repo.ChapterRepository;
import com.aniket.newproject.repo.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final StoryRepository storyRepository;

    public List<Chapter> getChaptersByStoryId(UUID storyId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));
        return chapterRepository.findByStory(story);
    }

    public Chapter getChapterByNumber(UUID storyId, int chapterNumber) {
        return chapterRepository.findByStoryIdAndNumber(storyId, chapterNumber)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));
    }

    public Chapter getChapterById(UUID chapterId) {
        return chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));
    }
}
