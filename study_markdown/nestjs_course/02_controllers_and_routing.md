# 2장: 컨트롤러와 라우팅 - 요청을 받아들이는 관문

컨트롤러(Controller)는 클라이언트의 HTTP 요청을 받아 처리하는 첫 번째 관문입니다. NestJS에서 데코레이터(Decorator)를 사용하여 어떻게 라우팅을 정의하고, 요청 데이터를 추출하는지 배웁니다.

---

## 1. 핵심 개념

- **컨트롤러 (`@Controller`)**: 클래스에 `@Controller()` 데코레이터를 붙여 컨트롤러임을 선언합니다. `@Controller('users')`와 같이 인자를 주면, 해당 컨트롤러 내의 모든 라우트는 `/users` 라는 경로 접두사(prefix)를 갖게 됩니다.

- **라우트 핸들러 데코레이터**: 컨트롤러 클래스 내의 메소드에 붙여, 특정 HTTP 메소드와 경로에 대한 핸들러임을 나타냅니다.
    - `@Get()`: GET 요청
    - `@Post()`: POST 요청
    - `@Put()`: PUT 요청
    - `@Patch()`: PATCH 요청
    - `@Delete()`: DELETE 요청
    - `@All()`: 모든 HTTP 메소드

- **요청 데이터 추출 데코레이터**: 라우트 핸들러 메소드의 파라미터에 붙여, 요청(request) 객체의 특정 데이터에 쉽게 접근할 수 있게 해줍니다.
    - `@Req()`: 전체 요청 객체 (`express.Request`)
    - `@Res()`: 전체 응답 객체 (`express.Response`). (주의: `@Res` 사용 시 NestJS의 표준 응답 처리 흐름을 벗어나므로, 직접 `res.send()` 등을 호출해야 함. 특별한 경우가 아니면 사용을 지양합니다.)
    - `@Param('id')`: 라우트 파라미터(예: `/users/:id`)의 `id` 값을 추출합니다.
    - `@Query('sort')`: 쿼리 스트링(예: `/users?sort=asc`)의 `sort` 값을 추출합니다.
    - `@Body()`: 요청 본문(body) 전체를 객체로 추출합니다. (주로 POST, PUT, PATCH 요청에서 사용)
    - `@Headers('authorization')`: 특정 요청 헤더 값을 추출합니다.

## 2. 컨트롤러 생성 및 등록

1.  **CLI로 컨트롤러 생성**: NestJS CLI를 사용하면 보일러플레이트 코드를 쉽게 생성할 수 있습니다.
    ```bash
    nest generate controller users
    # 단축 명령어: nest g co users
    ```
    - 위 명령은 `src/users/users.controller.ts` 파일을 생성하고, `app.module.ts`에 자동으로 이 컨트롤러를 등록해줍니다.

2.  **모듈에 등록 확인**: `app.module.ts` 파일을 열어 `controllers` 배열에 `UsersController`가 추가되었는지 확인합니다.
    ```typescript
    // src/app.module.ts
    import { Module } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { UsersController } from './users/users.controller'; // CLI가 자동으로 추가

    @Module({
      imports: [],
      controllers: [AppController, UsersController], // 여기에 등록됨
      providers: [AppService],
    })
    export class AppModule {}
    ```

---

## 3. 예제 코드: Users 컨트롤러 만들기

```typescript
// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';

// 모든 라우트에 '/users' 접두사 적용
@Controller('users')
export class UsersController {

  // GET /users
  // GET /users?role=admin
  @Get()
  findAll(@Query('role') role?: string) { // 쿼리 파라미터는 선택적이므로 ?를 붙임
    if (role) {
      return `Find all users with role: ${role}`;
    }
    return 'Find all users';
  }

  // GET /users/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} user`;
  }

  // POST /users
  @Post()
  create(@Body() createUserDto: any) { // DTO는 다음 챕터에서 자세히 다룸
    console.log(createUserDto);
    return 'This action adds a new user';
  }

  // PUT /users/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  // DELETE /users/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} user`;
  }
}
```

**테스트**: API 테스트 도구(Postman 등)를 사용하여 각 엔드포인트로 요청을 보내고 응답을 확인합니다.
- `GET http://localhost:3000/users`
- `GET http://localhost:3000/users/123`
- `POST http://localhost:3000/users` (Body에 JSON 데이터 포함)

---

## 4. 연습 문제

### 문제 1: 블로그 게시물(Posts) 컨트롤러 만들기
- **요구사항**: `posts` 리소스에 대한 컨트롤러를 CLI를 사용하여 생성하고, 두 개의 라우트 핸들러를 추가하세요.
- **세부사항**:
    1. `nest g co posts` 명령어로 `PostsController`를 생성합니다.
    2. `app.module.ts`에 `PostsController`가 자동으로 등록되었는지 확인합니다.
    3. `GET /posts` 요청을 처리하는 `findAll()` 메소드를 만듭니다. "모든 게시물 목록" 문자열을 반환합니다.
    4. `GET /posts/:id` 요청을 처리하는 `findOne()` 메소드를 만듭니다. `id` 파라미터를 받아 "게시물 ID: [id]" 문자열을 반환합니다.
- **확인**: 브라우저나 API 테스트 도구로 `/posts`와 `/posts/1`에 접속하여 결과 확인.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
// src/posts/posts.controller.ts
import { Controller, Get, Param } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get()
  findAll() {
    return '모든 게시물 목록';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `게시물 ID: ${id}`;
  }
}
```
</details>

### 문제 2: 검색 라우트 만들기
- **요구사항**: `PostsController`에 게시물을 검색하는 라우트를 추가하세요.
- **세부사항**:
    1. `GET /posts/search` 경로를 처리하는 `search()` 메소드를 만듭니다.
    2. 쿼리 스트링으로 `keyword`를 받습니다. (예: `/posts/search?keyword=nestjs`)
    3. `@Query('keyword')` 데코레이터를 사용하여 `keyword` 값을 추출합니다.
    4. "'[keyword]'로 검색한 결과입니다." 라는 문자열을 반환합니다.
- **주의**: `GET /posts/:id` 라우트보다 `GET /posts/search` 라우트를 먼저(코드상 위쪽에) 정의해야 합니다. 그렇지 않으면 NestJS는 `search`를 `:id` 파라미터의 값으로 인식하게 됩니다.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
// src/posts/posts.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get()
  findAll() { /* ... */ }

  // :id 라우트보다 위에 위치해야 함
  @Get('search')
  search(@Query('keyword') keyword: string) {
    return `'${keyword}'로 검색한 결과입니다.`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) { /* ... */ }
}
```
</details>
