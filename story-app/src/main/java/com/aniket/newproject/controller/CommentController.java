package com.aniket.newproject.controller;

import com.aniket.newproject.model.Comment;
import com.aniket.newproject.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/stories/{storyId}/chapters/{chapterId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> addComment(
            @PathVariable UUID storyId,
            @PathVariable UUID chapterId,
            @RequestParam UUID userId,
            @RequestBody String content
    ) {
        commentService.validateChapterBelongsToStory(chapterId, storyId);
        return ResponseEntity.ok(commentService.addComment(userId, chapterId, content));
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(
            @PathVariable UUID storyId,
            @PathVariable UUID chapterId
    ) {
        commentService.validateChapterBelongsToStory(chapterId, storyId);
        return ResponseEntity.ok(commentService.getCommentsByChapter(chapterId));
    }
}
