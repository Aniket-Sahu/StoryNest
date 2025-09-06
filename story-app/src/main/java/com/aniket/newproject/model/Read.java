package com.aniket.newproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.aniket.newproject.model.ReadId;
import com.aniket.newproject.model.User;
import com.aniket.newproject.model.Story;
import com.aniket.newproject.model.Chapter;
import com.aniket.newproject.model.ReadStatus;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Read {
    @EmbeddedId
    private ReadId id;

    @ManyToOne
    @MapsId("userId")
    private User user;

    @ManyToOne
    @MapsId("storyId")
    private Story story;

    @ManyToOne
    private Chapter lastChapterRead;

    @Enumerated(EnumType.STRING)
    private ReadStatus status;

    private Integer currentChapter; // Added field

    private Integer progress; // percentage from 0 to 100 -- Added field

    private LocalDateTime lastReadAt; // Added field

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
        lastReadAt = updatedAt; // initialize lastReadAt when created
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
