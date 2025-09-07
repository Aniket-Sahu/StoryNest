package com.aniket.newproject.service;

import com.aniket.newproject.model.*;
import com.aniket.newproject.repo.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReadService {

    private final ReadRepository readRepository;
    private final UserRepository userRepository;
    private final StoryRepository storyRepository;
    private final ChapterRepository chapterRepository;

    public Read getUserReadStatus(UUID userId, UUID storyId) {
        ReadId readId = new ReadId(userId, storyId);
        return readRepository.findById(readId).orElse(null);
    }

    public List<Read> getUserReads(UUID userId) {
        return readRepository.findByUserId(userId);
    }

    public List<Read> getReadsByStatus(UUID userId, ReadStatus status) {
        return readRepository.findByUserIdAndStatus(userId, status);
    }

    @Transactional
    public Read addOrUpdateReadingStatus(UUID userId, UUID storyId, ReadStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        ReadId readId = new ReadId(userId, storyId);
        Read read = readRepository.findById(readId).orElse(null);

        if (read == null) {
            read = Read.builder()
                    .id(readId)
                    .user(user)
                    .story(story)
                    .status(status)
                    .currentChapter(0)
                    .progress(0)
                    .lastReadAt(LocalDateTime.now())
                    .build();
        } else {
            read.setStatus(status);
            read.setUpdatedAt(LocalDateTime.now());
        }

        return readRepository.save(read);
    }

    @Transactional
    public Read updateReadingProgress(UUID userId, UUID storyId, Integer chapterNumber, Integer progress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        ReadId readId = new ReadId(userId, storyId);
        Read read = readRepository.findById(readId).orElse(null);

        if (read == null) {
            read = Read.builder()
                    .id(readId)
                    .user(user)
                    .story(story)
                    .status(ReadStatus.READING) // Default to READING on first progress
                    .currentChapter(chapterNumber)
                    .progress(progress != null ? progress : 0)
                    .lastReadAt(LocalDateTime.now())
                    .build();
        } else {
            read.setCurrentChapter(chapterNumber);
            if (progress != null) {
                read.setProgress(progress);
            }
            read.setLastReadAt(LocalDateTime.now());
            read.setUpdatedAt(LocalDateTime.now());

            // Auto-set status to READING if no status or not reading/completed
            if (read.getStatus() == null ||
                    (read.getStatus() != ReadStatus.READING && read.getStatus() != ReadStatus.COMPLETED)) {
                read.setStatus(ReadStatus.READING);
            }
        }

        Optional<Chapter> chapterOpt = chapterRepository.findByStoryIdAndNumber(storyId, chapterNumber);
        if (chapterOpt.isPresent()) {
            read.setLastChapterRead(chapterOpt.get());
        }

        return readRepository.save(read);
    }

    /**
     * Remove from reading list
     */
    @Transactional
    public void removeFromReadingList(UUID userId, UUID storyId) {
        ReadId readId = new ReadId(userId, storyId);
        readRepository.deleteById(readId);
    }
}
