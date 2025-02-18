package com.starbooks.backend.common.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
// ... 기타 imports

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private static final String FOLDER_PATH = "backend/";

    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = createFileName(file.getOriginalFilename());
        String filePath = FOLDER_PATH + fileName;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        try {
            // S3에 업로드
            amazonS3.putObject(new PutObjectRequest(
                    bucket,
                    filePath,
                    file.getInputStream(),
                    metadata
            ));

            // URL 생성
            return amazonS3.getUrl(bucket, filePath).toString();

        } catch (AmazonS3Exception e) {
            log.error("S3 업로드 실패: {}", e.getMessage());
            throw new IOException("S3 업로드 실패: " + e.getMessage());
        } catch (Exception e) {
            log.error("파일 처리 중 오류 발생: {}", e.getMessage());
            throw new IOException("파일 처리 실패: " + e.getMessage());
        }
    }

    private String createFileName(String originalFileName) {
        if (originalFileName == null) {
            throw new IllegalArgumentException("파일 이름이 null입니다.");
        }
        return UUID.randomUUID().toString() + "_" + originalFileName;
    }

    public void deleteFile(String fileUrl) {
        try {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            String filePath = FOLDER_PATH + fileName;
            amazonS3.deleteObject(bucket, filePath);
        } catch (Exception e) {
            log.error("파일 삭제 중 오류 발생: {}", e.getMessage());
        }
    }
}