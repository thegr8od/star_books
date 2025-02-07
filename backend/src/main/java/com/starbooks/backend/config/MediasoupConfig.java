package com.starbooks.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MediasoupConfig {
    @Value("${mediasoup.host}")
    private String mediasoupHost;

    @Bean
    public MediasoupClient mediasoupClient() {
        return new MediasoupClient(mediasoupHost);
    }
}