# 2장: 라우팅과 컨텍스트 - 요청을 이해하고 응답하기

Hono의 라우팅은 Express와 매우 유사하지만, 요청과 응답을 다루는 방식에서 **컨텍스트(Context)** 객체를 사용한다는 중요한 차이점이 있습니다. Hono의 라우팅과 핵심적인 컨텍스트 객체 사용법을 배웁니다.

---

## 1. 핵심 개념

- **라우팅**: Hono는 Express와 거의 동일한 방식으로 라우팅을 정의합니다.
  `app.METHOD(PATH, HANDLER)`
    - `METHOD`: `get`, `post`, `put`, `delete` 등 HTTP 메소드에 해당하는 함수
    - `PATH`: URL 경로. 라우트 파라미터(예: `/:id`)도 지원합니다.
    - `HANDLER`: 요청을 처리하는 핸들러 함수.

- **컨텍스트 (Context) 객체 `c`**:
    - Hono 핸들러의 **유일한 인자**입니다. Express의 `req`와 `res` 객체의 역할을 모두 수행합니다.
    - **요청 접근**: `c.req` 프로퍼티를 통해 요청에 대한 모든 정보에 접근할 수 있습니다.
        - `c.req.param('id')`: 라우트 파라미터 값 가져오기
        - `c.req.query('sort')`: 쿼리 스트링 값 가져오기
        - `c.req.header('User-Agent')`: 헤더 값 가져오기
        - `await c.req.json()`: JSON 요청 본문(body) 파싱하기
        - `await c.req.parseBody()`: 폼 데이터(form data) 파싱하기
    - **응답 생성**: 컨텍스트 객체의 메소드를 직접 호출하여 응답을 보냅니다. 이 메소드들은 `Response` 객체를 반환합니다.
        - `c.text(body, statusCode)`: 텍스트 응답
        - `c.json(body, statusCode)`: JSON 응답
        - `c.html(body, statusCode)`: HTML 응답
        - `c.redirect(location, statusCode)`: 리다이렉트
        - `c.status(statusCode)`: 응답 상태 코드만 설정 (본문 없음)

- **라우트 파라미터**: Express와 동일하게 콜론(`:`)을 사용하여 정의합니다. (예: `/users/:id`)

---

## 2. 예제 코드: 라우팅과 컨텍스트 활용

```typescript
// src/index.ts
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

// 1. 라우트 파라미터 사용하기
// 예: /users/123
app.get('/users/:id', (c) => {
  const id = c.req.param('id');
  return c.text(`사용자 ID: ${id}`);
});

// 2. 쿼리 스트링 사용하기
// 예: /search?q=hono&page=1
app.get('/search', (c) => {
  const query = c.req.query('q');
  const page = c.req.query('page');
  return c.json({ query, page });
});

// 3. POST 요청 본문(body) 처리하기
app.post('/posts', async (c) => {
  // c.req.json()은 Promise를 반환하므로 await 필요
  const body = await c.req.json();
  console.log(body);
  return c.json({ received: true, data: body }, 201);
});

// 4. 응답 헤더 설정하기
app.get('/custom-header', (c) => {
  c.header('X-Custom-Header', 'My custom value');
  return c.text('응답 헤더를 확인해보세요.');
});

serve({ fetch: app.fetch, port: 3000 });
```

**테스트**: API 테스트 도구를 사용하여 각 엔드포인트로 요청을 보내고 결과를 확인합니다.
- `GET http://localhost:3000/users/42`
- `GET http://localhost:3000/search?q=hono&page=2`
- `POST http://localhost:3000/posts` (Body에 `{ "title": "Hono 배우기" }` 와 같은 JSON 데이터 포함)

---

## 3. 연습 문제

### 문제 1: 책 정보 API 만들기
- **요구사항**: 특정 ISBN 코드로 책 정보를 조회하는 API 엔드포인트를 만드세요.
- **세부사항**:
    1. `GET /books/:isbn` 경로를 처리하는 라우트를 만듭니다.
    2. 핸들러 함수에서 `c.req.param('isbn')`을 사용하여 ISBN 값을 가져옵니다.
    3. `c.json()`을 사용하여 `{ isbn: [isbn 값], title: 'Hono 입문' }` 형식의 객체를 응답합니다.
- **확인**: 브라우저에서 `http://localhost:3000/books/978-1234567890` 와 같은 URL로 접속하여 결과 확인.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
app.get('/books/:isbn', (c) => {
  const isbn = c.req.param('isbn');
  return c.json({
    isbn: isbn,
    title: 'Hono 입문',
    author: 'Hono Team'
  });
});
```
</details>

### 문제 2: 폼 데이터(Form Data) 처리하기
- **요구사항**: `POST /login` 경로로 들어오는 `application/x-www-form-urlencoded` 형식의 폼 데이터를 처리하는 라우트를 만드세요.
- **세부사항**:
    1. `app.post('/login', ...)` 라우트를 만듭니다.
    2. 핸들러 함수 내에서 `await c.req.parseBody()`를 사용하여 폼 데이터를 객체로 파싱합니다.
    3. 파싱된 데이터에서 `username`과 `password`를 추출하여 `c.text()`로 환영 메시지를 응답합니다.
- **확인**: API 테스트 도구의 Body 탭에서 `x-www-form-urlencoded`를 선택하고, `username`과 `password` 필드를 채워 요청을 보낸 후 응답을 확인합니다.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
app.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const username = body['username'];
  const password = body['password'];

  // 실제로는 DB와 비교하는 로직이 필요
  if (typeof username === 'string' && typeof password === 'string') {
    return c.text(`환영합니다, ${username}님!`);
  } else {
    return c.text('잘못된 요청입니다.', 400);
  }
});
```
</details>
