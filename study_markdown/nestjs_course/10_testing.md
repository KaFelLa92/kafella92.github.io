# 10장: 테스팅 - 견고한 애플리케이션 만들기

테스트는 코드의 품질을 보장하고, 리팩토링이나 기능 추가 시 발생할 수 있는 예기치 않은 버그(회귀, Regression)를 방지하는 안전망 역할을 합니다. NestJS는 Jest 테스팅 프레임워크와 Supertest 라이브러리를 기반으로 한 강력한 테스팅 환경을 기본으로 제공합니다.

---

## 1. 핵심 개념

- **테스팅의 종류**:
    - **단위 테스트 (Unit Tests)**: 가장 작은 코드 단위(함수, 메소드, 클래스)를 개별적으로 테스트합니다. 의존성은 모의(mock) 객체로 대체하여 해당 단위의 로직에만 집중합니다.
    - **통합 테스트 (Integration Tests)**: 여러 개의 단위(클래스, 모듈)가 함께 상호작용하는 방식을 테스트합니다. 실제 데이터베이스나 외부 서비스와의 연동을 테스트할 수 있습니다.
    - **E2E 테스트 (End-to-End Tests)**: 실제 사용자의 시나리오처럼, API 엔드포인트에 HTTP 요청을 보내 전체 시스템이 예상대로 동작하는지 검증합니다. NestJS에서는 Supertest를 사용하여 이를 수행합니다.

- **테스트 파일**: `*.spec.ts` (단위/통합 테스트) 또는 `*.e2e-spec.ts` (E2E 테스트) 명명 규칙을 따릅니다.

- **Jest**: Facebook에서 만든 JavaScript 테스팅 프레임워크입니다. 테스트 러너, 단언(assertion) 라이브러리, 모의(mocking) 기능 등을 포함하고 있습니다.
    - `describe(name, fn)`: 여러 관련 테스트를 하나의 그룹으로 묶습니다.
    - `it(name, fn)` 또는 `test(name, fn)`: 개별 테스트 케이스를 정의합니다.
    - `expect(value)`: 값을 검증하기 위한 단언을 시작합니다. `.toBe()`, `.toEqual()`, `.toHaveBeenCalled()` 등 다양한 매처(matcher)와 함께 사용됩니다.
    - `beforeEach(fn)`, `afterEach(fn)`: 각 테스트 케이스 실행 전/후에 특정 작업을 수행합니다.

- **모의(Mocking)**: 테스트하려는 대상의 의존성을 실제 객체 대신 가짜 객체(모의 객체)로 대체하는 기술입니다. 이를 통해 외부 요인(DB, 네트워크 등)에 상관없이 순수하게 테스트 대상의 로직만 검증할 수 있습니다.

## 2. NestJS 테스팅 환경

- **`@nestjs/testing`**: NestJS 애플리케이션의 일부(모듈, 컨트롤러, 프로바이더)를 테스트 환경에서 실행할 수 있도록 도와주는 `Test` 클래스를 제공합니다.
  `Test.createTestingModule({ ... }).compile()`을 사용하여 테스트용 모듈을 생성합니다.

- **Supertest**: HTTP 요청을 시뮬레이션하여 E2E 테스트를 쉽게 작성할 수 있도록 도와주는 라이브러리입니다.

## 3. 예제 코드

### 예제 1: 서비스 단위 테스트 (`users.service.spec.ts`)

`UsersService`의 `findOne` 메소드를 테스트합니다. `usersRepository`는 모의 객체로 대체합니다.

```typescript
// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

// 모의 리포지토리 객체 생성
const mockUserRepository = {
  findOneBy: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;


describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          // getRepositoryToken(User) 토큰에 대해 실제 Repository 대신 모의 객체를 제공
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@test.com' };
      // repository.findOneBy가 호출되면 user 객체를 반환하도록 설정
      repository.findOneBy.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
```

### 예제 2: 컨트롤러 E2E 테스트 (`app.e2e-spec.ts`)

`GET /` 엔드포인트가 "Hello World!"를 반환하는지 테스트합니다.

```typescript
// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()) // app 인스턴스로 HTTP 서버에 요청
      .get('/')
      .expect(200) // 상태 코드가 200인지 확인
      .expect('Hello World!'); // 응답 본문이 'Hello World!'인지 확인
  });

  afterAll(async () => {
    await app.close();
  });
});
```

**테스트 실행**: `npm run test` (단위/통합 테스트), `npm run test:e2e` (E2E 테스트)

---

## 3. 연습 문제

### 문제 1: `PostsService` 단위 테스트 작성하기
- **요구사항**: `PostsService`의 `findAll` 메소드에 대한 단위 테스트를 작성하세요.
- **세부사항**:
    1. `posts.service.spec.ts` 파일을 생성합니다.
    2. `PostRepository`를 모의 객체로 만듭니다. `find` 메소드를 `jest.fn()`으로 모의 처리합니다.
    3. `Test.createTestingModule`을 사용하여 테스트 모듈을 설정하고, `PostsService`와 모의 `PostRepository`를 `providers`로 등록합니다.
    4. `it` 블록 안에서, 모의 `find` 메소드가 특정 게시물 배열을 반환하도록 설정합니다. (`mockResolvedValue` 사용)
    5. `service.findAll()`을 호출하고, 그 결과가 모의 `find` 메소드가 반환하기로 설정한 배열과 동일한지 `expect(...).toEqual(...)`로 검증합니다.

<details>
<summary>문제 1 힌트</summary>

```typescript
// posts.service.spec.ts
// ... imports

describe('PostsService', () => {
  // ... service, repository 변수 선언 및 beforeEach 설정 ...

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const mockPosts = [{ id: 1, title: 'Test Post' }];
      repository.find.mockResolvedValue(mockPosts);

      const posts = await service.findAll();

      expect(posts).toEqual(mockPosts);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
```
</details>

### 문제 2: `PostsController` E2E 테스트 작성하기
- **요구사항**: `GET /posts`와 `GET /posts/:id` 엔드포인트에 대한 E2E 테스트를 작성하세요.
- **세부사항**:
    1. `test/posts.e2e-spec.ts` 파일을 생성합니다.
    2. `app.e2e-spec.ts`와 유사하게 `INestApplication`을 설정하는 `beforeEach`를 작성합니다. (실제 DB 대신 테스트용 DB를 사용하도록 설정을 변경할 수도 있습니다.)
    3. `GET /posts` 테스트 케이스: `request(app.getHttpServer()).get('/posts').expect(200)` 와 같이 상태 코드를 검증하고, `.expect()`의 콜백 함수를 사용하여 응답 본문이 배열인지 검증할 수 있습니다.
    4. `GET /posts/:id` 테스트 케이스: 특정 ID(예: 1)로 요청을 보내고, 응답 객체의 `id`가 요청한 ID와 일치하는지 검증합니다.

<details>
<summary>문제 2 힌트</summary>

```typescript
// test/posts.e2e-spec.ts
// ... beforeEach 설정 ...

it('/posts (GET)', () => {
  return request(app.getHttpServer())
    .get('/posts')
    .expect(200)
    .expect(res => {
      expect(Array.isArray(res.body)).toBe(true);
    });
});

it('/posts/:id (GET)', () => {
  return request(app.getHttpServer())
    .get('/posts/1')
    .expect(200)
    .expect(res => {
      expect(res.body.id).toBe(1);
    });
});
```
</details>
