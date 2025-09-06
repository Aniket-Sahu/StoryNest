package com.aniket.newproject.repo;

import com.aniket.newproject.model.Read;
import com.aniket.newproject.model.ReadId;
import com.aniket.newproject.model.ReadStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReadRepository extends JpaRepository<Read, ReadId> {
    List<Read> findByUserIdAndStatus(UUID userId, ReadStatus status);
    List<Read> findByIdUserId(UUID userId);
}
