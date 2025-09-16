# 4장: 요청과 응답 심화 - 데이터 흐름 다루기

컨텍스트 객체 `c`를 통해 요청(Request) 데이터를 더 깊이 있게 다루고, 다양한 형태의 응답(Response)을 생성하는 방법을 자세히 알아봅니다.

---

## 1. 요청(Request) 객체 `c.req`

`c.req`는 Hono의 `HonoRequest` 객체로, 표준 `Request` API와 호환되며 여러 유용한 헬퍼 메소드를 제공합니다.

- **`c.req.param(key)`**: 라우트 파라미터 값을 가져옵니다. (예: `/users/:id`)
- **`c.req.query(key)`**: URL 쿼리 스트링 값을 가져옵니다. (예: `?name=hono`)
- **`c.req.queries(key)`**: 동일한 키를 가진 여러 쿼리 스트링 값을 배열로 가져옵니다. (예: `?tags=js&tags=ts`)
- **`c.req.header(key)`**: 특정 헤더 값을 가져옵니다.
- **`c.req.method`**: HTTP 요청 메소드 (`GET`, `POST` 등)를 가져옵니다.
- **`c.req.url`**: 전체 요청 URL을 가져옵니다.
- **`c.req.path`**: 경로 부분만 가져옵니다.

- **Body 파싱 (비동기)**:
    - **`await c.req.json()`**: `Content-Type: application/json` 요청의 본문을 JavaScript 객체로 파싱합니다.
    - **`await c.req.text()`**: 본문을 순수 텍스트로 가져옵니다.
    - **`await c.req.arrayBuffer()`**: 본문을 `ArrayBuffer`로 가져옵니다.
    - **`await c.req.parseBody()`**: `Content-Type: application/x-www-form-urlencoded` 또는 `multipart/form-data` 형식의 본문을 파싱합니다.

## 2. 응답(Response) 생성

컨텍스트 객체 `c`의 메소드를 호출하여 응답을 생성합니다. 이 메소드들은 내부적으로 표준 `Response` 객체를 생성하고 반환합니다.

- **`c.text(body, status?, headers?)`**: 텍스트 응답. `Content-Type`은 `text/plain`.
- **`c.json(body, status?, headers?)`**: JSON 응답. `Content-Type`은 `application/json`.
- **`c.html(body, status?, headers?)`**: HTML 응답. `Content-Type`은 `text/html`.
- **`c.redirect(location, status?)`**: 다른 URL로 리다이렉트. 기본 상태 코드는 302.
- **`c.notFound()`**: 404 Not Found 응답을 보내는 단축 메소드.

- **헤더와 상태 코드 제어**:
    - **`c.header(key, value)`**: 응답 헤더를 설정합니다.
    - **`c.status(statusCode)`**: 응답 상태 코드를 설정합니다. 이 메소드만 호출하면 본문 없이 상태 코드만 응답합니다.
    - `c.json()` 등의 두 번째 인자로 상태 코드를 전달할 수도 있습니다.

---

## 3. 예제 코드

```typescript
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

// 모든 요청 정보 확인
app.get('/info', (c) => {
  return c.json({
    method: c.req.method,
    path: c.req.path,
    queries: c.req.query(), // 모든 쿼리 객체로 가져오기
    headers: c.req.header(), // 모든 헤더 객체로 가져오기
  });
});

// 여러 값을 가진 쿼리 스트링 처리
// 예: /posts?tags=js&tags=hono
app.get('/posts', (c) => {
  const tags = c.req.queries('tags'); // ['js', 'hono']
  return c.json({ tags });
});

// HTML 응답
app.get('/', (c) => {
  return c.html('<h1>환영합니다!</h1><p>여기는 Hono의 세계입니다.</p>');
});

// 리다이렉트
app.get('/old-page', (c) => {
  return c.redirect('/', 301); // 301: 영구 이동
});

// Not Found
app.get('/not-found', (c) => {
  return c.notFound();
});

// 상태 코드와 헤더 직접 설정
app.post('/create', (c) => {
  c.header('X-Powered-By', 'Hono');
  c.status(201); // Created
  return c.json({ message: '성공적으로 생성되었습니다.' });
});

serve({ fetch: app.fetch, port: 3000 });
```

---

## 4. 연습 문제

### 문제 1: 사용자 에이전트(User-Agent) 분석기
- **요구사항**: `GET /agent` 경로로 접속하면, 클라이언트의 `User-Agent` 헤더 정보를 분석하여 응답하는 라우트를 만드세요.
- **세부사항**:
    1. `app.get('/agent', ...)` 라우트를 만듭니다.
    2. 핸들러 함수에서 `c.req.header('User-Agent')`를 사용하여 헤더 값을 가져옵니다.
    3. 가져온 `User-Agent` 문자열에 `Firefox`, `Chrome`, `Safari` 등의 키워드가 포함되어 있는지 확인합니다.
    4. 분석 결과를 JSON 형태로 응답합니다. (예: `{ userAgent: '...', browser: 'Chrome' }`)

<details>
<summary>문제 1 정답 예시</summary>

```typescript
app.get('/agent', (c) => {
  const userAgent = c.req.header('User-Agent') || 'unknown';
  let browser = 'unknown';

  if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
  }

  return c.json({ userAgent, browser });
});
```
</details>

### 문제 2: 파일 다운로드 시뮬레이션
- **요구사항**: `GET /download` 경로로 접속하면, 가상의 파일을 다운로드하는 것처럼 응답하는 라우트를 만드세요.
- **세부사항**:
    1. `app.get('/download', ...)` 라우트를 만듭니다.
    2. `Content-Disposition` 헤더를 `attachment; filename="report.csv"` 와 같이 설정하여 브라우저가 응답을 파일로 다운로드하도록 유도합니다.
    3. `Content-Type` 헤더를 `text/csv`로 설정합니다.
    4. `c.text()`를 사용하여 CSV 형식의 간단한 문자열 데이터(예: `"id,name\n1,hono\n2,fast"`)를 응답 본문으로 보냅니다.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
app.get('/download', (c) => {
  // 1. Content-Disposition 헤더 설정
  c.header('Content-Disposition', 'attachment; filename="report.csv"');
  
  // 2. Content-Type 헤더 설정
  c.header('Content-Type', 'text/csv');

  // 3. CSV 데이터 응답
  const csvData = 'id,name,type\n1,hono,framework\n2,bun,runtime';
  return c.text(csvData);
});
```
</details>
