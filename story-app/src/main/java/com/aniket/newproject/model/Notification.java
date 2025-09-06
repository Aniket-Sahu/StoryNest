package com.aniket.newproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
public class Notification {
    @Id @GeneratedValue
    private UUID id;

    private UUID userId;
    private String type; // "follow", "like", "chapter", "comment"
    private String message;
    private boolean read = false;

    // Related entities (can be null)
    private UUID relatedUserId; // User who performed the action
    private UUID storyId;       // Related story
    private UUID chapterId;     // Related chapter

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
