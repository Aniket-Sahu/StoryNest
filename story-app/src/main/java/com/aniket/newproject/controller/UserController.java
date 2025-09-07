package com.aniket.newproject.controller;

import com.aniket.newproject.dto.JwtResponse;
import com.aniket.newproject.dto.LoginRequest;
import com.aniket.newproject.dto.RegisterRequest;
import com.aniket.newproject.config.JwtUtils;
import com.aniket.newproject.model.Read;
import com.aniket.newproject.model.Story;
import com.aniket.newproject.model.User;
import com.aniket.newproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/id/{userId}")
    public ResponseEntity<User> getByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.findById(userId));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtils.generateJwtToken(userDetails);

            User user = userService.findByUsername(loginRequest.getUsername());

            return ResponseEntity.ok(new JwtResponse(jwt, user));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid username or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            if (userService.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Username is already taken!"));
            }

            if (userService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email is already in use!"));
            }

            // Create new user
            User user = userService.createUser(registerRequest);

            // Authenticate and generate JWT
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            registerRequest.getUsername(),
                            registerRequest.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtils.generateJwtToken(userDetails);

            return ResponseEntity.ok(new JwtResponse(jwt, user));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }
    @GetMapping("/{username}")
    public ResponseEntity<User> getByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.findByUsername(username));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable UUID userId, @RequestBody User updatedUser) {
        try {
            User existingUser = userService.findById(userId);
            if (existingUser == null) {
                return ResponseEntity.notFound().build();
            }

            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setBio(updatedUser.getBio());

            User savedUser = userService.updateUser(existingUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update user: " + e.getMessage());
        }
    }

    @PostMapping("/{followerId}/follow/{followeeId}")
    public ResponseEntity<String> followUser(
            @PathVariable UUID followerId,
            @PathVariable UUID followeeId
    ) {
        userService.followUser(followerId, followeeId);
        return ResponseEntity.ok("Followed successfully");
    }

    @PostMapping("/{followerId}/unfollow/{followeeId}")
    public ResponseEntity<String> unfollowUser(
            @PathVariable UUID followerId,
            @PathVariable UUID followeeId
    ) {
        userService.unfollowUser(followerId, followeeId);
        return ResponseEntity.ok("Unfollowed successfully");
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<User>> getFollowers(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getFollowers(userId));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getFollowing(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getFollowing(userId));
    }

    @GetMapping("/{userId}/reads")
    public ResponseEntity<List<Read>> getUserReads(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getUserReads(userId));
    }

    @PostMapping("/{userId}/reads")
    public ResponseEntity<Read> addToReads(
            @PathVariable UUID userId,
            @RequestBody Read read) {
        read.getId().setUserId(userId);
        return ResponseEntity.ok(userService.addToReads(read));
    }

    @PutMapping("/{userId}/reads/{storyId}")
    public ResponseEntity<Read> updateReadingProgress(
            @PathVariable UUID userId,
            @PathVariable UUID storyId,
            @RequestBody Read read) {
        return ResponseEntity.ok(userService.updateReadingProgress(userId, storyId, read));
    }

    @DeleteMapping("/{userId}/reads/{storyId}")
    public ResponseEntity<?> removeFromReads(
            @PathVariable UUID userId,
            @PathVariable UUID storyId) {
        userService.removeFromReads(userId, storyId);
        return ResponseEntity.ok("Removed from reading list");
    }

    @GetMapping("/{userId}/likes")
    public ResponseEntity<List<Story>> getUserLikedStories(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getUserLikedStories(userId));
    }
}
