package com.aniket.newproject.dto;

import com.aniket.newproject.model.Story;
import lombok.Data;
import java.util.List;

@Data
public class DashboardData {
    private List<Story> trending;
    private List<Story> recent;
}
