package com.aniket.newproject.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("home")
    public void home() {
        System.out.println("home reached");
    }
}
