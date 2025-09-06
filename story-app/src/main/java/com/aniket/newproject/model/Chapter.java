package com.aniket.newproject.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chapter {
    @Id @GeneratedValue
    private UUID id;

    private String title;
    private int number;

    @Lob
    private String content;

    private LocalDateTime createdAt;

    @ManyToOne
    @JsonIgnoreProperties("chapters") // Ignore 'chapters' inside Story to prevent recursion
    private Story story;
}
