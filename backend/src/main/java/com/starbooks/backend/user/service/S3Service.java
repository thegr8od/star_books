package com.starbooks.backend.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    // 실제 S3 업로드 로직을 구현해야 함.
    // 아래는 예시로, 단순히 "https://some-s3-url/ + originalFileName" 형식만 반환한다고 가정.

    public String upload(String originalFileName, MultipartFile file) {
        // 실제 AWS SDK 사용 시:
        // amazonS3.putObject(...);
        // return 업로드된 S3 URL;
        String s3Url = "https://s3.ap-northeast-2.amazonaws.com/your_bucket/" + originalFileName;
        return s3Url;
    }
}
