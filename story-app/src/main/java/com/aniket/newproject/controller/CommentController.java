package com.aniket.newproject.controller;

import com.aniket.newproject.dto.CommentRequest;
import com.aniket.newproject.model.Comment;
import com.aniket.newproject.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/stories/{storyId}/chapters/{chapterId}")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/comments")
    public ResponseEntity<List<Comment>> getCommentsByChapter(
            @PathVariable UUID storyId,
            @PathVariable UUID chapterId) {
        commentService.validateChapterBelongsToStory(chapterId, storyId);
        return ResponseEntity.ok(commentService.getCommentsByChapter(chapterId));
    }

    @PostMapping("/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable UUID storyId,
            @PathVariable UUID chapterId,
            @RequestBody CommentRequest request) {
        commentService.validateChapterBelongsToStory(chapterId, storyId);
        Comment comment = commentService.addComment(request.getUserId(), chapterId, request.getContent());
        return ResponseEntity.ok(comment);
    }

    @PostMapping("/comments/{commentId}/reply")
    public ResponseEntity<Comment> replyToComment(
            @PathVariable UUID storyId,
            @PathVariable UUID chapterId,
            @PathVariable UUID commentId,
            @RequestBody CommentRequest request) {
        commentService.validateChapterBelongsToStory(chapterId, storyId);
        Comment reply = commentService.replyToComment(commentId, request.getUserId(), request.getContent());
        return ResponseEntity.ok(reply);
    }

    @PostMapping("/comments/{commentId}/like")
    public ResponseEntity<Void> likeComment(
            @PathVariable UUID storyId,
            @PathVariable UUID chapterId,
            @PathVariable UUID commentId,
            @RequestParam UUID userId) {
        commentService.validateChapterBelongsToStory(chapterId, storyId);
        commentService.toggleCommentLike(commentId, userId);
        return ResponseEntity.ok().build();
    }

    // Additional methods for update and delete can follow the existing conventions
}
