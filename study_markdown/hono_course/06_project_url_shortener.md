# 6장: 실전 프로젝트 - URL 단축기 만들기 (on Cloudflare Workers)

Hono의 가장 큰 장점 중 하나인 엣지(Edge) 환경 배포를 경험해봅니다. Cloudflare Workers 플랫폼에 간단한 URL 단축기(URL Shortener) API를 Hono로 만들어 배포하는 전 과정을 실습합니다.

---

## 1. 프로젝트 목표 및 환경

- **기능 요구사항**:
    - 긴 URL을 받아 짧은 단축 URL 코드를 생성 (POST /shorten)
    - 단축 URL 코드로 접속 시 원래의 긴 URL로 리다이렉트 (GET /:code)

- **기술 스택**:
    - 프레임워크: Hono
    - 배포 환경: Cloudflare Workers
    - 데이터베이스: Cloudflare KV (간단한 Key-Value 저장소)

- **Cloudflare Workers란?**: 전 세계에 분산된 Cloudflare의 엣지 네트워크에서 코드를 직접 실행하는 서버리스 플랫폼입니다. 사용자와 가장 가까운 위치에서 코드가 실행되므로 응답 속도가 매우 빠릅니다.

## 2. 개발 환경 설정

1.  **Cloudflare 계정 생성**: [Cloudflare 웹사이트](https://www.cloudflare.com/)에서 무료 계정을 생성합니다.

2.  **Wrangler CLI 설치**: Cloudflare Workers 프로젝트를 관리하기 위한 공식 CLI 도구입니다.
    ```bash
    npm install -g wrangler
    ```

3.  **Wrangler 로그인**:
    ```bash
    wrangler login
    ```
    - 브라우저가 열리며 Cloudflare 계정으로 로그인하고 권한을 부여하라는 메시지가 나타납니다.

4.  **Hono 프로젝트 생성 (Cloudflare Workers 템플릿 사용)**:
    ```bash
    npm create hono@latest my-url-shortener
    ```
    - 템플릿 선택 화면에서 `cloudflare-workers`를 선택합니다.

5.  **프로젝트 구조**:
    ```
    my-url-shortener/
    ├── src/index.ts      # Hono 애플리케이션 코드
    ├── package.json
    └── wrangler.toml     # Cloudflare Worker 설정 파일
    ```

## 3. 구현 단계

### 1단계: KV 네임스페이스 생성

Cloudflare KV는 엣지에서 사용할 수 있는 글로벌 Key-Value 데이터 저장소입니다. 단축 코드(Key)와 원본 URL(Value)을 저장하는 데 사용합니다.

1.  **`wrangler.toml` 파일 수정**: KV 네임스페이스를 바인딩(binding) 설정을 추가합니다.
    ```toml
    # wrangler.toml
    name = "my-url-shortener"
    main = "src/index.ts"
    compatibility_date = "2023-10-30"

    # 아래 내용 추가
    [[kv_namespaces]]
    binding = "URLS_KV" # 코드에서 이 이름으로 KV에 접근
    id = "" # wrangler dev 실행 시 자동으로 채워짐
    preview_id = "" # wrangler dev 실행 시 자동으로 채워짐
    ```

2.  **로컬 개발 서버 실행**:
    ```bash
    wrangler dev
    ```
    - 로컬에서 Cloudflare 환경을 시뮬레이션하여 실행합니다. KV도 메모리 내에서 에뮬레이션됩니다.

### 2단계: Hono 애플리케이션 코드 작성 (`src/index.ts`)

```typescript
// src/index.ts
import { Hono } from 'hono';

// 1. 바인딩 타입 정의 (wrangler.toml의 binding 이름과 일치)
type Bindings = {
  URLS_KV: KVNamespace;
};

// 2. Hono 앱 생성 시 제네릭으로 타입 전달
const app = new Hono<{ Bindings: Bindings }>();

// POST /shorten: URL 단축
app.post('/shorten', async (c) => {
  const { url } = await c.req.json<{ url: string }>();

  if (!url || !url.startsWith('http')) {
    return c.json({ error: '유효한 URL을 제공해야 합니다.' }, 400);
  }

  // 3. 컨텍스트(c.env)를 통해 KV 네임스페이스에 접근
  const kv = c.env.URLS_KV;

  // 간단한 랜덤 코드를 생성 (실제로는 더 정교한 방법 사용)
  const code = Math.random().toString(36).substring(2, 8);

  // 4. KV에 저장 (Key: code, Value: url)
  await kv.put(code, url);

  const shortUrl = `${new URL(c.req.url).origin}/${code}`;
  return c.json({ code, shortUrl });
});

// GET /:code : 원본 URL로 리다이렉트
app.get('/:code', async (c) => {
  const code = c.req.param('code');
  const kv = c.env.URLS_KV;

  // 5. KV에서 코드로 원본 URL 조회
  const originalUrl = await kv.get(code);

  if (!originalUrl) {
    return c.text('URL을 찾을 수 없습니다.', 404);
  }

  // 6. 원본 URL로 리다이렉트
  return c.redirect(originalUrl, 301);
});

export default app;
```

### 3단계: 배포

1.  **KV 네임스페이스 생성 (프로덕션용)**:
    ```bash
    wrangler kv:namespace create "URLS_KV"
    ```
    - 위 명령을 실행하면 `id`와 `preview_id`가 출력됩니다. 이 값을 `wrangler.toml` 파일의 해당 필드에 복사하여 붙여넣습니다.

2.  **배포 실행**:
    ```bash
    wrangler deploy
    ```
    - 몇 초 후 배포가 완료되고, `my-url-shortener.your-worker-name.workers.dev` 와 같은 공개 URL이 발급됩니다.

3.  **테스트**: Postman 등을 사용하여 배포된 URL로 API를 테스트합니다.
    - `POST https://.../shorten` (Body: `{ "url": "https://www.google.com" }`)
    - 응답으로 받은 단축 URL(예: `https://.../abcdef`)로 브라우저에서 접속하여 Google로 리다이렉트되는지 확인합니다.

---

## 4. 연습 문제 및 개선 과제

### 문제 1: 커스텀 단축 코드 기능
- **요구사항**: 사용자가 URL을 단축할 때 원하는 단축 코드(custom code)를 직접 지정할 수 있는 기능을 추가하세요.
- **세부사항**:
    1. `POST /shorten` 요청의 본문에 `customCode` 필드를 선택적으로 받을 수 있도록 합니다.
    2. `customCode`가 전달된 경우, 해당 코드가 이미 KV에 존재하는지 확인합니다.
    3. 존재한다면 "이미 사용 중인 코드입니다." 라는 오류(409 Conflict)를 응답합니다.
    4. 존재하지 않는다면, 랜덤 코드 대신 사용자가 지정한 코드를 사용하여 URL을 저장합니다.

<details>
<summary>문제 1 힌트</summary>

```typescript
// POST /shorten 핸들러 내부
const { url, customCode } = await c.req.json<{ url: string, customCode?: string }>();

let code = customCode;
if (code) {
  const existing = await c.env.URLS_KV.get(code);
  if (existing) {
    return c.json({ error: '이미 사용 중인 코드입니다.' }, 409);
  }
} else {
  code = Math.random().toString(36).substring(2, 8);
}

// ... 이후 로직은 동일
```
</details>

### 문제 2: 방문 횟수 추적 기능
- **요구사항**: 각 단축 URL이 몇 번이나 리다이렉트되었는지 방문 횟수를 추적하는 기능을 추가하세요.
- **세부사항**:
    1. KV에 URL을 저장할 때, `{ "url": originalUrl, "count": 0 }` 와 같이 객체 형태로 저장하도록 변경합니다. `JSON.stringify()`를 사용해야 합니다.
    2. `GET /:code` 핸들러에서 KV 값을 가져온 후, `JSON.parse()`로 객체를 복원합니다.
    3. `count`를 1 증가시킨 후, 다시 `JSON.stringify()`하여 KV에 업데이트합니다.
    4. (심화) 방문 횟수를 보여주는 `GET /:code/stats` 라는 새로운 엔드포인트를 만들어보세요.

<details>
<summary>문제 2 힌트</summary>

```typescript
// POST /shorten
const data = { url, count: 0 };
await kv.put(code, JSON.stringify(data));

// GET /:code
const value = await kv.get(code);
if (!value) { /* ... */ }

const data = JSON.parse(value);
data.count++;

// KV 업데이트 (백그라운드에서 실행)
c.executionCtx.waitUntil(kv.put(code, JSON.stringify(data)));

return c.redirect(data.url, 301);
```
</details>
