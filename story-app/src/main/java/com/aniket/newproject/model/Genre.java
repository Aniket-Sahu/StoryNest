package com.aniket.newproject.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Genre {
    @Id @GeneratedValue
    private UUID id;
    private String name;

    @OneToMany(mappedBy = "genre")
    @JsonIgnoreProperties("genre")
    private List<Story> stories;
}

