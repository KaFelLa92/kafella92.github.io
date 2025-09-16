# 5장: 미들웨어, 파이프, 가드 - 요청 처리의 수문장들

NestJS는 Express의 미들웨어 개념을 포함하면서, 파이프(Pipe), 가드(Guard)라는 추가적인 요청 처리 메커니즘을 제공합니다. 이들은 각각의 명확한 역할을 가지고 컨트롤러에 도달하기 전 요청을 처리하는 수문장 역할을 합니다.

---

## 1. 핵심 개념

- **미들웨어 (Middleware)**:
    - Express의 미들웨어와 거의 동일합니다. 라우트 핸들러가 실행되기 **전에** 호출되는 함수입니다.
    - 주로 요청/응답 객체를 조작하거나, 로깅, 서드파티 라이브러리(예: `helmet`, `cors`) 연동 등 라우트 핸들러와 직접적인 관련이 적은 횡단 관심사(cross-cutting concerns)를 처리하는 데 사용됩니다.
    - `@Injectable()` 클래스로 구현하거나 간단한 함수로 구현할 수 있습니다.

- **파이프 (Pipes)**:
    - 라우트 핸들러에 전달되는 인자(argument)를 처리하기 위해 설계되었습니다.
    - 두 가지 주요 역할을 합니다:
        1.  **변환 (Transformation)**: 입력 데이터를 원하는 형태로 변환합니다. (예: 문자열 `"123"`을 숫자 `123`으로)
        2.  **유효성 검사 (Validation)**: 입력 데이터가 유효한지 검사하고, 유효하지 않으면 예외(exception)를 발생시켜 요청을 차단합니다.
    - `@UsePipes()` 데코레이터를 사용하거나 `main.ts`에서 전역으로 적용할 수 있습니다.
    - **내장 파이프**: `ValidationPipe`, `ParseIntPipe`, `ParseUUIDPipe` 등

- **가드 (Guards)**:
    - 특정 라우트를 실행할 **권한(permission)**이 있는지 결정합니다.
    - 주로 인증(Authentication) 및 인가(Authorization) 로직을 처리하는 데 사용됩니다. (예: 이 사용자가 로그인했는가? 관리자 권한이 있는가?)
    - `CanActivate` 인터페이스를 구현하며, `true`를 반환하면 요청이 허용되고 `false`를 반환하면 거부됩니다.
    - `@UseGuards()` 데코레이터를 사용하여 적용합니다.

### 요청 처리 순서
`Middleware` -> `Guards` -> `Interceptors (before)` -> `Pipes` -> `Controller Route Handler` -> `Interceptors (after)` -> `Exception Filters`

---

## 2. 예제 코드

### 예제 1: 간단한 로거 미들웨어

```typescript
// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[Middleware] Request... ${req.method} ${req.originalUrl}`);
    next();
  }
}

// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({ /* ... */ })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 모든 라우트에 대해 LoggerMiddleware를 적용
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

### 예제 2: `ValidationPipe`와 DTO 사용하기

`class-validator`와 `class-transformer` 라이브러리를 사용하여 요청 본문(body)의 유효성을 검사합니다.

1.  **필요한 라이브러리 설치**:
    ```bash
    npm install class-validator class-transformer
    ```

2.  **DTO (Data Transfer Object) 생성**: 요청 데이터를 정의하고 유효성 검사 규칙을 추가하는 클래스입니다.
    ```typescript
    // src/users/dto/create-user.dto.ts
    import { IsString, IsEmail, IsInt, Min, Max } from 'class-validator';

    export class CreateUserDto {
      @IsString()
      name: string;

      @IsEmail()
      email: string;

      @IsInt()
      @Min(0)
      @Max(120)
      age: number;
    }
    ```

3.  **컨트롤러에서 `ValidationPipe` 사용**:
    ```typescript
    // src/users/users.controller.ts
    import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
    import { CreateUserDto } from './dto/create-user.dto';

    @Controller('users')
    export class UsersController {
      // ...
      @Post()
      // ValidationPipe를 사용하면 NestJS가 자동으로 DTO에 정의된 규칙에 따라 유효성 검사를 수행
      @UsePipes(new ValidationPipe())
      create(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return `User ${createUserDto.name} created.`;
      }
    }
    ```
    - 또는 `main.ts`에서 전역으로 파이프를 설정하면 `@UsePipes`를 생략할 수 있습니다:
      `app.useGlobalPipes(new ValidationPipe());`

### 예제 3: 간단한 인증 가드

요청 헤더에 특정 `Authorization` 키가 있는지 확인하는 가드입니다.

```typescript
// src/common/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // 실제로는 더 복잡한 인증 로직 (예: JWT 토큰 검증)이 들어감
    return request.headers.authorization === 'my-secret-token';
  }
}

// 컨트롤러에서 사용
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('admin')
@UseGuards(AuthGuard) // 이 컨트롤러의 모든 라우트에 가드 적용
export class AdminController {
  @Get()
  getAdminData() {
    return 'This is secret admin data.';
  }
}
```

---

## 3. 연습 문제

### 문제 1: `ParseIntPipe` 사용하기
- **요구사항**: `PostsController`의 `findOne(id)` 메소드에서, `id` 파라미터가 숫자가 아닐 경우 자동으로 400 (Bad Request) 오류를 응답하도록 만드세요.
- **세부사항**:
    1. `findOne(@Param('id') id: string)` 부분을 수정합니다.
    2. `@Param()` 데코레이터의 두 번째 인자로 `ParseIntPipe`를 전달합니다: `@Param('id', ParseIntPipe)`
    3. 핸들러 메소드의 `id` 파라미터 타입을 `string`에서 `number`로 변경합니다.
- **확인**: `/posts/123`으로 접속하면 정상 동작하고, `/posts/abc`로 접속하면 400 오류가 발생하는지 확인합니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
// src/posts/posts.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
// ...

@Controller('posts')
export class PostsController {
  // ...
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id); // 'number'가 출력됨
    return this.postsService.findOne(id);
  }
}
```
</details>

### 문제 2: 관리자 역할(Role) 가드 만들기
- **요구사항**: 관리자(`admin`) 역할을 가진 사용자만 접근할 수 있는 라우트를 보호하는 `RolesGuard`를 만드세요.
- **세부사항**:
    1. `RolesGuard` 클래스를 만들고 `CanActivate`를 구현합니다.
    2. `canActivate` 메소드 내에서, 요청 객체에 `user` 속성이 있고 `user.role`이 `'admin'`인지 확인합니다. (실제 앱에서는 이전 인증 단계에서 `req.user`를 설정했다고 가정합니다.)
    3. `@SetMetadata('roles', ['admin'])` 와 같은 커스텀 데코레이터를 사용하여 라우트에 필요한 역할을 지정하고, 가드에서 `Reflector` 서비스를 사용하여 이 메타데이터를 읽어와 검증 로직을 구현할 수 있습니다. (이 부분은 심화 과정이므로, 우선 가드 내부에 `req.user.role === 'admin'`을 하드코딩하여 구현해 보세요.)
    4. 특정 컨트롤러나 라우트 메소드에 `@UseGuards(RolesGuard)`를 적용하여 테스트합니다.

<details>
<summary>문제 2 힌트</summary>

```typescript
// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // 인증 미들웨어나 가드에서 user를 설정했다고 가정

    // 간단한 예시: user 객체가 있고 role이 'admin'인지 확인
    return user && user.role === 'admin';
  }
}

// 사용 예시 (컨트롤러)
// @UseGuards(RolesGuard)
// @Get('secret')
// getSecretData() { ... }
```
</details>
