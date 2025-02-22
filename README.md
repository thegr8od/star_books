# 🌌 STAR BOOKS

STAR BOOKS는 사용자가 하루하루의 감정을 기록하고, AI와의 대화를 통해 감정을 나누는 플랫폼입니다.<br>
감정에 맞는 음악을 추천받고, 나만의 감정 달력을 통해 감정을 시각적으로 확인할 수 있습니다.

# 📑 목차
- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#️-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 및 실행 방법](#️-설치-및-실행-방법)
- [팀원 정보](#-팀원-정보)

# 📋 프로젝트 소개
STAR BOOKS는 현대인들의 감정 케어를 위한 올인원 플랫폼입니다. <br>
매일의 감정을 기록하고, AI와 대화하며, 음악을 통해 감정을 치유할 수 있습니다.<br>
또한 감정 달력을 통해 자신의 감정 변화를 한눈에 파악할 수 있어 자기 이해를 돕습니다.

# 🚀 주요 기능
1. **AI 감정 대화**
   - GPT 기반 AI와의 1:1 대화
   - 페르소나 별 대화스타일 선택 가능
   - 감정 분석 및 맞춤형 대화 제공
   - 대화 내역 저장 및 조회

2. **감정 달력**
   - 일별/월별 감정 기록
   - 시각적 감정 변화 그래프
   - 감정 통계 분석

3. **나만의 별자리**
   - 기록한 감정을 기반으로 색깔 매칭
   - 별자리 커스텀
   - 별자리 3D 시각화

4. **감정 우주**
   - 사용자들의 실시간 감정 공유
   - 감정 별자리 시각화

5. **AI 별자리 생성**
    - 사용자 업로드 이미지 기반 별자리 생성
    - 저장 후 3D로 돌아가는 별자리 감상

## 🛠️ 기술 스택

### 💻 프론트엔드
- React 18
- Tailwind CSS
- Recoil
- Threejs
- Vite
- blender

### ⚙️ 백엔드
- Spring Boot 3.0
- WebSocket
- JPA/Hibernate
- Spring Security
- JWT Authentication
- OAuth2.0
- 러셀 감정 모델 알고리즘

### 🗄️ 데이터베이스
- MySQL 8.0
- Redis

### ☁️ 인프라
- AWS (EC2, S3)
- Docker
- Jenkins
- Nginx
- Gitlab
- webhook

### 📂 프로젝트 구조

### 📦 프론트엔드
```
src/
├── assets/
├── components/
├── pages/
├── constants/
├── store/
├── api/
├── pages/
└── data/
```

### 🖥️ 백엔드
1. Spring Boot
   - 사용자 인증/인가
   - 구글 소셜 로그인
   - 감정 데이터 CRUD
   - 다이어리 API
   - 통계 분석 API
   - 별자리 선분 정보 저장
   - 나의 우주 API

2. AI
   - AI기반 페르소나 부여 성격별 채팅
   - AI기반 별자리 사진첩

### 🏗️ 아키텍처
![아키텍처 다이어그램](https://github.com/user-attachments/assets/b9563b0b-3ccd-4b0c-941a-21a6ffc24ea4)

### 📚 ERD
![ERD 다이어그램](https://github.com/user-attachments/assets/59e4fe35-3f2c-45c1-9590-93e9eb432f97)

### ⚙️ 설치 및 실행 방법
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
./gradlew bootRun
```

### 🛠 담당 파트

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/b905b75a-ea9d-4823-ae99-86b371a4277d" width="100" height="100" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>권동현</strong>
      <br />
      💻 FE | 🔧 BE | 🛠 Infra
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/48639e08-4756-4b9c-b351-482a7a01e51d" width="100" height="100" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>김승준</strong>
      <br />
      🔧 BE | 🛠 Infra
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/e4354ce8-a354-4dfd-be39-4227c580767f" width="100" height="100" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>전용현</strong>
      <br />
      🔧 BE | 🛠 Infra
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/42d0efbb-d1dd-4aef-a4d1-9a3fcaa5b4d8" width="100" height="100" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>정주은</strong>
      <br />
      💻 FE
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/3f901364-23cb-44fd-9bf7-324cd7fadab8" width="100" height="100" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>조혜정</strong>
      <br />
      💻 FE
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/a6d21efe-258f-45c8-8cfa-b0df04cbe7c0" width="100" height="100" style="object-fit: cover; border-radius: 10px;" />
      <br />
      <strong>김은영</strong>
      <br />
      💻 FE
    </td>
  </tr>
</table>

### 공통 파트
- Git 컨벤션 준수
- 코드 리뷰 진행
- 기술 문서 작성


# 역할
- 김승준
```
Spring Security, JWT, OAuth2을 활용한 보안 강화 및 유저 API 구현
OpenAI API 활용 챗봇 구현
별자리(나의 별자리, 나의 우주, AI 별자리) 구현
해시태그 활용 러셀 감정모델 기반 감정분석
Claud API 이미지 처리 모델 구현
우리의 우주 UI/UX 구축
```

- 권동현
```
인프라 설계
서버관리
Back - Front API 연동
```

- 전용현
```
다이어리, 캘린더 관련 API
해시태그 활용 러셀 감정모델 기반 감정분석
랜딩 페이지 UI제작참여
```

- 정주은
```
홈화면
마이페이지
감정 설문조사, 일기 작성 및 수정
ai 채팅
감정 통계
```

- 조혜정
```
달력 페이지
별자리 AI 만들기 페이지
나의 우주 페이지
로그인 기능
```

- 김은영
```
회원가입
네비게이션바 & 로그아웃
일기 월별 조회
나의 우주 (별 이동 & 연결)
```

# 📌 기타 정보
- [API 문서](https://apricot-bunny-1cb.notion.site/API-199faf2ac1508025ac32e3f9514e90e3)
