package com.lmstoeic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class LmsToeicApplication {

    public static void main(String[] args) {
        SpringApplication.run(LmsToeicApplication.class, args);
    }

}
