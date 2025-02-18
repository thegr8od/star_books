//package com.starbooks.backend.diary.service;
//
//import jakarta.annotation.PostConstruct;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.StandardCopyOption;
//import java.util.UUID;
//
//@Service
//public class FileStorageService {
//
//    private final Path rootLocation;
//
//    // @Value 주석 처리 후 생성자 주입 방식으로 변경
//    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
//        this.rootLocation = Paths.get(uploadDir);
//        init();
//    }
//
//    @PostConstruct
//    public void init() {
//        try {
//            Files.createDirectories(rootLocation);
//        } catch (IOException e) {
//            throw new RuntimeException("업로드 디렉토리 생성 실패", e);
//        }
//    }
//
//    public String upload(MultipartFile file) {
//        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
//        try {
//            Files.copy(file.getInputStream(), rootLocation.resolve(filename));
//            return filename;
//        } catch (IOException e) {
//            throw new RuntimeException("파일 업로드 실패: " + filename, e);
//        }
//    }
//}