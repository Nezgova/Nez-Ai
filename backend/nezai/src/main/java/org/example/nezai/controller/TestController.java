package org.example.nezai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "Hello from Nez AI Backend!";
    }

}