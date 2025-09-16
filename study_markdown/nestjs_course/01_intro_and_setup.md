# 1장: NestJS 소개 및 개발 환경 설정

효율적이고 확장 가능한 서버 사이드 애플리케이션을 구축하기 위한 프레임워크, NestJS의 세계에 오신 것을 환영합니다. NestJS가 어떤 철학을 가지고 있으며, Express.js와 어떻게 다른지, 그리고 첫 프로젝트를 어떻게 시작하는지 배웁니다.

---

## 1. 핵심 개념

- **NestJS란?**: Node.js 서버 애플리케이션을 구축하기 위한 프로그레시브(Progressive) 프레임워크입니다. 내부적으로는 Express(또는 Fastify)를 기반으로 동작하지만, 그 위에 강력한 아키텍처 패턴을 제공합니다.

- **주요 철학 및 특징**:
    - **TypeScript 기반**: 모든 코드를 TypeScript로 작성하여 코드의 안정성과 유지보수성을 극대화합니다.
    - **아키텍처**: Angular에서 영감을 받은 모듈(Modules), 프로바이더(Providers), 컨트롤러(Controllers) 기반의 강력한 아키텍처를 제공합니다. 이를 통해 대규모 애플리케이션도 체계적으로 구성할 수 있습니다.
    - **DI (Dependency Injection, 의존성 주입)**: 컴포넌트 간의 결합도를 낮추고 코드의 재사용성과 테스트 용이성을 높이는 디자인 패턴을 프레임워크 수준에서 지원합니다.
    - **확장성**: Express의 미들웨어 시스템을 그대로 활용하면서도, 파이프(Pipes), 가드(Guards), 인터셉터(Interceptors) 등 NestJS 고유의 확장 기능을 제공합니다.

- **Express.js vs NestJS**:
    - **Express**: 자유도가 높은 반면, 프로젝트 구조에 대한 가이드가 없어 개발자나 팀이 직접 구조를 정해야 합니다. 소규모 프로젝트나 간단한 API에 적합합니다.
    - **NestJS**: 정해진 아키텍처가 있어 코드의 일관성을 유지하기 쉽고, 대규모의 복잡한 애플리케이션 개발에 매우 적합합니다. DI, 타입 시스템 등 엔터프라이즈급 기능을 기본으로 제공합니다.

## 2. 개발 환경 설정

1.  **Node.js 설치**: 최신 LTS 버전을 설치합니다.
2.  **NestJS CLI 설치**: NestJS는 프로젝트 생성, 코드 스캐폴딩 등을 위한 강력한 CLI(Command Line Interface) 도구를 제공합니다. 전역(global)으로 설치합니다.
    ```bash
    npm i -g @nestjs/cli
    ```

3.  **새 프로젝트 생성**:
    ```bash
    nest new my-nest-app
    ```
    - 위 명령어를 실행하면, NestJS가 어떤 패키지 매니저(npm, yarn, pnpm)를 사용할지 묻습니다. `npm`을 선택하면 됩니다.
    - 잠시 후 `my-nest-app` 폴더가 생성되고, 필요한 모든 의존성 설치와 기본 프로젝트 구조 설정이 완료됩니다.

## 3. 프로젝트 구조 훑어보기

NestJS CLI가 생성해준 기본 프로젝트 구조는 다음과 같습니다.

```
my-nest-app/
├── src/                  <-- 핵심 소스 코드 폴더
│   ├── app.controller.ts   # 기본 컨트롤러 (라우팅 담당)
│   ├── app.module.ts       # 루트 모듈 (애플리케이션의 구성 요소 정의)
│   ├── app.service.ts      # 기본 서비스 (비즈니스 로직 담당)
│   └── main.ts             # 애플리케이션의 시작점 (서버 실행)
├── test/                 # 테스트 코드 폴더
├── .eslintrc.js          # ESLint 설정
├── nest-cli.json         # NestJS CLI 설정
├── package.json          # 프로젝트 정보 및 의존성
└── tsconfig.json         # TypeScript 컴파일러 설정
```

- **`main.ts`**: NestJS 애플리케이션 인스턴스를 생성하고 특정 포트에서 리스닝을 시작하는 파일입니다.
- **`app.module.ts`**: 애플리케이션의 루트 모듈(Root Module)입니다. 이 모듈에 다른 모듈, 컨트롤러, 프로바이더를 등록하여 애플리케이션을 구성합니다.
- **`app.controller.ts`**: 들어오는 요청을 처리하고 응답을 반환하는 역할을 합니다. 경로(path)와 핸들러 함수를 가집니다.
- **`app.service.ts`**: 실제 비즈니스 로직(예: 데이터 계산, 데이터베이스 접근)을 처리합니다. 컨트롤러는 서비스에게 작업을 위임합니다.

## 4. 개발 서버 실행

```bash
cd my-nest-app
npm run start:dev
```
- `start:dev` 스크립트는 `nodemon`과 유사하게 파일 변경을 감지하여 자동으로 서버를 재시작해주므로 개발 시 매우 편리합니다.
- 서버가 실행되면 터미널에 로그가 출력되고, 기본적으로 `http://localhost:3000`에서 실행됩니다.
- 브라우저에서 위 주소로 접속하면 "Hello World!"가 표시됩니다. 이는 `app.controller.ts`와 `app.service.ts`에 의해 처리된 결과입니다.

---

## 5. 연습 문제

### 문제 1: 새로운 라우트 추가하기
- **요구사항**: `app.controller.ts` 파일을 수정하여, `/hello` 경로로 GET 요청이 들어왔을 때 "Hello, NestJS!" 라는 문자열을 반환하는 새로운 라우트를 추가해보세요.
- **세부사항**:
    1. `app.controller.ts` 파일을 엽니다.
    2. `@Get()` 데코레이터 위에 `@Get('hello')` 와 같이 새로운 메소드를 추가합니다.
    3. 메소드 이름은 `sayHello()` 와 같이 자유롭게 짓고, 문자열 "Hello, NestJS!"를 반환하도록 합니다.
- **확인**: 서버가 자동으로 재시작된 후, 브라우저에서 `http://localhost:3000/hello` 로 접속하여 결과 확인.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 새로 추가된 부분
  @Get('hello')
  sayHello(): string {
    return 'Hello, NestJS!';
  }
}
```
</details>

### 문제 2: 서비스 메소드 분리하기
- **요구사항**: 문제 1에서 컨트롤러에 직접 작성했던 로직을 `app.service.ts`로 분리해보세요.
- **세부사항**:
    1. `app.service.ts`에 `sayHello()` 라는 새로운 메소드를 만들고, "Hello, NestJS!" 문자열을 반환하게 합니다.
    2. `app.controller.ts`의 `sayHello()` 메소드에서, `appService`를 사용하여 방금 만든 서비스의 `sayHello()` 메소드를 호출하고 그 결과를 반환하도록 수정합니다. (예: `return this.appService.sayHello();`)
- **이유**: 컨트롤러는 요청을 받고 응답을 보내는 역할에 집중하고, 실제 로직 처리는 서비스에게 위임하는 것이 NestJS의 기본 아키텍처 패턴입니다. 이를 통해 역할과 책임이 명확하게 분리됩니다.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
// src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // 새로 추가된 부분
  sayHello(): string {
    return 'Hello, NestJS!';
  }
}
```

```typescript
// src/app.controller.ts
// ... imports

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ... getHello() ...

  @Get('hello')
  sayHello(): string {
    // 서비스의 메소드를 호출하도록 수정
    return this.appService.sayHello();
  }
}
```
</details>
