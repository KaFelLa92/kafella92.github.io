# 4장: 모듈 - 코드의 체계적인 정리와 캡슐화

모듈(Module)은 NestJS 애플리케이션의 아키텍처를 구성하는 기본 단위입니다. 관련된 기능(컨트롤러, 프로바이더 등)들을 하나의 모듈로 묶어 코드를 체계적으로 관리하고, 애플리케이션의 구조를 명확하게 만듭니다.

---

## 1. 핵심 개념

- **모듈 (`@Module`)**: `@Module()` 데코레이터가 붙은 클래스입니다. 이 데코레이터는 NestJS가 애플리케이션 구조를 구성하는 데 사용하는 메타데이터를 제공하는 객체를 인자로 받습니다.

- **`@Module` 데코레이터의 주요 속성**:
    - **`providers`**: 이 모듈 내에서 사용될 프로바이더(서비스 등)의 배열입니다. 여기에 등록된 프로바이더는 NestJS의 DI 컨테이너에 의해 인스턴스화되고, 이 모듈 내의 다른 구성 요소에 주입될 수 있습니다.
    - **`controllers`**: 이 모듈에서 정의할 컨트롤러의 배열입니다.
    - **`imports`**: 다른 모듈을 가져올 때 사용합니다. `imports` 배열에 포함된 모듈에서 `export`한 프로바이더들을 현재 모듈 내에서 사용할 수 있게 됩니다.
    - **`exports`**: 현재 모듈의 프로바이더 중 일부를 다른 모듈에서 사용할 수 있도록 외부에 공개할 때 사용합니다. `providers`에 등록된 프로바이더만 `export` 할 수 있습니다.

- **기능 모듈 (Feature Modules)**: 특정 기능(예: 사용자, 게시물, 주문)과 관련된 컨트롤러, 프로바이더 등을 묶어놓은 모듈입니다. 애플리케이션을 기능 단위로 분리하여 유지보수성을 높입니다.

- **루트 모듈 (Root Module)**: 애플리케이션의 진입점이 되는 최상위 모듈입니다. 보통 `AppModule`이라고 부르며, 다른 모든 기능 모듈들을 `imports`하여 애플리케이션 전체를 조립하는 역할을 합니다.

## 2. 모듈 생성 및 애플리케이션 조립

1.  **CLI로 모듈 생성**: `users` 기능에 대한 컨트롤러와 서비스를 포함하는 모듈을 생성해봅시다.
    ```bash
    nest generate module users
    # 단축 명령어: nest g mo users
    ```
    - `src/users/users.module.ts` 파일이 생성됩니다.
    - CLI는 자동으로 `AppModule`의 `imports` 배열에 `UsersModule`을 추가해줍니다.

2.  **기능 모듈 구성 (`users.module.ts`)**: `UsersController`와 `UsersService`를 `UsersModule`에 등록합니다.
    ```typescript
    // src/users/users.module.ts
    import { Module } from '@nestjs/common';
    import { UsersController } from './users.controller';
    import { UsersService } from './users.service';

    @Module({
      controllers: [UsersController], // UsersModule이 담당할 컨트롤러
      providers: [UsersService]       // UsersModule이 담당할 프로바이더
    })
    export class UsersModule {}
    ```

3.  **루트 모듈 구성 (`app.module.ts`)**: 루트 모듈에서는 `UsersModule`을 `imports` 하기만 하면 됩니다.
    ```typescript
    // src/app.module.ts
    import { Module } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { UsersModule } from './users/users.module'; // UsersModule 임포트

    @Module({
      imports: [UsersModule], // UsersModule을 가져와서 사용
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}
    ```
    - 이제 `AppModule`은 `UsersModule`의 존재를 알게 되고, `UsersModule`에 정의된 `/users` 관련 라우팅이 활성화됩니다.

---

## 3. 예제: 모듈 간 프로바이더 공유

`AuthModule`에서 제공하는 `AuthService`를 `UsersModule`에서 사용하고 싶다고 가정해봅시다.

1.  **`AuthModule`에서 서비스 `export` 하기**:
    ```typescript
    // src/auth/auth.module.ts
    import { Module } from '@nestjs/common';
    import { AuthService } from './auth.service';

    @Module({
      providers: [AuthService],
      exports: [AuthService] // AuthService를 다른 모듈에서 사용할 수 있도록 공개
    })
    export class AuthModule {}
    ```

2.  **`UsersModule`에서 `AuthModule` `import` 하기**:
    ```typescript
    // src/users/users.module.ts
    import { Module } from '@nestjs/common';
    import { UsersController } from './users.controller';
    import { UsersService } from './users.service';
    import { AuthModule } from '../auth/auth.module'; // AuthModule 임포트

    @Module({
      imports: [AuthModule], // AuthModule을 임포트하여 AuthService를 사용할 수 있게 됨
      controllers: [UsersController],
      providers: [UsersService]
    })
    export class UsersModule {}
    ```

3.  **`UsersService`에서 `AuthService` 주입받아 사용하기**:
    ```typescript
    // src/users/users.service.ts
    import { Injectable } from '@nestjs/common';
    import { AuthService } from '../auth/auth.service'; // AuthService 임포트

    @Injectable()
    export class UsersService {
      // 생성자에서 AuthService를 주입받음
      constructor(private readonly authService: AuthService) {}

      someMethod() {
        // 주입받은 authService의 메소드를 사용
        this.authService.validateUser();
      }
    }
    ```

---

## 4. 연습 문제

### 문제 1: `PostsModule` 만들기
- **요구사항**: 3장에서 만들었던 `PostsController`와 `PostsService`를 관리하는 `PostsModule`을 만드세요.
- **세부사항**:
    1. `nest g mo posts` 명령어로 `PostsModule`을 생성합니다.
    2. `PostsModule`의 `controllers` 배열에 `PostsController`를, `providers` 배열에 `PostsService`를 등록합니다.
    3. 루트 모듈인 `AppModule`의 `imports` 배열에 `PostsModule`을 추가합니다.
    4. `AppModule`의 `controllers`와 `providers` 배열에서는 `PostsController`와 `PostsService`를 제거합니다. (이제 `PostsModule`이 관리하므로)
- **확인**: 서버를 재시작하고, 이전에 만들었던 `/posts` 관련 API가 정상적으로 동작하는지 확인합니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
// src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
```

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module'; // 임포트 추가

@Module({
  imports: [PostsModule], // 여기에 PostsModule 추가
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
</details>

### 문제 2: 전역 모듈(Global Module) 만들기
- **개념**: `@Global()` 데코레이터를 사용하여 모듈을 전역으로 만들 수 있습니다. 전역 모듈은 루트 모듈(`AppModule`)에 한 번만 `import`하면, 다른 모든 모듈에서 별도로 `import`하지 않아도 해당 모듈이 `export`한 프로바이더를 사용할 수 있게 됩니다.
- **요구사항**: 애플리케이션 전반에서 사용될 `ConfigService`를 제공하는 `ConfigModule`을 전역 모듈로 만들어보세요.
- **세부사항**:
    1. `nest g mo config` 및 `nest g s config`로 모듈과 서비스를 생성합니다.
    2. `ConfigService`는 간단한 설정 값(예: `get(key: string)`)을 반환하는 메소드를 가집니다.
    3. `ConfigModule`에서 `ConfigService`를 `providers`와 `exports`에 등록합니다.
    4. `ConfigModule` 클래스 위에 `@Global()` 데코레이터를 추가합니다.
    5. `AppModule`에 `ConfigModule`을 `import`합니다.
    6. 이제 `PostsModule`이나 `UsersModule`에서 `ConfigModule`을 `import`하지 않고도, `PostsService`나 `UsersService`의 생성자에서 `ConfigService`를 바로 주입받을 수 있는지 확인합니다.
- **언제 사용할까?**: 설정, 데이터베이스 연결 등 애플리케이션 전반에서 한 번만 설정되고 널리 사용되는 프로바이더를 제공할 때 유용합니다. (남용하지 않도록 주의)

<details>
<summary>문제 2 정답 예시</summary>

```typescript
// src/config/config.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly envConfig = { API_KEY: '12345-secret' };
  get(key: string): string {
    return this.envConfig[key];
  }
}
```

```typescript
// src/config/config.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global() // 전역 모듈로 설정
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
```

```typescript
// src/app.module.ts
// ...
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, UsersModule, PostsModule], // 루트에 한 번만 임포트
  // ...
})
export class AppModule {}
```

```typescript
// src/posts/posts.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service'; // 타입 임포트는 필요

@Injectable()
export class PostsService {
  // PostsModule에 ConfigModule을 임포트하지 않았지만 주입 가능
  constructor(private readonly configService: ConfigService) {
    console.log('API Key:', this.configService.get('API_KEY'));
  }
  // ...
}
```
</details>
