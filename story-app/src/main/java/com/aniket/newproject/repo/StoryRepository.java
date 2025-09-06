package com.aniket.newproject.repo;

import com.aniket.newproject.model.Story;
import com.aniket.newproject.model.Genre;
import com.aniket.newproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StoryRepository extends JpaRepository<Story, UUID> {
    List<Story> findByGenre(Genre genre);
    List<Story> findByAuthor(User author);
    List<Story> findByTitleContainingIgnoreCase(String title);
}
