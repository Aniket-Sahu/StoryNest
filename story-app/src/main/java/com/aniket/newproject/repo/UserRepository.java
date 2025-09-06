package com.aniket.newproject.repo;

import com.aniket.newproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByUsernameContainingIgnoreCaseOrBioContainingIgnoreCase(String username, String bio);
    List<User> findByUsernameContainingIgnoreCase(String username);
}
