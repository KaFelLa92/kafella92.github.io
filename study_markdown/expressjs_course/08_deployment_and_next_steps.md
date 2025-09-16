# 8장: 배포와 다음 단계 - 세상에 내 서버 알리기

로컬 환경에서 만든 Express 애플리케이션을 실제 사용자들이 접근할 수 있는 웹에 배포하는 방법을 알아봅니다. 또한, 더 나은 Express 개발을 위한 몇 가지 모범 사례와 다음 학습 주제를 살펴봅니다.

---

## 1. 배포(Deployment)

Express 앱을 배포하는 방법은 다양하지만, 여기서는 초보자에게 가장 접근성이 좋은 클라우드 플랫폼 기반의 배포 방법을 소개합니다.

- **PaaS (Platform as a Service)**: Heroku, Vercel, Render 와 같은 플랫폼은 소스 코드(주로 Git 리포지토리)만 업로드하면 인프라 설정, 서버 실행, 도메인 연결 등을 자동화해주는 서비스입니다. 초보자에게 가장 추천하는 방식입니다.

### Render.com을 이용한 배포 예시

1.  **코드 준비**:
    - **`start` 스크립트 추가**: `package.json`의 `scripts`에 서버를 시작하는 명령어를 추가합니다. 대부분의 PaaS는 이 `start` 스크립트를 보고 서버를 실행합니다.
      ```json
      // package.json
      "scripts": {
        "start": "node app.js",
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      ```
    - **포트(Port) 동적 할당**: 로컬에서는 `3000`번 포트를 사용했지만, 배포 환경에서는 플랫폼이 동적으로 포트를 할당해줍니다. `process.env.PORT` 환경 변수를 사용하도록 코드를 수정해야 합니다.
      ```javascript
      // app.js
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`));
      ```

2.  **Git 리포지토리 생성 및 Push**: 프로젝트를 GitHub, GitLab 등 원격 Git 리포지토리에 push합니다.

3.  **Render 가입 및 프로젝트 생성**:
    - [Render.com](https://render.com/)에 GitHub 계정으로 가입합니다.
    - 대시보드에서 [New +] -> [Web Service]를 선택합니다.
    - 배포할 Git 리포지토리를 연결합니다.

4.  **설정 및 배포**:
    - **Name**: 서비스 이름을 정합니다.
    - **Region**: 서버 위치를 선택합니다. (가까운 곳 선택)
    - **Branch**: 배포할 브랜치를 선택합니다. (예: `main`)
    - **Runtime**: `Node`를 선택합니다.
    - **Build Command**: `npm install` (보통 자동으로 설정됨)
    - **Start Command**: `npm start` (보통 자동으로 설정됨)
    - [Create Web Service] 버튼을 누르면 배포가 시작됩니다. 몇 분 후 `your-service-name.onrender.com` 형태의 URL이 발급됩니다.

---

## 2. 개발 생산성을 위한 모범 사례

- **`nodemon` 사용하기**: 개발 중에 코드를 수정할 때마다 수동으로 서버를 껐다 켜는 것은 매우 번거롭습니다. `nodemon`은 파일 변경을 감지하여 자동으로 서버를 재시작해주는 도구입니다.
    - **설치**: `npm install --save-dev nodemon` (`--save-dev`는 개발용 의존성으로 설치)
    - **`package.json`에 스크립트 추가**:
      ```json
      "scripts": {
        "start": "node app.js",
        "dev": "nodemon app.js"
      },
      ```
    - **실행**: `npm run dev` 명령어로 개발 서버를 시작합니다.

- **환경 변수 관리 (`dotenv`)**:
    - 데이터베이스 접속 정보, API 키 등 민감한 정보를 코드에 직접 작성하는 것은 위험합니다. `.env` 파일을 만들어 환경 변수를 관리하고, `dotenv` 라이브러리를 사용하여 애플리케이션에서 불러올 수 있습니다.
    - **설치**: `npm install dotenv`
    - **사용법**:
      1.  프로젝트 루트에 `.env` 파일을 만들고 `KEY=VALUE` 형식으로 변수를 저장합니다. (예: `DB_HOST=localhost`)
      2.  `.gitignore` 파일에 `.env`를 추가하여 Git에 올라가지 않도록 합니다.
      3.  애플리케이션 시작 부분(`app.js` 최상단)에 `require('dotenv').config();` 코드를 추가합니다.
      4.  코드 내에서 `process.env.KEY` 형태로 환경 변수를 사용합니다. (예: `process.env.DB_HOST`)

---

## 3. 다음 단계 (Next Steps)

Express의 기본을 익혔다면, 이제 더 깊이 있는 주제들을 학습하여 실제 프로덕션 수준의 애플리케이션을 만들 수 있습니다.

- **데이터베이스 연동**: `MySQL`, `PostgreSQL` 같은 관계형 데이터베이스(RDBMS)나 `MongoDB` 같은 NoSQL 데이터베이스와 Express를 연동하는 방법을 배웁니다. `Sequelize`나 `TypeORM` (ORM), `Mongoose` (ODM) 같은 라이브러리를 함께 사용하면 좋습니다.

- **인증(Authentication)**: 사용자가 누구인지 확인하는 과정입니다. 세션(Session) 기반 인증이나 토큰(JWT, JSON Web Token) 기반 인증을 구현하는 방법을 학습합니다.

- **보안**: `helmet` 미들웨어로 일반적인 웹 취약점으로부터 앱을 보호하고, `cors` 미들웨어로 Cross-Origin Resource Sharing 정책을 관리하는 방법을 배웁니다.

- **테스트**: `Jest`, `Mocha`, `Supertest` 같은 테스팅 프레임워크를 사용하여 API가 올바르게 동작하는지 검증하는 단위 테스트(Unit Test)와 통합 테스트(Integration Test)를 작성하는 방법을 익힙니다.

- **TypeScript와 함께 사용하기**: JavaScript에 정적 타입을 추가한 TypeScript를 Express와 함께 사용하면 코드의 안정성과 유지보수성을 크게 향상시킬 수 있습니다. 이는 특히 대규모 프로젝트에서 매우 중요합니다.
