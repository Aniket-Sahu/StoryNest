package com.aniket.newproject.repo;

import com.aniket.newproject.model.Chapter;
import com.aniket.newproject.model.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChapterRepository extends JpaRepository<Chapter, UUID> {
    List<Chapter> findByStory(Story story);
    List<Chapter> findByStoryOrderByNumber(Story story);
    Optional<Chapter> findByStoryIdAndNumber(UUID storyId, int number);
    List<Chapter> findByStoryIdOrderByNumber(UUID storyId);
    List<Chapter> findByStoryAndNumberGreaterThan(Story story, int number);

    @Query("SELECT MAX(c.number) FROM Chapter c WHERE c.story.id = :storyId")
    Optional<Integer> findMaxChapterNumberByStoryId(@Param("storyId") UUID storyId);
}
