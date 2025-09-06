package com.aniket.newproject.repo;

import com.aniket.newproject.model.Like;
import com.aniket.newproject.model.LikeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LikeRepository extends JpaRepository<Like, LikeId> {
    List<Like> findByIdUserId(UUID userId);
    boolean existsByUserIdAndStoryId(UUID userId, UUID storyId);
}
