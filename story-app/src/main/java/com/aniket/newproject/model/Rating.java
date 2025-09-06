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
public class Rating {
    @EmbeddedId
    private RatingId id;

    @ManyToOne @MapsId("userId")
    private User user;

    @ManyToOne @MapsId("storyId")
    private Story story;

    private int rating;
    private LocalDateTime ratedAt;
}

