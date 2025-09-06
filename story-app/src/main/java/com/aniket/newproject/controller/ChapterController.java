package com.aniket.newproject.controller;

import com.aniket.newproject.dto.ChapterRequest;
import com.aniket.newproject.model.Chapter;
import com.aniket.newproject.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/stories/{storyId}")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;

    @GetMapping("/chapters")
    public ResponseEntity<List<Chapter>> getChaptersByStory(@PathVariable UUID storyId) {
        return ResponseEntity.ok(chapterService.getChaptersByStoryId(storyId));
    }

    @GetMapping("/{chapterId}")
    public ResponseEntity<Chapter> getChapterById(
            @PathVariable UUID storyId,
            @PathVariable UUID chapterId
    ) {
        return ResponseEntity.ok(chapterService.getChapterById(chapterId));
    }

    @GetMapping("/chapter/{chapterNumber}")
    public ResponseEntity<Chapter> getChapterByNumber(
            @PathVariable UUID storyId,
            @PathVariable int chapterNumber) {
        return ResponseEntity.ok(chapterService.getChapterByNumber(storyId, chapterNumber));
    }

    @PostMapping("/chapters")
    public ResponseEntity<Chapter> createChapter(
            @PathVariable UUID storyId,
            @RequestBody ChapterRequest request) {
        Chapter chapter = chapterService.createChapter(storyId, request);
        return ResponseEntity.ok(chapter);
    }

    @PutMapping("/chapters/{chapterId}")
    public ResponseEntity<Chapter> updateChapter(
            @PathVariable UUID storyId,
            @PathVariable UUID chapterId,
            @RequestBody ChapterRequest request) {
        Chapter chapter = chapterService.updateChapter(storyId, chapterId, request);
        return ResponseEntity.ok(chapter);
    }

    @DeleteMapping("/chapters/{chapterId}")
    public ResponseEntity<Void> deleteChapter(
            @PathVariable UUID storyId,
            @PathVariable UUID chapterId) {
        chapterService.deleteChapter(storyId, chapterId);
        return ResponseEntity.ok().build();
    }
}

