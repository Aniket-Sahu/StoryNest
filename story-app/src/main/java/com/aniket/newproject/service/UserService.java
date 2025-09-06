package com.aniket.newproject.service;

import com.aniket.newproject.dto.RegisterRequest;
import com.aniket.newproject.model.*;
import com.aniket.newproject.repo.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final ReadRepository readRepository;
    private final LikeRepository likeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Use the injected one for JWT

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    // ========== EXISTING METHODS (UNCHANGED) ==========

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User authenticateUser(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (encoder.matches(password, user.getPassword())) {
            return user;
        } else {
            throw new RuntimeException("Invalid password");
        }
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public User findById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }

    @Transactional
    public void followUser(UUID followerId, UUID followeeId) {
        if (followerId.equals(followeeId)) {
            throw new IllegalArgumentException("User cannot follow themselves");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followee = userRepository.findById(followeeId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        FollowId followId = new FollowId(followerId, followeeId);
        if (!followRepository.existsById(followId)) {
            Follow follow = new Follow(followId, follower, followee, LocalDateTime.now());
            followRepository.save(follow);
        }
    }

    @Transactional
    public void unfollowUser(UUID followerId, UUID followeeId) {
        FollowId followId = new FollowId(followerId, followeeId);
        followRepository.deleteById(followId);
    }

    public List<User> getFollowers(UUID userId) {
        return followRepository.findAllByIdFollowingId(userId)
                .stream()
                .map(Follow::getFollower)
                .collect(Collectors.toList());
    }

    public List<User> getFollowing(UUID userId) {
        return followRepository.findAllByIdFollowerId(userId)
                .stream()
                .map(Follow::getFollowing)
                .collect(Collectors.toList());
    }

    public List<Read> getUserReads(UUID userId) {
        return readRepository.findByIdUserId(userId);
    }

    public Read addToReads(Read read) {
        return readRepository.save(read);
    }

    public Read updateReadingProgress(UUID userId, UUID storyId, Read updatedRead) {
        ReadId readId = new ReadId(userId, storyId);
        Read existingRead = readRepository.findById(readId)
                .orElseThrow(() -> new RuntimeException("Reading record not found"));

        existingRead.setStatus(updatedRead.getStatus());
        existingRead.setCurrentChapter(updatedRead.getCurrentChapter());
        existingRead.setProgress(updatedRead.getProgress());
        existingRead.setLastReadAt(LocalDateTime.now());

        return readRepository.save(existingRead);
    }

    public void removeFromReads(UUID userId, UUID storyId) {
        ReadId readId = new ReadId(userId, storyId);
        readRepository.deleteById(readId);
    }

    public List<Story> getUserLikedStories(UUID userId) {
        return likeRepository.findByIdUserId(userId)
                .stream()
                .map(Like::getStory)
                .collect(Collectors.toList());
    }

    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public User createUser(RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        // Use the injected passwordEncoder for consistency with JWT
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setBio(registerRequest.getBio() != null ? registerRequest.getBio() : "");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public Optional<User> findByUsernameOptional(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmailOptional(String email) {
        return userRepository.findByEmail(email);
    }
}
