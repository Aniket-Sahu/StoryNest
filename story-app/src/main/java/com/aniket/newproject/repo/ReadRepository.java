package com.aniket.newproject.repo;

import com.aniket.newproject.model.Read;
import com.aniket.newproject.model.ReadId;
import com.aniket.newproject.model.ReadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ReadRepository extends JpaRepository<Read, ReadId> {
    List<Read> findByUserIdAndStatus(UUID userId, ReadStatus status);
    List<Read> findByIdUserId(UUID userId);
    List<Read> findByUserId(UUID userId);
    @Query("SELECT r FROM Read r WHERE r.user.id = :userId ORDER BY r.lastReadAt DESC")
    List<Read> findByUserIdOrderByLastReadAtDesc(@Param("userId") UUID userId);
    @Query("SELECT r FROM Read r WHERE r.user.id = :userId AND r.status = :status ORDER BY r.lastReadAt DESC")
    List<Read> findByUserIdAndStatusOrderByLastReadAtDesc(@Param("userId") UUID userId, @Param("status") ReadStatus status);
}
