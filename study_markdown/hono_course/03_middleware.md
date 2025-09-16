# 3장: 미들웨어 - 요청 처리 흐름 제어하기

Hono의 미들웨어는 Express와 마찬가지로 요청이 최종 핸들러에 도달하기 전에 다양한 공통 작업을 처리하는 강력한 도구입니다. Hono에서 미들웨어를 작성하고 사용하는 방법을 배웁니다.

---

## 1. 핵심 개념

- **미들웨어(Middleware)**: 요청을 처리하는 핸들러 함수들의 체인(chain)입니다. 각 미들웨어는 요청을 검사하거나, 수정하거나, 다음 미들웨어 또는 최종 핸들러로 제어를 넘길 수 있습니다.

- **Hono 미들웨어의 형태**: Hono의 미들웨어는 두 개의 인자, **컨텍스트(`c`)**와 **`next` 함수**를 받는 비동기 함수입니다.
  `async (c, next) => { ... }`

- **`next()` 함수**: 다음 미들웨어 또는 라우트 핸들러를 호출하는 함수입니다. `await next()`를 호출해야 다음 단계로 제어가 넘어갑니다. `next()`를 호출하지 않으면 미들웨어에서 응답을 직접 보내야 합니다. 그렇지 않으면 클라이언트는 응답을 받지 못합니다.

- **미들웨어 등록**: `app.use(PATH, MIDDLEWARE)`
    - `PATH`: 미들웨어를 적용할 경로 패턴입니다. `*`를 사용하면 모든 경로에 적용됩니다.
    - `MIDDLEWARE`: 적용할 미들웨어 함수입니다.
    - `app.get`, `app.post` 등 특정 메소드에 대한 라우트에도 미들웨어를 여러 개 전달하여 적용할 수 있습니다. (예: `app.get('/', mw1, mw2, handler)`)

- **내장 미들웨어**: Hono는 자주 사용되는 기능들을 위한 공식 미들웨어를 제공합니다. (예: `logger`, `cors`, `prettyJson`, `jwt` 등)
    - `hono/logger`: 요청 정보를 콘솔에 로깅합니다.
    - `hono/cors`: CORS(Cross-Origin Resource Sharing) 헤더를 설정합니다.
    - `hono/pretty-json`: JSON 응답을 보기 좋게 포맷팅합니다.

## 2. 예제 코드

### 예제 1: 커스텀 로거 미들웨어 만들기

모든 요청에 대해 메소드와 경로를 콘솔에 출력하는 간단한 미들웨어입니다.

```typescript
// src/index.ts
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

// 1. 커스텀 미들웨어 정의
app.use('*', async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`);
  // 2. 다음 미들웨어 또는 핸들러 실행
  await next();
});

app.get('/', (c) => c.text('홈'));
app.get('/about', (c) => c.text('소개'));

serve({ fetch: app.fetch, port: 3000 });
```

### 예제 2: 내장 미들웨어 사용하기

`logger`와 `prettyJson` 미들웨어를 사용하여 개발 편의성을 높입니다.

```typescript
// src/index.ts
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { prettyJson } from 'hono/pretty-json';

const app = new Hono();

// 모든 경로에 logger와 prettyJson 미들웨어 적용
app.use('*', logger());
app.use('*', prettyJson());

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!', timestamp: new Date().toISOString() });
});

serve({ fetch: app.fetch, port: 3000 });
```
- **실행 결과**: 요청 시 터미널에 로그가 찍히고, 브라우저에서는 JSON 응답이 보기 좋게 들여쓰기 되어 나타납니다.

### 예제 3: 특정 경로에만 미들웨어 적용하기

`/admin`으로 시작하는 경로에만 인증 미들웨어를 적용하는 예제입니다.

```typescript
// ... Hono, serve 임포트 ...
const app = new Hono();

// 가상의 인증 미들웨어
const authMiddleware = async (c, next) => {
  const apiKey = c.req.header('X-API-KEY');
  if (apiKey === 'my-secret-key') {
    await next();
  } else {
    return c.text('Unauthorized', 401);
  }
};

// /admin/* 경로에만 authMiddleware 적용
app.use('/admin/*', authMiddleware);

app.get('/', (c) => c.text('누구나 접근 가능한 페이지'));
app.get('/admin/dashboard', (c) => c.text('관리자 대시보드'));
app.get('/admin/users', (c) => c.json([{ id: 1, name: 'admin' }]));

serve({ fetch: app.fetch, port: 3000 });
```
- **테스트**: `/admin/dashboard`에 그냥 접속하면 401 오류가 발생하고, `X-API-KEY` 헤더에 `my-secret-key`를 담아 요청하면 정상적으로 응답이 오는지 확인합니다.

---

## 3. 연습 문제

### 문제 1: 요청 시간 측정 미들웨어
- **요구사항**: 각 요청의 처리 시간을 측정하여 응답 헤더(`X-Response-Time`)에 추가하는 미들웨어를 만드세요.
- **세부사항**:
    1. `app.use('*', ...)`로 모든 경로에 적용되는 미들웨어를 만듭니다.
    2. 미들웨어 시작 부분에서 `const start = Date.now()`로 시작 시간을 기록합니다.
    3. `await next()`를 호출하여 다음 핸들러들이 실행되게 합니다.
    4. `next()` 실행이 끝난 후(응답이 생성된 후), `const ms = Date.now() - start`로 경과 시간을 계산합니다.
    5. `c.header('X-Response-Time', `${ms}ms`)`를 사용하여 응답 헤더를 추가합니다.
- **확인**: 브라우저 개발자 도구의 네트워크 탭에서 응답 헤더에 `X-Response-Time`이 포함되어 있는지 확인합니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header('X-Response-Time', `${ms}ms`);
});
```
</details>

### 문제 2: `hono/cors` 미들웨어 사용하기
- **요구사항**: 다른 도메인(origin)의 프론트엔드 애플리케이션이 우리 Hono API 서버에 요청을 보낼 수 있도록 CORS(Cross-Origin Resource Sharing)를 허용하세요.
- **세부사항**:
    1. `hono/cors` 미들웨어를 임포트합니다: `import { cors } from 'hono/cors';`
    2. `app.use('*', cors())`를 사용하여 모든 경로에 CORS 미들웨어를 적용합니다.
    3. (심화) 특정 도메인(예: `http://localhost:5173`)만 허용하고 싶다면, `cors({ origin: 'http://localhost:5173' })` 와 같이 옵션을 전달할 수 있습니다.
- **확인**: 별도의 프론트엔드 프로젝트에서 `fetch`를 사용하여 Hono API를 호출했을 때, 브라우저 콘솔에 CORS 오류가 발생하지 않으면 성공입니다.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

const app = new Hono();

// 모든 도메인의 요청을 허용
app.use('*', cors());

// 특정 도메인만 허용하는 경우
// app.use('*', cors({
//   origin: 'http://localhost:5173',
//   allowMethods: ['GET', 'POST'],
// }));

app.get('/api/data', (c) => {
  return c.json({ message: 'CORS is enabled!' });
});

serve({ fetch: app.fetch, port: 3000 });
```
</details>
