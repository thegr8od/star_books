package com.starbooks.backend;

import java.util.TimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableWebSecurity
@EnableScheduling
public class BackendApplication {
    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("KST"));
        SpringApplication.run(BackendApplication.class, args);
    }
}
