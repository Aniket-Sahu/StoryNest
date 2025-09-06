package com.aniket.newproject.repo;

import com.aniket.newproject.model.Story;
import com.aniket.newproject.model.Genre;
import com.aniket.newproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface StoryRepository extends JpaRepository<Story, UUID> {
    List<Story> findByGenre(Genre genre);
    List<Story> findByAuthor(User author);
    List<Story> findByTitleContainingIgnoreCase(String title);
    List<Story> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    // Alternative: More advanced search with author username
    @Query("SELECT s FROM Story s WHERE " +
            "LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.author.username) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Story> searchStoriesAdvanced(@Param("query") String query);
}
