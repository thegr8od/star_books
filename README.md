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

2. **감정 라디오**
   - 이모지로 방송 리액션 가능
   - 실시간 음악 스트리밍

3. **감정 달력**
   - 일별/월별 감정 기록
   - 시각적 감정 변화 그래프
   - 감정 통계 분석

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


# 회고
- 김승준
```
Spring Security, JWT, OAuth2을 활용한 보안 강화 및 유저 API 구현
Open API 활용 챗봇 구현
별자리(나의 별자리, 나의 우주, AI 별자리) 구현
해시태그 활용 러셀 감정모델 기반 감정분석
Claud API 이미지 처리 모델 구현
우리의 우주 UI/UX 구축
```
>개발 일정에 여러 차질이 생겨 다사다난했지만, 그때마다 끝까지 최선을 다해 준 팀원들께 진심으로 감사드립니다.
마지막 주에 카페에서 함께 밤을 새며 개발했던 순간이 특히 기억에 남네요.
개인적으로도 큰 성장을 이룰 수 있었던 의미 있는 프로젝트였습니다!
- 권동현
```
인프라 설계
서버관리
Back - Front API 연동
```
>프로젝트에서 인프라 설계를 처음으로 맡아 진행했는데, 예상보다 많이 어렵웠습니다. 프로젝트 초기, 단순하게 접근했으나 실제로 구현하면서 마주한 기술적 이슈와 복잡도가 컸고, 그로 인해 다른 팀원들에게 충분히 기여하지 못한 점이 아쉽습니다. 그럼에도 불구하고 이 과정을 통해 인프라 전반에 대한 이해도를 크게 높일 수 있었고, 앞으로 유사한 프로젝트를 진행할 때는 한층 더 성장한 모습으로 팀에 기여하고자 합니다.
- 전용현
```
다이어리, 캘린더 관련 API
해시태그 활용 러셀 감정모델 기반 감정분석
랜딩 페이지 UI제작참여
------------------------------------------------
웹소켓 기반 이모지 리액션 O, 실시간 라디오 스트리밍X
```
>프로젝트 초기에 아이디어가 잘 떠오르지 않아 힘들었습니다. 하지만 팀원들이 열심히 하는 모습을 보고 힘이 났던것 같습니다. 실시간 통신을 위한 오픈소스인 openvidu를 활용해 실시간 스트리밍 기능을 구현을 완료 하는것이 목표였지만 처음시도해보는 기술이다보니 어려운 부분이 많았습니다. 꼭 어느 부분이 문제가 있었는지 파악을해 구현을 완료하고 다음엔 더 성장한 모습으로 프로젝트에 임하고 싶습니다.

- 정주은:
- 조혜정:
- 김은영:

# 📌 기타 정보
- [API 문서](https://apricot-bunny-1cb.notion.site/API-199faf2ac1508025ac32e3f9514e90e3)
