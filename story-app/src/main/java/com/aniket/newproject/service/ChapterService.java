package com.aniket.newproject.service;

import com.aniket.newproject.dto.ChapterRequest;
import com.aniket.newproject.model.Chapter;
import com.aniket.newproject.model.Story;
import com.aniket.newproject.repo.ChapterRepository;
import com.aniket.newproject.repo.StoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    @Transactional
    public Chapter createChapter(UUID storyId, ChapterRequest request) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        // Get the next chapter number
        List<Chapter> existingChapters = chapterRepository.findByStoryOrderByNumber(story);
        int nextChapterNumber = existingChapters.size() + 1;

        Chapter chapter = new Chapter();
        chapter.setTitle(request.getTitle());
        chapter.setContent(request.getContent());
        chapter.setNumber(nextChapterNumber);
        chapter.setStory(story);
        chapter.setCreatedAt(LocalDateTime.now());

        Chapter savedChapter = chapterRepository.save(chapter);

        // Update story's updatedAt timestamp
        story.setUpdatedAt(LocalDateTime.now());
        storyRepository.save(story);

        return savedChapter;
    }

    @Transactional
    public Chapter updateChapter(UUID storyId, UUID chapterId, ChapterRequest request) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        // Verify chapter belongs to the story
        if (!chapter.getStory().getId().equals(storyId)) {
            throw new RuntimeException("Chapter does not belong to this story");
        }

        chapter.setTitle(request.getTitle());
        chapter.setContent(request.getContent());

        Chapter savedChapter = chapterRepository.save(chapter);

        // Update story's updatedAt timestamp
        Story story = chapter.getStory();
        story.setUpdatedAt(LocalDateTime.now());
        storyRepository.save(story);

        return savedChapter;
    }

    @Transactional
    public void deleteChapter(UUID storyId, UUID chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        // Verify chapter belongs to the story
        if (!chapter.getStory().getId().equals(storyId)) {
            throw new RuntimeException("Chapter does not belong to this story");
        }

        // Get chapters after this one to renumber them
        List<Chapter> laterChapters = chapterRepository.findByStoryAndNumberGreaterThan(
                chapter.getStory(), chapter.getNumber());

        // Delete the chapter
        chapterRepository.delete(chapter);

        // Renumber subsequent chapters
        for (Chapter laterChapter : laterChapters) {
            laterChapter.setNumber(laterChapter.getNumber() - 1);
            chapterRepository.save(laterChapter);
        }

        // Update story's updatedAt timestamp
        Story story = chapter.getStory();
        story.setUpdatedAt(LocalDateTime.now());
        storyRepository.save(story);
    }
}
