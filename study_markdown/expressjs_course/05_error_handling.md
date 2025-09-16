# 5장: 오류 처리 - 예상치 못한 상황에 대비하기

잘 만들어진 애플리케이션이라도 서버 오류, 잘못된 요청 등 예상치 못한 오류는 언제나 발생할 수 있습니다. Express의 오류 처리 미들웨어를 사용하여 이러한 오류들을 중앙에서 효과적으로 관리하고, 사용자에게 적절한 피드백을 주는 방법을 배웁니다.

---

## 1. 핵심 개념

- **오류 처리 미들웨어 (Error-handling Middleware)**:
    - 다른 미들웨어와 달리 항상 **4개의 인자**(`err`, `req`, `res`, `next`)를 가집니다. 이 4개의 인자가 Express에게 일반 미들웨어가 아닌 오류 처리 미들웨어임을 알려주는 신호입니다.
    - 이 미들웨어는 다른 모든 `app.use()` 및 라우트 호출 **다음에**, 즉 스택의 가장 마지막에 정의해야 합니다.

- **오류 발생 및 전파**:
    - 동기적인 코드(synchronous)에서는 `throw new Error('...')`를 사용하여 오류를 발생시킬 수 있습니다. Express가 이를 감지하여 오류 처리 미들웨어로 전달합니다.
    - 비동기적인 코드(asynchronous, 예: 콜백 함수, `.then()`)에서는 `throw`로 발생시킨 오류를 Express가 잡지 못합니다. 이 경우, 반드시 `next(err)`와 같이 `next()` 함수에 오류 객체를 전달하여 수동으로 오류 처리 미들웨어에게 넘겨야 합니다.
    - (참고) Express 5부터는 비동기 코드에서 발생한 오류도 자동으로 감지하여 `next(err)`를 호출한 것처럼 처리해줍니다.

- **기본 오류 핸들러**: 만약 직접 오류 처리 미들웨어를 만들지 않으면, Express는 내장된 기본 오류 핸들러를 사용합니다. 이 핸들러는 스택 트레이스(stack trace)를 클라이언트에게 그대로 노출하므로, 프로덕션 환경에서는 반드시 커스텀 오류 핸들러를 만들어야 합니다.

---

## 2. 예제 코드

### 예제 1: 중앙 오류 처리 미들웨어 구현

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('홈 페이지');
});

// 동기적 오류 발생 라우트
app.get('/error-sync', (req, res) => {
  // 이 오류는 Express가 감지하여 오류 처리 미들웨어로 보냄
  throw new Error('동기적인 코드에서 오류 발생!');
});

// 비동기적 오류 발생 라우트
app.get('/error-async', (req, res, next) => {
  setTimeout(() => {
    try {
      // 비동기 코드 블록 안에서는 try-catch로 오류를 잡아야 함
      throw new Error('비동기적인 코드에서 오류 발생!');
    } catch (error) {
      // next(error)를 통해 명시적으로 오류 처리 미들웨어로 전달
      next(error);
    }
  }, 100);
});

// 404 Not Found 핸들러 (모든 라우트의 맨 끝에 위치)
// 위에서 일치하는 라우트가 없을 때 실행됨
app.use((req, res, next) => {
  res.status(404).send('요청하신 페이지를 찾을 수 없습니다.');
});

// 오류 처리 미들웨어 (항상 4개의 인자를 가짐)
// 모든 미들웨어와 라우트의 가장 마지막에 위치해야 함
app.use((err, req, res, next) => {
  console.error(err.stack); // 오류 스택을 서버 콘솔에 기록

  // 클라이언트에게는 간단한 오류 메시지만 전송
  res.status(500).send('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
});

app.listen(3000, () => console.log('서버 실행 중'));
```

### 예제 2: 커스텀 오류 클래스 사용하기

오류의 종류(예: 입력값 오류, 권한 없음 등)에 따라 다른 상태 코드를 응답하면 더 좋습니다.

```javascript
// 커스텀 오류 클래스
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400; // Bad Request
  }
}

// ... app, express 선언 ...

app.get('/users/:id', (req, res, next) => {
  const { id } = req.params;
  if (isNaN(parseInt(id))) {
    // 유효하지 않은 ID일 경우, 커스텀 오류를 next로 전달
    return next(new ValidationError('유효하지 않은 사용자 ID입니다.'));
  }
  res.send(`${id}번 사용자 정보`);
});

// ... 404 핸들러 ...

// 향상된 오류 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);

  // 커스텀 오류의 statusCode를 사용하고, 없으면 500을 기본값으로 사용
  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 오류';

  res.status(statusCode).json({ error: message });
});

// ... app.listen ...
```

---

## 3. 연습 문제

### 문제 1: 404 오류 처리기 만들기
- **요구사항**: 정의되지 않은 URL로 요청이 들어왔을 때, "404 - 페이지를 찾을 수 없습니다." 라는 메시지와 함께 404 상태 코드를 응답하는 미들웨어를 만드세요.
- **세부사항**:
    1. 인자가 3개(`req`, `res`, `next`)인 일반 미들웨어를 만듭니다.
    2. 이 미들웨어는 다른 모든 `app.get`, `app.post` 등 라우트 핸들러들의 **아래**, 그리고 최종 오류 처리 미들웨어의 **위에** 위치해야 합니다.
    3. 미들웨어 내부에서 `res.status(404).send(...)`를 호출하여 응답합니다.
- **이유**: 이 미들웨어까지 요청이 도달했다는 것은, 그 위에 정의된 어떤 라우트와도 일치하지 않았다는 의미이므로 404로 처리할 수 있습니다.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// ... 모든 라우트 정의 ...
app.get('/', (req, res) => res.send('홈'));
app.get('/about', (req, res) => res.send('소개'));

// 404 핸들러
app.use((req, res, next) => {
  res.status(404).send('죄송합니다, 요청하신 페이지는 존재하지 않습니다.');
});

// 오류 처리 미들웨어 (4개 인자)
app.use((err, req, res, next) => {
  // ...
});
```
</details>

### 문제 2: 특정 API 키(API Key) 검증 미들웨어
- **요구사항**: `/api`로 시작하는 모든 요청에 대해, 요청 헤더에 유효한 API 키가 포함되어 있는지 검사하는 미들웨어를 만드세요. 키가 없거나 틀리면 오류를 발생시키세요.
- **세부사항**:
    1. `const API_KEY = 'my-secret-key';` 와 같이 서버에만 알려진 키를 정의합니다.
    2. `/api` 경로에만 적용되는 미들웨어를 `app.use('/api', ...)`로 등록합니다.
    3. 미들웨어 내부에서 `req.headers['x-api-key']` 값을 확인합니다.
    4. 이 값이 `API_KEY`와 일치하지 않으면, `next(new Error('유효하지 않은 API 키입니다.'))` 와 같이 오류를 발생시켜 오류 처리 미들웨어로 넘깁니다.
    5. 일치하면 `next()`를 호출하여 다음 라우트로 진행시킵니다.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
const API_KEY = 'my-secret-key';

const apiKeyValidator = (req, res, next) => {
  const userApiKey = req.headers['x-api-key'];

  if (userApiKey && userApiKey === API_KEY) {
    next(); // 키가 유효하면 통과
  } else {
    const error = new Error('인증 실패: 유효하지 않은 API 키입니다.');
    error.statusCode = 401; // Unauthorized
    next(error); // 키가 없거나 틀리면 오류 발생
  }
};

// /api로 시작하는 경로에 미들웨어 적용
app.use('/api', apiKeyValidator);

// 테스트용 API 라우트
app.get('/api/data', (req, res) => {
  res.json({ data: '이것은 비밀 데이터입니다.' });
});

// ... 오류 처리 미들웨어 ...
```
</details>
