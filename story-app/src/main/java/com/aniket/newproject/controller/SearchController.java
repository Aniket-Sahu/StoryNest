package com.aniket.newproject.controller;

import com.aniket.newproject.model.Story;
import com.aniket.newproject.model.User;
import com.aniket.newproject.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/stories/search")
    public ResponseEntity<List<Story>> searchStories(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(searchService.searchStories(search.trim()));
        }
        return ResponseEntity.ok(searchService.getAllStories());
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(searchService.searchUsers(search.trim()));
        }
        return ResponseEntity.ok(searchService.getAllUsers());
    }
}
