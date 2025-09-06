package com.aniket.newproject.repo;

import com.aniket.newproject.model.Rating;
import com.aniket.newproject.model.RatingId;
import com.aniket.newproject.model.Story;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, RatingId> {
    List<Rating> findByStory(Story story);
}
