package com.aniket.newproject.service;

import com.aniket.newproject.model.Comment;
import com.aniket.newproject.model.User;
import com.aniket.newproject.model.Chapter;
import com.aniket.newproject.repo.CommentRepository;
import com.aniket.newproject.repo.UserRepository;
import com.aniket.newproject.repo.ChapterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;

    public List<Comment> getCommentsByChapter(UUID chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));
        return commentRepository.findByChapterAndParentCommentIsNullOrderByCreatedAtAsc(chapter);
    }

    public Comment addComment(UUID userId, UUID chapterId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setChapter(chapter);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        comment.setParentComment(null);
        comment.setLikeCount(0);

        return commentRepository.save(comment);
    }

    public Comment replyToComment(UUID parentCommentId, UUID userId, String content) {
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment reply = new Comment();
        reply.setUser(user);
        reply.setChapter(parentComment.getChapter());
        reply.setContent(content);
        reply.setCreatedAt(LocalDateTime.now());
        reply.setUpdatedAt(LocalDateTime.now());
        reply.setParentComment(parentComment);
        reply.setLikeCount(0);

        return commentRepository.save(reply);
    }

    public void toggleCommentLike(UUID commentId, UUID userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // For simplicity, just increment like count.
        // Extend this with a separate Like entity for real per-user tracking.

        comment.setLikeCount(comment.getLikeCount() + 1);
        commentRepository.save(comment);
    }

    public void validateChapterBelongsToStory(UUID chapterId, UUID storyId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));
        if (!chapter.getStory().getId().equals(storyId)) {
            throw new RuntimeException("Chapter does not belong to the given story");
        }
    }
}
