package com.aniket.newproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id @GeneratedValue
    private UUID id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Chapter chapter;

    private String content;
    private LocalDateTime createdAt;
}

