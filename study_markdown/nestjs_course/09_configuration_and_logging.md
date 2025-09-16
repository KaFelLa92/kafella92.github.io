# 9장: 설정 및 로깅 - 애플리케이션 환경 관리하기

프로덕션 수준의 애플리케이션은 다양한 환경(개발, 스테이징, 프로덕션)에서 동작해야 하며, 각 환경에 맞는 설정 값을 가져야 합니다. 또한, 애플리케이션의 동작 상태를 추적하고 디버깅하기 위한 로깅(Logging) 시스템도 필수적입니다. NestJS에서 이를 효과적으로 관리하는 방법을 배웁니다.

---

## 1. 설정 관리 (`@nestjs/config`)

`@nestjs/config`는 NestJS 공식 설정 관리 모듈로, `.env` 파일이나 환경 변수를 애플리케이션에서 쉽게 사용할 수 있도록 도와줍니다.

1.  **라이브러리 설치**:
    ```bash
    npm install @nestjs/config
    ```

2.  **`.env` 파일 생성**: 프로젝트 루트에 `.env` 파일을 만들고 환경별 설정 값을 정의합니다. `.gitignore`에 `.env`를 추가하는 것을 잊지 마세요.
    ```
    # .env
    NODE_ENV=development
    PORT=3000
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=myuser
    DB_PASSWORD=mypassword
    DB_DATABASE=mydb
    JWT_SECRET=my-super-secret-key-for-dev
    ```

3.  **`ConfigModule` 설정 (`app.module.ts`)**: 루트 모듈에 `ConfigModule.forRoot()`를 등록합니다.
    ```typescript
    // src/app.module.ts
    import { Module } from '@nestjs/common';
    import { ConfigModule } from '@nestjs/config';
    import { AppController } from './app.controller';
    // ...

    @Module({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true, // ConfigModule을 전역 모듈로 설정
          envFilePath: `.env.${process.env.NODE_ENV}` // NODE_ENV 값에 따라 .env.development, .env.production 등을 로드 (선택적)
        }),
        // ... 다른 모듈들
      ],
      controllers: [AppController],
      // ...
    })
    export class AppModule {}
    ```
    - `isGlobal: true`로 설정하면, 다른 모듈에서 `ConfigModule`을 `import`하지 않아도 `ConfigService`를 주입받아 사용할 수 있습니다.

4.  **`ConfigService` 사용**: 서비스나 다른 프로바이더에서 `ConfigService`를 주입받아 환경 변수 값을 가져옵니다.
    ```typescript
    // src/app.service.ts
    import { Injectable } from '@nestjs/common';
    import { ConfigService } from '@nestjs/config';

    @Injectable()
    export class AppService {
      constructor(private configService: ConfigService) {
        // get<T>() 메소드로 타입 추론과 함께 값을 가져옴
        const dbHost = this.configService.get<string>('DB_HOST');
        console.log('Database Host:', dbHost);
      }

      getHello(): string {
        const port = this.configService.get('PORT');
        return `Hello World! I am running on port ${port}`;
      }
    }
    ```

5.  **TypeORM과 연동**: `TypeOrmModule.forRootAsync`를 사용하면 `ConfigService`를 주입받아 동적으로 데이터베이스 연결 설정을 구성할 수 있습니다.
    ```typescript
    // src/app.module.ts
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        // ... 등등
      }),
      inject: [ConfigService],
    }),
    ```

---

## 2. 로깅 (Logging)

NestJS는 `console`과 유사한 인터페이스를 가진 내장 로거(`Logger`)를 제공합니다. 이 로거는 로그 레벨(log, error, warn, debug, verbose)을 지원하며, 로그 메시지에 컨텍스트와 타임스탬프를 추가해줍니다.

### 예제 1: 내장 `Logger` 사용하기

```typescript
// src/users/users.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  // Logger 인스턴스를 생성하고, 컨텍스트(context)를 전달
  private readonly logger = new Logger(UsersService.name);

  findAll() {
    // 각 로그 레벨에 맞는 메소드 사용
    this.logger.log('Finding all users...');
    try {
      // ... 로직 ...
      this.logger.verbose('User search completed successfully.');
      return [];
    } catch (error) {
      this.logger.error('Failed to find users', error.stack);
      throw error;
    }
  }
}
```
- **로그 출력**: `[Nest] 12345  - 01/01/2024, 12:00:00 PM     LOG [UsersService] Finding all users...` 와 같은 형식으로 출력됩니다.

### 예제 2: 커스텀 로거 만들기

`LoggerService` 인터페이스를 구현하여 자신만의 커스텀 로거를 만들 수 있습니다. 이를 통해 로그를 파일에 저장하거나, 외부 로깅 서비스(예: Sentry, Datadog)로 전송할 수 있습니다.

```typescript
// src/common/logging/my-logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  log(message: string, context: string) {
    console.log(`[${context}] - ${message}`);
  }
  error(message: string, trace: string, context: string) {
    console.error(`[${context}] - ${message}`, trace);
  }
  warn(message: string, context: string) {
    console.warn(`[${context}] - ${message}`);
  }
  // ... debug, verbose 등 구현
}
```

- **`main.ts`에서 커스텀 로거 적용**:
  ```typescript
  // src/main.ts
  async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
      // NestJS의 기본 로거 대신 커스텀 로거를 사용하도록 설정
      logger: new MyLogger(),
    });
    await app.listen(3000);
  }
  ```

---

## 3. 연습 문제

### 문제 1: 유효성 검사를 통한 설정 관리
- **요구사항**: `@nestjs/config`가 `.env` 파일을 로드할 때, 필수 환경 변수가 존재하는지, 그리고 올바른 타입인지 검증하는 로직을 추가하세요.
- **세부사항**:
    1. `joi` 라이브러리를 설치합니다. (`npm install joi`)
    2. `ConfigModule.forRoot()`의 옵션 객체에 `validationSchema` 속성을 추가합니다.
    3. `Joi.object({ ... })`를 사용하여 스키마를 정의합니다. 예를 들어 `NODE_ENV`는 `'development'`, `'production'` 중 하나여야 하고, `PORT`는 필수 숫자여야 한다는 규칙을 정의합니다.
- **장점**: 필수 환경 변수가 누락된 채로 애플리케이션이 실행되는 것을 방지하여, 런타임 오류를 미리 막을 수 있습니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
// src/app.module.ts
import * as Joi from 'joi';

// ...
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    // ...
  ],
})
export class AppModule {}
```
</details>

### 문제 2: 요청 ID 로깅하기
- **요구사항**: 모든 요청에 고유한 ID를 부여하고, 해당 요청과 관련된 모든 로그에 이 ID가 포함되도록 로깅 시스템을 개선하세요.
- **세부사항**:
    1. 모든 요청을 처리하는 미들웨어를 만듭니다.
    2. 미들웨어에서 `uuid` 같은 라이브러리(`npm install uuid`)를 사용하여 고유한 요청 ID를 생성하고, `req.id = generatedId` 와 같이 요청 객체에 저장합니다.
    3. 요청 스코프(Request Scope)를 가진 로거 서비스를 만듭니다. 이 서비스는 생성될 때 `REQUEST` 객체를 주입받아 요청 ID를 멤버 변수로 저장합니다.
    4. 이제 이 로거를 사용하여 로그를 남기면, 모든 로그 메시지에 해당 요청의 고유 ID를 함께 출력할 수 있습니다.
- **장점**: 분산 시스템 환경이나 비동기 처리가 많은 복잡한 요청의 흐름을 추적하고 디버깅하는 데 매우 유용합니다.

<details>
<summary>문제 2 힌트</summary>

```typescript
// 1. 요청 ID를 주입하는 미들웨어
// ...
import { v4 as uuidv4 } from 'uuid';
// ...
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// 2. 요청 스코프 로거
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedLogger {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  log(message: string) {
    console.log(`[${this.request.id}] - ${message}`);
  }
}
```
</details>
