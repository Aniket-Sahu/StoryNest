package com.aniket.newproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoryRequest {

    @NotNull
    private String title;

    private String description;

    @NotNull
    private String genreName;

    @NotNull
    private String status;

    @NotNull
    private UUID authorId;
}
