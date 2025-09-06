package com.aniket.newproject.controller;

import com.aniket.newproject.model.*;
import com.aniket.newproject.service.*;
import com.aniket.newproject.dto.StoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/stories")
@RequiredArgsConstructor
public class StoryController {

    private final NotificationService notificationService;
    private final StoryService storyService;
    private final UserService userService;
    private final GenreService genreService;
    private final ChapterService chapterService;

    @GetMapping
    public ResponseEntity<List<Story>> getAllStories() {
        return ResponseEntity.ok(storyService.getAllStories());
    }

    @PostMapping
    public ResponseEntity<Story> create(@RequestBody StoryRequest request) {
        User author = userService.findById(request.getAuthorId());
        Genre genre = genreService.findByName(request.getGenreName());
        if (author == null) {
            return ResponseEntity.badRequest().body(null); // or throw exception
        }
        if (genre == null) {
            return ResponseEntity.badRequest().body(null); // or throw exception
        }
        Story story = new Story();
        story.setTitle(request.getTitle());
        story.setDescription(request.getDescription());
        story.setStatus(request.getStatus());
        story.setAuthor(author);
        story.setGenre(genre);
        Story savedStory = storyService.createStory(story);
        return ResponseEntity.ok(savedStory);
    }

    @GetMapping("/genre/{genreName}")
    public ResponseEntity<List<Story>> getByGenre(@PathVariable String genreName) {
        return ResponseEntity.ok(storyService.getStoriesByGenre(genreName));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Story>> getByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(storyService.getStoriesByUser(userId));
    }

    @GetMapping("/{storyId}")
    public ResponseEntity<Story> getStory(@PathVariable UUID storyId) {
        return ResponseEntity.ok(storyService.getStoryById(storyId));
    }
}
