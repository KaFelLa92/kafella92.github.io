# 1장: Hono 소개 - 작고, 간단하고, 초고속!

어떤 JavaScript 런타임에서도 동작하는 작고, 간단하며, 초고속 웹 프레임워크 Hono의 세계에 오신 것을 환영합니다. Hono가 왜 엣지 컴퓨팅(Edge Computing) 시대에 주목받고 있는지, 그리고 어떻게 첫 Hono 애플리케이션을 시작하는지 배웁니다.

---

## 1. 핵심 개념

- **Hono란?**: Go 언어의 `net/http`에서 영감을 받은 웹 프레임워크입니다. 이름은 일본어로 "불꽃(炎)"을 의미하며, 그 이름처럼 매우 빠르고 가벼운 성능을 자랑합니다.

- **주요 철학 및 특징**:
    - **초고속(Ultrafast)**: 라우터로 Regexp-based 라우터 대신 Trie-based 라우터를 사용하여 매우 빠른 라우팅 성능을 보여줍니다.
    - **초경량(Lightweight)**: 의존성이 거의 없어(zero-dependency) 번들 크기가 매우 작습니다. (약 14kB)
    - **멀티-런타임(Multi-runtime)**: 특정 런타임에 종속되지 않아 Node.js, Deno, Bun, 그리고 Cloudflare Workers, Vercel 등 다양한 엣지 환경에서 동일한 코드로 동작합니다.
    - **즐거운 개발 경험**: Express와 유사한 API를 제공하여 배우기 쉽고, TypeScript를 완벽하게 지원하여 타입 안정성을 보장합니다.

- **Express.js vs Hono**:
    - **유사점**: `app.get()`, `app.post()`, `app.use()` 등 API 디자인이 매우 유사하여 Express 경험이 있다면 쉽게 적응할 수 있습니다.
    - **차이점**:
        - **`req`, `res` 객체**: Hono는 `(req, res)` 대신 단일 **컨텍스트(Context) 객체 `c`** 를 사용합니다. `c.req`로 요청에, `c.json()`, `c.text()` 등으로 응답에 접근합니다.
        - **성능 및 경량성**: Hono는 Express보다 훨씬 빠르고 가볍습니다. 특히 서버리스나 엣지 환경에서 큰 장점을 가집니다.
        - **타입스크립트**: Hono는 처음부터 TypeScript를 기반으로 설계되어 강력한 타입 추론과 자동 완성을 제공합니다.

## 2. 개발 환경 설정

Hono는 다양한 런타임에서 사용할 수 있지만, 여기서는 가장 일반적인 **Node.js** 환경을 기준으로 설명합니다.

1.  **Node.js 설치**: 최신 LTS 버전을 설치합니다.
2.  **프로젝트 폴더 생성 및 초기화**:
    ```bash
    mkdir my-hono-app
    cd my-hono-app
    npm init -y
    ```
3.  **Hono 및 TypeScript 관련 패키지 설치**:
    ```bash
    # Hono 설치
    npm install hono

    # TypeScript 및 Node.js 타입, 실행 도구 설치
    npm install -D typescript @types/node ts-node nodemon
    ```
4.  **`tsconfig.json` 파일 생성**: TypeScript 컴파일러 설정을 위해 프로젝트 루트에 `tsconfig.json` 파일을 만듭니다.
    ```json
    {
      "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true
      }
    }
    ```
5.  **`package.json`에 실행 스크립트 추가**:
    ```json
    // package.json
    "scripts": {
      "dev": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts"
    },
    ```

## 3. 예제 코드: Hello Hono!

`src` 폴더를 만들고 그 안에 `index.ts` 파일을 생성하여 아래 코드를 작성합니다.

```typescript
// src/index.ts
import { Hono } from 'hono';
import { serve } from '@hono/node-server'; // Node.js 어댑터

const app = new Hono();

// 컨텍스트 객체 c를 인자로 받음
app.get('/', (c) => {
  // c.text()로 텍스트 응답
  return c.text('Hello Hono!');
});

const port = 3000;
console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);

// Node.js 환경에서 Hono 앱을 실행
serve({
  fetch: app.fetch,
  port: port,
});
```

**서버 실행:**

```bash
npm run dev
```

이제 브라우저에서 `http://localhost:3000`으로 접속하면 "Hello Hono!" 메시지가 표시됩니다.

---

## 4. 연습 문제

### 문제 1: JSON 응답하기
- **요구사항**: `/user` 경로로 GET 요청이 들어왔을 때, 사용자 정보를 담은 JSON 객체를 응답하는 라우트를 추가하세요.
- **세부사항**:
    1. `app.get('/user', ...)` 라우트를 추가합니다.
    2. 핸들러 함수에서 `c.text()` 대신 `c.json()` 메소드를 사용합니다.
    3. `c.json()`에 `{ id: 1, name: '최동진' }` 과 같은 객체를 전달합니다.
- **확인**: 브라우저에서 `http://localhost:3000/user`로 접속하여 JSON 데이터가 보이는지 확인합니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
// src/index.ts에 추가

app.get('/user', (c) => {
  const user = {
    id: 1,
    name: '최동진',
    email: 'hono@example.com'
  };
  return c.json(user);
});
```
</details>

### 문제 2: POST 요청 처리하기
- **요구사항**: `/posts` 경로로 POST 요청을 처리하는 라우트를 만드세요.
- **세부사항**:
    1. `app.post('/posts', ...)` 라우트를 추가합니다.
    2. 핸들러 함수에서 `c.text()`를 사용하여 "게시글이 생성되었습니다." 라는 메시지를 응답합니다.
    3. 응답 시 HTTP 상태 코드를 `201` (Created)로 설정해보세요. (힌트: `c.text(message, 201)`)
- **확인**: API 테스트 도구(Postman 등)를 사용하여 `http://localhost:3000/posts`로 POST 요청을 보내고, 응답 본문과 상태 코드를 확인합니다.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
// src/index.ts에 추가

app.post('/posts', (c) => {
  return c.text('게시글이 생성되었습니다.', 201);
});
```
</details>
