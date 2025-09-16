# 3장: 미들웨어 - 요청과 응답 사이의 검문소

미들웨어(Middleware)는 Express의 심장과도 같은 개념입니다. 요청이 라우트 핸들러에 도달하기 전, 또는 응답이 클라이언트에게 전송되기 전에 실행되는 함수들입니다. 미들웨어를 통해 요청을 검사하거나, 데이터를 추가하거나, 특정 로직을 수행할 수 있습니다.

---

## 1. 핵심 개념

- **미들웨어 함수**: `req`(요청), `res`(응답), 그리고 `next`(다음 미들웨어 함수) 세 개의 인자를 갖는 함수입니다.
  `function(req, res, next) { ... }`

- **`next()` 함수**: 현재 미들웨어 함수가 할 일을 마친 후, 그 다음 미들웨어 또는 라우트 핸들러에게 요청의 제어를 넘기는 역할을 합니다. **`next()`를 호출하지 않으면 요청-응답 사이클이 멈추게 되어 클라이언트는 응답을 받지 못하고 타임아웃이 발생합니다.** (단, `res.send()` 등으로 응답을 보내면 사이클이 종료되므로 `next()`를 호출할 필요가 없습니다.)

- **미들웨어의 역할**:
    - 모든 코드 실행
    - 요청(req) 및 응답(res) 객체 변경
    - 요청-응답 주기 종료
    - 스택 내의 다음 미들웨어 호출

- **미들웨어 등록**: `app.use(path, middlewareFunction)`
    - `path`가 지정되면 해당 경로와 그 하위 경로에만 미들웨어가 적용됩니다.
    - `path`가 생략되면 모든 요청에 대해 미들웨어가 적용됩니다. (애플리케이션 레벨 미들웨어)

## 2. 주요 미들웨어 종류

1.  **애플리케이션 레벨 미들웨어**: `app.use()`, `app.METHOD()`를 통해 `app` 객체에 바인딩됩니다.
2.  **라우터 레벨 미들웨어**: `express.Router()` 인스턴스에 바인딩됩니다. (4장에서 자세히 다룸)
3.  **오류 처리 미들웨어**: 항상 4개의 인자(`err`, `req`, `res`, `next`)를 가집니다. (5장에서 자세히 다룸)
4.  **기본 제공 미들웨어**: Express에 내장된 미들웨어입니다.
    - `express.json()`: `POST`, `PUT` 요청의 `body`에 포함된 JSON 데이터를 파싱하여 `req.body` 객체에 넣어줍니다.
    - `express.urlencoded({ extended: false })`: HTML 폼(form) 데이터(`application/x-www-form-urlencoded`)를 파싱하여 `req.body`에 넣어줍니다.
    - `express.static('public')`: `public` 폴더에 있는 정적 파일(이미지, CSS, JS 파일 등)을 제공합니다. (6장에서 자세히 다룸)
5.  **서드 파티 미들웨어**: `npm`으로 설치하여 사용하는 외부 미들웨어입니다. (예: `cors`, `helmet`, `morgan`)

---

## 3. 예제 코드

### 예제 1: 간단한 로거(Logger) 미들웨어 만들기

모든 요청에 대해 현재 시간과 요청 메소드, URL을 콘솔에 출력하는 미들웨어입니다.

```javascript
const express = require('express');
const app = express();

// 1. 직접 만드는 로거 미들웨어
const myLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // 다음 미들웨어나 라우트 핸들러로 제어를 넘김
};

// 2. 애플리케이션 레벨에서 미들웨어 등록
app.use(myLogger);

// 3. 기본 제공 미들웨어 등록 (POST 요청의 body를 파싱하기 위해)
app.use(express.json());

app.get('/', (req, res) => {
  res.send('홈 페이지');
});

app.post('/users', (req, res) => {
  // express.json() 미들웨어 덕분에 req.body를 사용할 수 있음
  const user = req.body;
  console.log('전달받은 사용자 데이터:', user);
  res.status(201).json({ message: '사용자 생성 성공', data: user });
});

app.listen(3000, () => console.log('서버 실행 중'));
```
**실행 결과**: 서버 실행 후 `http://localhost:3000/`에 접속하거나, API 테스트 도구로 `/users`에 POST 요청을 보내면 터미널에 로그가 찍히는 것을 볼 수 있습니다.

### 예제 2: 특정 라우트에만 미들웨어 적용하기

```javascript
const authMiddleware = (req, res, next) => {
  // 실제로는 여기서 헤더의 토큰 등을 검사하여 인증 로직을 수행
  console.log('인증 미들웨어 실행!');
  const authorized = true; // 인증 성공/실패 여부

  if (authorized) {
    next();
  } else {
    res.status(403).send('접근 권한이 없습니다.');
  }
};

// '/admin'으로 시작하는 모든 경로에 대해서만 authMiddleware를 적용
app.use('/admin', authMiddleware);

app.get('/admin', (req, res) => {
  res.send('관리자 페이지입니다.');
});

app.get('/admin/users', (req, res) => {
  res.send('관리자용 사용자 목록 페이지입니다.');
});

app.get('/', (req, res) => {
  res.send('일반 페이지입니다. (인증 미들웨어 실행 안 됨)');
});
```

---

## 4. 연습 문제

### 문제 1: `express.urlencoded` 미들웨어 사용해보기
- **요구사항**: HTML 폼(form)으로 제출된 데이터를 처리하는 라우트를 만드세요.
- **세부사항**:
    1. `express.urlencoded({ extended: false })` 미들웨어를 등록합니다.
    2. `POST /login` 라우트를 만듭니다.
    3. API 테스트 도구를 사용하여 `Body` 탭에서 `x-www-form-urlencoded` 타입을 선택하고, `username`과 `password` 키-값 쌍을 전송합니다.
    4. `/login` 라우트 핸들러에서 `req.body`로 받은 `username`과 `password`를 사용하여 "환영합니다, [username]님!" 과 같은 메시지를 응답합니다.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// ... express, app 선언 ...

// urlencoded 미들웨어 등록
app.use(express.urlencoded({ extended: false }));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // 실제로는 DB와 비교하는 로직이 필요
  if (username && password) {
    res.send(`환영합니다, ${username}님!`);
  } else {
    res.status(400).send('username과 password를 모두 입력하세요.');
  }
});

// ... app.listen ...
```
</details>

### 문제 2: 요청 시간 측정 미들웨어 만들기
- **요구사항**: 각 요청이 시작된 시간부터 응답이 완료될 때까지 걸린 시간을 측정하여 콘솔에 출력하는 미들웨어를 만들어보세요.
- **세부사항**:
    1. `requestTimeLogger` 라는 이름의 미들웨어 함수를 만듭니다.
    2. 함수가 시작될 때 `req.requestTime = Date.now()` 와 같이 요청 객체에 현재 시간을 기록합니다.
    3. `next()`를 호출하여 다음 로직으로 제어를 넘깁니다.
    4. (심화) `res.on('finish', ...)` 이벤트 리스너를 사용하여 응답이 완료되는 시점에 `Date.now() - req.requestTime`을 계산하여 콘솔에 출력합니다.
- **힌트**: 응답 완료 시점을 잡는 것이 까다로울 수 있습니다. 우선 요청이 들어온 시간만이라도 `req` 객체에 기록하고 `next()`를 호출하는 것부터 시작해보세요.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
const requestTimeLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.originalUrl} took ${duration}ms`);
  });
  
  next();
};

app.use(requestTimeLogger);

app.get('/', (req, res) => {
  // 일부러 지연 시간을 줌
  setTimeout(() => {
    res.send('홈 페이지');
  }, 500);
});
```
</details>
