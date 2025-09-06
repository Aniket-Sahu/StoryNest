package com.aniket.newproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Follow {
    @EmbeddedId
    private FollowId id;

    @ManyToOne @MapsId("followerId")
    private User follower;

    @ManyToOne @MapsId("followingId")
    private User following;

    private LocalDateTime followedAt;
}

