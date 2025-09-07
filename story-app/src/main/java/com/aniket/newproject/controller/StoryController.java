package com.aniket.newproject.controller;

import com.aniket.newproject.dto.DashboardData;
import com.aniket.newproject.model.*;
import com.aniket.newproject.service.*;
import com.aniket.newproject.dto.StoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/stories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class StoryController {

    private final StoryService storyService;
    private final UserService userService;
    private final GenreService genreService;

    @GetMapping
    public ResponseEntity<Page<Story>> getAllStories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "updatedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(storyService.getAllStoriesPaginated(pageable));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<Story>> getTrendingStories(
            @RequestParam(defaultValue = "6") int limit
    ) {
        return ResponseEntity.ok(storyService.getTrendingStories(limit));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Story>> getRecentStories(
            @RequestParam(defaultValue = "8") int limit
    ) {
        return ResponseEntity.ok(storyService.getRecentStories(limit));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardData> getDashboardData() {
        DashboardData data = new DashboardData();
        data.setTrending(storyService.getTrendingStories(6));
        data.setRecent(storyService.getRecentStories(8));
        return ResponseEntity.ok(data);
    }

    @PostMapping
    public ResponseEntity<Story> create(@RequestBody StoryRequest request) {
        User author = userService.findById(request.getAuthorId());
        Genre genre = genreService.findByName(request.getGenreName());

        if (author == null || genre == null) {
            return ResponseEntity.badRequest().build();
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
    public ResponseEntity<Page<Story>> getByGenre(
            @PathVariable String genreName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        return ResponseEntity.ok(storyService.getStoriesByGenrePaginated(genreName, pageable));
    }

    @GetMapping("/genre/{genreName}/trending")
    public ResponseEntity<List<Story>> getTrendingStoriesByGenre(
            @PathVariable String genreName,
            @RequestParam(defaultValue = "8") int limit,
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(storyService.getTrendingStoriesByGenre(genreName, limit, page));
    }

    @GetMapping("/genre/{genreName}/popular")
    public ResponseEntity<List<Story>> getPopularStoriesByGenre(
            @PathVariable String genreName,
            @RequestParam(defaultValue = "8") int limit,
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(storyService.getPopularStoriesByGenre(genreName, limit, page));
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
