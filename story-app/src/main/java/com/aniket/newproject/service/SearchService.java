package com.aniket.newproject.service;

import com.aniket.newproject.model.Story;
import com.aniket.newproject.model.User;
import com.aniket.newproject.repo.UserRepository;
import com.aniket.newproject.repo.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    public List<Story> searchStories(String query) {
        return storyRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCaseOrBioContainingIgnoreCase(query, query);
    }

    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
