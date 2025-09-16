# 3장: 프로바이더와 의존성 주입 - 로직의 분리와 재사용

프로바이더(Provider)는 NestJS의 가장 기본적인 구성 요소 중 하나입니다. 서비스, 리포지토리, 팩토리 등 다양한 역할을 할 수 있으며, 컨트롤러의 부담을 덜어주고 비즈니스 로직을 캡슐화합니다. NestJS의 핵심 디자인 패턴인 의존성 주입(DI)이 프로바이더를 통해 어떻게 이루어지는지 배웁니다.

---

## 1. 핵심 개념

- **프로바이더 (Provider)**:
    - `@Injectable()` 데코레이터가 붙은 클래스를 의미합니다. `@Injectable()`은 NestJS의 DI 컨테이너가 이 클래스를 관리할 수 있는 대상으로 표시합니다.
    - **서비스(Service)**가 가장 일반적인 프로바이더의 예시입니다. 서비스는 컨트롤러가 직접 처리하기 복잡한 비즈니스 로직(데이터 처리, 계산, 데이터베이스와의 통신 등)을 담당합니다.
    - **역할과 책임의 분리(Separation of Concerns, SoC)**: 컨트롤러는 HTTP 요청을 받고 응답을 보내는 역할에만 집중하고, 복잡한 로직은 서비스에게 위임함으로써 코드를 더 깔끔하고 테스트하기 쉽게 만듭니다.

- **의존성 주입 (Dependency Injection, DI)**:
    - 클래스가 필요로 하는 의존성(다른 클래스의 인스턴스)을 외부에서 주입(생성하여 전달)해주는 디자인 패턴입니다.
    - 클래스 내부에서 `new MyService()` 와 같이 직접 의존성을 생성하는 대신, 생성자(constructor)를 통해 필요한 의존성을 선언합니다.
    - **장점**:
        - **결합도 감소(Decoupling)**: 클래스들이 서로에 대해 느슨하게 연결되어, 한 클래스의 변경이 다른 클래스에 미치는 영향을 최소화합니다.
        - **재사용성 증가**: 의존성이 외부에서 주입되므로, 다양한 환경에서 클래스를 재사용하기 쉬워집니다.
        - **테스트 용이성**: 실제 서비스 대신 테스트용 모의(mock) 객체를 쉽게 주입할 수 있어, 단위 테스트 작성이 매우 편리해집니다.

- **NestJS의 DI 과정**:
    1.  모듈(`@Module`)의 `providers` 배열에 프로바이더(예: `UsersService`)를 등록합니다.
    2.  NestJS의 IoC(Inversion of Control) 컨테이너가 `providers`에 등록된 클래스들의 인스턴스를 생성하고 관리합니다.
    3.  컨트롤러(예: `UsersController`)의 생성자에서 프로바이더를 타입으로 선언합니다. (`constructor(private readonly usersService: UsersService) {}`)
    4.  NestJS는 해당 타입을 보고, 미리 생성해 둔 `UsersService`의 인스턴스를 `UsersController`의 생성자에 자동으로 주입해줍니다.

---

## 2. 서비스 생성 및 주입

1.  **CLI로 서비스 생성**:
    ```bash
    nest generate service users
    # 단축 명령어: nest g s users
    ```
    - `src/users/users.service.ts` 파일이 생성되고, `@Injectable()` 데코레이터가 붙어 있습니다.
    - `users.module.ts` (없으면 생성됨)의 `providers` 배열에 `UsersService`가 자동으로 등록됩니다.

2.  **서비스에 로직 작성**:
    ```typescript
    // src/users/users.service.ts
    import { Injectable } from '@nestjs/common';

    @Injectable()
    export class UsersService {
      private readonly users = [
        { id: 1, name: '최동진', role: 'admin' },
        { id: 2, name: 'Gemini', role: 'user' },
      ];

      findAll(role?: string) {
        if (role) {
          return this.users.filter(user => user.role === role);
        }
        return this.users;
      }

      findOne(id: number) {
        return this.users.find(user => user.id === id);
      }

      create(user: any) {
        this.users.push(user);
        return user;
      }
    }
    ```

3.  **컨트롤러에 서비스 주입 및 사용**:
    ```typescript
    // src/users/users.controller.ts
    import { Controller, Get, Param, Query, Post, Body, ParseIntPipe } from '@nestjs/common';
    import { UsersService } from './users.service'; // 서비스 임포트

    @Controller('users')
    export class UsersController {
      // 1. 생성자에서 UsersService를 주입받음
      constructor(private readonly usersService: UsersService) {}

      @Get()
      findAll(@Query('role') role?: string) {
        // 2. 컨트롤러는 서비스의 메소드를 호출하기만 함
        return this.usersService.findAll(role);
      }

      @Get(':id')
      // ParseIntPipe: :id 파라미터를 자동으로 숫자로 변환해주는 파이프 (5장에서 자세히 다룸)
      findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
      }

      @Post()
      create(@Body() user: any) {
        return this.usersService.create(user);
      }
    }
    ```

---

## 3. 연습 문제

### 문제 1: `PostsService` 만들기
- **요구사항**: 2장에서 만들었던 `PostsController`의 로직을 분리할 `PostsService`를 만드세요.
- **세부사항**:
    1. `nest g s posts` 명령어로 `PostsService`를 생성합니다.
    2. `PostsService` 내부에 `private readonly posts = [...]` 와 같이 가상의 게시물 데이터를 저장할 배열을 만듭니다.
    3. `findAll()`과 `findOne(id)` 메소드를 `PostsService`에 구현합니다.
    4. `PostsController`의 생성자에서 `PostsService`를 주입받습니다.
    5. `PostsController`의 `findAll()`과 `findOne()` 메소드가 `PostsService`의 해당 메소드를 호출하도록 수정합니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
// src/posts/posts.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  private readonly posts = [
    { id: 1, title: 'NestJS는 재밌어!', content: '...' },
    { id: 2, title: '의존성 주입이란?', content: '...' },
  ];

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    return this.posts.find(post => post.id === id);
  }
}
```

```typescript
// src/posts/posts.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }
}
```
</details>

### 문제 2: 프로바이더 스코프(Scope)
- **개념**: 기본적으로 모든 프로바이더는 **싱글톤(Singleton)** 스코프를 가집니다. 즉, 애플리케이션 전체에서 단 하나의 인스턴스만 생성되어 공유됩니다. 하지만 요청마다 새로운 인스턴스를 생성하는 **요청 스코프(Request Scope)**로 변경할 수도 있습니다.
- **요구사항**: 각 요청마다 고유한 ID를 가지는 `RequestScopedService`를 만들어보세요.
- **세부사항**:
    1. `nest g s request-scoped`로 서비스를 생성합니다.
    2. `@Injectable()` 데코레이터를 `@Injectable({ scope: Scope.REQUEST })`로 수정합니다. (`Scope`는 `@nestjs/common`에서 임포트)
    3. 서비스의 생성자(`constructor`)에서 `this.requestId = Math.random()` 과 같이 랜덤한 ID를 할당하고 콘솔에 로그를 찍어보세요.
    4. 이 서비스를 특정 컨트롤러에 주입하고, 여러 번 요청을 보내보세요. 서버 콘솔에 요청마다 새로운 ID가 생성되는 로그가 찍히면 성공입니다.
- **언제 사용할까?**: 요청별로 캐싱을 하거나, 요청 정보를 담고 있어야 하는 등 각 요청이 독립적인 상태를 가져야 할 때 사용합니다. (단, 성능에 약간의 영향이 있을 수 있어 신중하게 사용해야 합니다.)

<details>
<summary>문제 2 정답 예시</summary>

```typescript
// src/request-scoped/request-scoped.service.ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  private readonly requestId: number;

  constructor() {
    this.requestId = Math.random();
    console.log(`RequestScopedService created with ID: ${this.requestId}`);
  }

  getRequestId(): number {
    return this.requestId;
  }
}
```

```typescript
// 이 서비스를 사용할 컨트롤러
import { Controller, Get } from '@nestjs/common';
import { RequestScopedService } from '../request-scoped/request-scoped.service';

@Controller('test-scope')
export class TestScopeController {
  constructor(private readonly requestScopedService: RequestScopedService) {}

  @Get()
  getRequestId(): string {
    return `This request is handled by a service instance with ID: ${this.requestScopedService.getRequestId()}`;
  }
}
```
</details>
