package com.aniket.newproject.service;

import com.aniket.newproject.model.Genre;
import com.aniket.newproject.model.Story;
import com.aniket.newproject.repo.GenreRepository;
import com.aniket.newproject.repo.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GenreService {

    private final GenreRepository genreRepository;
    private final StoryRepository storyRepository;

    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    public List<Story> getStoriesByGenreName(String genreName) {
        return null;
    }

    public Genre findByName(String name) {
        return genreRepository.findByName(name).orElse(null);
    }

    public class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

    public Genre findById(UUID genreId) {
        return genreRepository.findById(genreId)
                .orElseThrow(() -> new ResourceNotFoundException("Genre not found with id: " + genreId));
    }
}
