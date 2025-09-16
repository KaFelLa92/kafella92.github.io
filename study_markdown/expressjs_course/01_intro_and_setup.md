# 1장: Express.js 소개 및 첫 서버 만들기

Node.js 환경에서 웹 서버와 API를 만들기 위한 가장 대표적이고 미니멀한 프레임워크, Express.js의 세계에 오신 것을 환영합니다. Express의 기본 철학을 이해하고, 몇 줄의 코드로 간단한 웹 서버를 실행하는 방법을 배웁니다.

---

## 1. 핵심 개념

- **Node.js**: 브라우저 바깥(서버 등)에서 JavaScript를 실행할 수 있게 해주는 런타임 환경입니다. Node.js 자체만으로도 웹 서버를 만들 수 있지만, 코드가 복잡하고 길어집니다.

- **Express.js**: Node.js의 핵심 `http` 모듈을 기반으로, 웹 애플리케이션을 더 쉽고 빠르게 만들 수 있도록 다양한 기능을 추가한 **웹 프레임워크**입니다. 복잡한 HTTP 요청 처리를 단순화하고, 라우팅, 미들웨어 등 강력한 기능을 제공합니다.

- **미니멀리즘(Minimalism)**: Express의 핵심 철학입니다. 프레임워크 자체는 최소한의 기능만 제공하고, 개발자가 필요한 기능을 미들웨어(middleware) 형태로 자유롭게 추가하여 확장할 수 있는 구조를 가집니다.

## 2. 개발 환경 설정

1.  **Node.js 설치**: [Node.js 공식 웹사이트](https://nodejs.org/)에서 LTS 버전을 다운로드하여 설치합니다.
2.  **프로젝트 폴더 생성 및 초기화**:
    ```bash
    # 1. 프로젝트 폴더를 만들고 이동합니다.
    mkdir my-express-app
    cd my-express-app

    # 2. npm 프로젝트로 초기화합니다. (-y 플래그는 모든 질문에 yes로 답합니다)
    npm init -y
    ```
    이 명령은 프로젝트의 정보와 의존성을 관리하는 `package.json` 파일을 생성합니다.

3.  **Express 설치**:
    ```bash
    npm install express
    ```

## 3. 예제 코드: Hello World 서버

가장 간단한 형태의 Express 서버입니다. `app.js` 또는 `index.js` 라는 이름으로 파일을 생성하고 아래 코드를 작성하세요.

```javascript
// 1. express 모듈을 가져옵니다.
const express = require('express');

// 2. express 애플리케이션을 생성합니다.
const app = express();

// 3. 서버가 사용할 포트를 정의합니다.
const port = 3000;

// 4. 라우트(Route) 설정: HTTP GET 요청이 '/' 경로로 들어왔을 때의 처리
// req: 요청(request) 객체, res: 응답(response) 객체
app.get('/', (req, res) => {
  // res.send()로 클라이언트에게 응답을 보냅니다.
  res.send('Hello, Express World!');
});

// 5. 지정된 포트에서 서버를 실행하고 요청을 기다립니다.
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
```

**서버 실행:**

터미널에서 아래 명령어를 입력하여 서버를 실행합니다.

```bash
node app.js
```

이제 웹 브라우저를 열고 주소창에 `http://localhost:3000`을 입력하면 "Hello, Express World!" 메시지가 표시됩니다.

---

## 4. 연습 문제

### 문제 1: 자기소개 페이지 만들기
- **요구사항**: `/profile` 경로로 GET 요청을 보냈을 때, 본인의 이름과 간단한 소개를 응답하는 라우트를 추가해보세요.
- **세부사항**:
    1. 기존 `app.js` 파일에 새로운 `app.get()` 메소드를 추가합니다.
    2. 첫 번째 인자로 `'/profile'` 경로를 지정합니다.
    3. 콜백 함수에서 `res.send()`를 사용하여 이름과 소개가 포함된 문자열(예: `'<h1>최동진</h1><p>Express를 배우는 개발자입니다.</p>'`)을 응답합니다.
- **확인**: 서버를 재시작(`Ctrl+C`로 끈 후 `node app.js` 다시 실행)하고, 브라우저에서 `http://localhost:3000/profile`로 접속하여 결과 확인.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// app.js의 app.get('/', ...) 아래에 추가

app.get('/profile', (req, res) => {
  res.send('<h1>최동진</h1><p>Express를 배우는 개발자입니다.</p>');
});
```
</details>

### 문제 2: JSON 데이터 응답하기
- **요구사항**: `/api/user` 경로로 GET 요청을 보냈을 때, 사용자 정보를 담은 JSON 객체를 응답해보세요.
- **세부사항**:
    1. `/api/user` 경로를 처리하는 새로운 `app.get()`을 추가합니다.
    2. `res.send()` 대신 `res.json()` 메소드를 사용합니다.
    3. `res.json()`에 `{ name: 'Your Name', role: 'Developer' }` 와 같은 JavaScript 객체를 인자로 전달합니다. Express가 자동으로 JSON 문자열로 변환하여 응답해줍니다.
- **확인**: 서버 재시작 후 `http://localhost:3000/api/user`로 접속하여 JSON 데이터가 보이는지 확인.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
// app.js에 추가

app.get('/api/user', (req, res) => {
  const userData = {
    name: '최동진',
    email: 'kafella@example.com',
    role: 'Developer'
  };
  res.json(userData);
});
```
</details>
