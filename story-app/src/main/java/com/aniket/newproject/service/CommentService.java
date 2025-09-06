package com.aniket.newproject.service;

import com.aniket.newproject.model.*;
import com.aniket.newproject.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;

    public Comment addComment(UUID userId, UUID chapterId, String content) {
        User user = userRepository.findById(userId).orElseThrow();
        Chapter chapter = chapterRepository.findById(chapterId).orElseThrow();

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setChapter(chapter);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    public void validateChapterBelongsToStory(UUID chapterId, UUID storyId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));
        if (!chapter.getStory().getId().equals(storyId)) {
            throw new RuntimeException("Chapter does not belong to the given story");
        }
    }

    public List<Comment> getCommentsByChapter(UUID chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId).orElseThrow();
        return commentRepository.findByChapter(chapter);
    }
}
