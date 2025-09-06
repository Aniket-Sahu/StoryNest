package com.aniket.newproject.controller;

import com.aniket.newproject.model.Genre;
import com.aniket.newproject.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    @GetMapping
    public ResponseEntity<List<Genre>> getAllGenres() {
        return ResponseEntity.ok(genreService.getAllGenres());
    }

//    @GetMapping("/{genreName}/stories")
//    public ResponseEntity<?> getStoriesByGenre(@PathVariable String genreName) {
//        return ResponseEntity.ok(genreService.getStoriesByGenreName(genreName));
//    }
}

