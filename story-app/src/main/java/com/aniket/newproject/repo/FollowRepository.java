package com.aniket.newproject.repo;

import com.aniket.newproject.model.Follow;
import com.aniket.newproject.model.FollowId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follow, FollowId> {
    List<Follow> findAllByIdFollowerId(UUID followerId);
    List<Follow> findAllByIdFollowingId(UUID followingId);
}
