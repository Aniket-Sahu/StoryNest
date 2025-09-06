package com.aniket.newproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "likes")
public class Like {
    @EmbeddedId
    private LikeId id;

    @ManyToOne @MapsId("userId")
    private User user;

    @ManyToOne @MapsId("storyId")
    private Story story;

    private LocalDateTime likedAt;
}

