# 5장: 고급 기능 - 유효성 검사와 RPC 모드

Hono는 기본적인 웹 프레임워크 기능을 넘어, 타입 안정성을 극대화하고 개발 경험을 향상시키는 고급 기능들을 제공합니다. 여기서는 외부 라이브러리를 이용한 유효성 검사와 Hono의 독특한 기능인 RPC 모드에 대해 배웁니다.

---

## 1. 유효성 검사 (Validation)

클라이언트로부터 받은 데이터(라우트 파라미터, 쿼리, JSON 본문 등)가 우리가 기대하는 형식과 일치하는지 검증하는 것은 매우 중요합니다. Hono는 `zod`와 같은 유효성 검사 라이브러리와 쉽게 통합할 수 있는 `@hono/zod-validator` 미들웨어를 제공합니다.

1.  **라이브러리 설치**:
    ```bash
    npm install zod @hono/zod-validator
    ```

2.  **스키마(Schema) 정의**: `zod`를 사용하여 데이터의 형태와 규칙을 정의하는 스키마를 만듭니다.
    ```typescript
    // src/validators.ts
    import { z } from 'zod';

    export const createUserSchema = z.object({
      name: z.string().min(2, { message: '이름은 2자 이상이어야 합니다.' }),
      email: z.string().email({ message: '유효한 이메일 형식이 아닙니다.' }),
      age: z.number().int().positive({ message: '나이는 양의 정수여야 합니다.' }),
    });
    ```

3.  **`zValidator` 미들웨어 적용**: 라우트 핸들러 앞에 `zValidator` 미들웨어를 추가하여 유효성을 검사합니다.
    ```typescript
    // src/index.ts
    import { Hono } from 'hono';
    import { zValidator } from '@hono/zod-validator';
    import { createUserSchema } from './validators';
    // ...

    const app = new Hono();

    app.post(
      '/users',
      // 'json' 타입의 본문을 createUserSchema로 검증
      zValidator('json', createUserSchema, (result, c) => {
        // 유효성 검사 실패 시 실행될 콜백
        if (!result.success) {
          return c.json({ errors: result.error.issues }, 400);
        }
      }),
      // 유효성 검사를 통과한 경우에만 이 핸들러가 실행됨
      async (c) => {
        // result.data는 타입이 완벽하게 추론된 안전한 데이터
        const user = c.req.valid('json');
        return c.json({
          message: '사용자 생성 성공!',
          user: {
            name: user.name,
            email: user.email,
          },
        });
      }
    );
    ```
    - `c.req.valid('json')`을 통해 유효성 검사를 통과한, 타입이 보장된 데이터에 접근할 수 있습니다.

---

## 2. RPC (Remote Procedure Call) 모드

Hono의 RPC 모드는 프론트엔드와 백엔드 간의 API 통신을 마치 함수를 직접 호출하는 것처럼 간단하고 타입-안전하게 만들어주는 독특한 기능입니다.

- **동작 원리**:
    1.  백엔드(Hono)에서 API 라우트 타입을 `export` 합니다.
    2.  프론트엔드에서 이 타입을 가져와 Hono 클라이언트(`hc`)를 생성합니다.
    3.  프론트엔드 코드에서 `client.api.posts.$get()` 와 같이 API를 호출하면, 실제로는 HTTP 요청이 전송되지만 개발자는 마치 백엔드 함수를 직접 호출하는 것처럼 느낍니다. 경로, 파라미터, 응답 데이터 등이 모두 타입스크립트에 의해 완벽하게 타입-체킹됩니다.

### 예제: Hono RPC 모드 사용하기

1.  **백엔드 (`src/index.ts`)**: 라우트를 정의하고 타입을 export 합니다.
    ```typescript
    import { Hono } from 'hono';
    import { serve } from '@hono/node-server';

    const app = new Hono();

    const route = app.get('/hello', (c) => {
      const name = c.req.query('name') || 'World';
      return c.json({ message: `Hello, ${name}!` });
    });

    serve({ fetch: app.fetch, port: 3000 });

    // 라우트의 타입을 export
    export type AppType = typeof route;
    ```

2.  **프론트엔드 (`src/client.ts`)**: 백엔드 타입을 사용하여 클라이언트를 만들고 API를 호출합니다.
    ```typescript
    import { hc } from 'hono/client';
    // 백엔드에서 export한 타입을 가져옴
    import type { AppType } from './index';

    // Hono 클라이언트 생성
    const client = hc<AppType>('http://localhost:3000');

    async function main() {
      // client.hello.$get()을 호출하면 GET /hello 요청이 전송됨
      // query 객체로 쿼리 스트링을 전달 (타입-안전)
      const res = await client.hello.$get({ query: { name: 'Hono' } });

      if (res.ok) {
        const data = await res.json();
        // data 객체의 타입이 완벽하게 추론됨
        console.log(data.message); // "Hello, Hono!"
      }
    }

    main();
    ```
    - **장점**: API 경로를 문자열로 쓰거나, 파라미터 타입을 추측할 필요가 없습니다. 백엔드 API가 변경되면 프론트엔드에서 즉시 타입 에러가 발생하여 버그를 사전에 방지할 수 있습니다.

---

## 3. 연습 문제

### 문제 1: 쿼리 파라미터 유효성 검사
- **요구사항**: `GET /posts` 라우트에서 `limit`과 `page` 쿼리 파라미터에 대한 유효성 검사를 추가하세요.
- **세부사항**:
    1. `zod`를 사용하여 `limit`과 `page`가 숫자로 변환 가능한 문자열이며, 특정 범위(예: 1 이상)에 있는지 검증하는 스키마를 만듭니다.
    2. `zValidator('query', ...)`를 사용하여 쿼리 파라미터를 검증합니다.
    3. 유효성 검사를 통과하면, `c.req.valid('query')`로 타입이 보장된 `limit`과 `page` 값을 가져와 응답에 포함시킵니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const postsQuerySchema = z.object({
  limit: z.string().transform(val => parseInt(val, 10)).default('10'),
  page: z.string().transform(val => parseInt(val, 10)).default('1'),
});

app.get(
  '/posts',
  zValidator('query', postsQuerySchema),
  (c) => {
    const { limit, page } = c.req.valid('query');
    return c.json({
      message: `Fetching posts...`,
      limit, // number 타입
      page,  // number 타입
    });
  }
);
```
</details>

### 문제 2: RPC 모드로 CRUD API 호출하기
- **요구사항**: 간단한 CRUD 기능을 가진 `/todos` API를 만들고, RPC 클라이언트를 사용하여 이를 호출하는 프론트엔드 코드를 작성하세요.
- **세부사항**:
    1. **백엔드**: `GET /todos`, `POST /todos` 두 개의 라우트를 만듭니다. `POST` 요청은 `{ task: string }` 형태의 본문을 받습니다. 이 라우트들을 `export type`으로 노출시킵니다.
    2. **프론트엔드**: Hono 클라이언트(`hc`)를 생성합니다.
    3. `client.todos.$post()`를 사용하여 새 todo를 생성하는 요청을 보냅니다. `json` 옵션으로 본문 데이터를 전달합니다.
    4. `client.todos.$get()`를 사용하여 todo 목록을 가져오는 요청을 보냅니다.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
// 백엔드: src/api.ts
import { Hono } from 'hono';

const todos = [{ id: 1, task: 'Learn Hono' }];

const app = new Hono()
  .get('/todos', (c) => c.json(todos))
  .post('/todos', async (c) => {
    const { task } = await c.req.json();
    const newTodo = { id: todos.length + 1, task };
    todos.push(newTodo);
    return c.json(newTodo, 201);
  });

export type AppType = typeof app;
```

```typescript
// 프론트엔드: src/rpc-client.ts
import { hc } from 'hono/client';
import type { AppType } from './api';

const client = hc<AppType>('http://localhost:3000');

async function run() {
  // POST
  const newTodoRes = await client.api.todos.$post({ json: { task: 'Write RPC code' } });
  const newTodo = await newTodoRes.json();
  console.log('Created:', newTodo);

  // GET
  const allTodosRes = await client.api.todos.$get();
  const allTodos = await allTodosRes.json();
  console.log('All todos:', allTodos);
}

run();
```
</details>
