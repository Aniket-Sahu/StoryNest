package com.aniket.newproject.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Story {
    @Id
    @GeneratedValue
    private UUID id;

    private String title;
    private String description;
    private boolean isPublished;
    private String status;

    private int likeCount = 0;
    private float ratingAvg = 0;
    private int readCount = 0;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JsonIgnoreProperties({"works", "otherRecursiveFields"}) // prevent serialization cycle from User side
    private User author;

    @ManyToOne
    private Genre genre;

    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("story") // prevent recursion with Chapter -> Story
    private List<Chapter> chapters;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
