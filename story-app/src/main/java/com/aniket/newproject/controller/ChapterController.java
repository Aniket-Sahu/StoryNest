package com.aniket.newproject.controller;

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
}

