package com.aniket.newproject.repo;

import com.aniket.newproject.model.Genre;
import com.aniket.newproject.model.Story;
import com.aniket.newproject.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface StoryRepository extends JpaRepository<Story, UUID> {

    Page<Story> findByIsPublishedTrue(Pageable pageable);

    List<Story> findByIsPublishedTrue();

    Page<Story> findByGenreNameAndIsPublishedTrue(String genreName, Pageable pageable);

    List<Story> findByGenreName(String genreName);

    List<Story> findByAuthorId(UUID authorId);

    @Query("SELECT s FROM Story s WHERE s.isPublished = true AND s.ratingAvg > 0 ORDER BY s.ratingAvg DESC, s.likeCount DESC, s.readCount DESC")
    List<Story> findTrendingStories(Pageable pageable);

    @Query("SELECT s FROM Story s WHERE s.isPublished = true " +
            "AND (LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Story> searchPublishedStories(@Param("query") String query, Pageable pageable);

    List<Story> findByGenre(Genre genre);
    List<Story> findByAuthor(User user);
    List<Story> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String query, String query1);
    Page<Story> findByGenreAndIsPublishedTrue(Genre genre, Pageable pageable);
    List<Story> findByTitleContainingIgnoreCaseAndIsPublishedTrue(String query, Pageable pageable);

    @Query("SELECT s FROM Story s WHERE s.isPublished = true AND s.genre.name = :genreName AND s.ratingAvg > 0 ORDER BY s.ratingAvg DESC, s.likeCount DESC, s.readCount DESC")
    List<Story> findTrendingStoriesByGenre(@Param("genreName") String genreName, Pageable pageable);

    @Query("SELECT s FROM Story s WHERE s.isPublished = true AND s.genre.name = :genreName ORDER BY s.readCount DESC, s.likeCount DESC, s.ratingAvg DESC")
    List<Story> findPopularStoriesByGenre(@Param("genreName") String genreName, Pageable pageable);
}
