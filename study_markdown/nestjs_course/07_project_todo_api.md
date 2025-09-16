# 7장: 실전 프로젝트 - Todo 리스트 API 서버 만들기

지금까지 배운 NestJS의 핵심 개념(모듈, 컨트롤러, 프로바이더, DI, TypeORM, 파이프 등)을 모두 활용하여 할 일(Todo) 목록을 관리하는 완전한 CRUD API 서버를 구축합니다.

---

## 1. 프로젝트 목표 및 구조

- **기능 요구사항**:
    - Todo 목록 조회 (완료/미완료 필터링 기능 포함)
    - 특정 Todo 조회
    - 새 Todo 생성 (내용 유효성 검사 포함)
    - Todo 내용 및 완료 상태 수정
    - 특정 Todo 삭제

- **기술 스택**:
    - 프레임워크: NestJS
    - 데이터베이스: TypeORM + SQLite (간단한 파일 기반 DB로 설정이 쉬움)
    - 유효성 검사: `class-validator`, `class-transformer`

- **프로젝트 구조**:
    ```
    todo-api/
    ├── src/
    │   ├── app.module.ts
    │   ├── main.ts
    │   └── todos/
    │       ├── entities/todo.entity.ts
    │       ├── dto/
    │       │   ├── create-todo.dto.ts
    │       │   └── update-todo.dto.ts
    │       ├── todos.controller.ts
    │       ├── todos.module.ts
    │       └── todos.service.ts
    └── ... (기타 설정 파일)
    ```

## 2. 구현 단계

### 1단계: 프로젝트 생성 및 기본 설정

```bash
# 1. 새 NestJS 프로젝트 생성
nest new todo-api
cd todo-api

# 2. 필요한 라이브러리 설치
npm install @nestjs/typeorm typeorm sqlite3 class-validator class-transformer
```

### 2단계: 데이터베이스 연동 및 `AppModule` 설정

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // SQLite 사용
      database: 'todo.db', // 프로젝트 루트에 todo.db 파일 생성
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 개발용으로 스키마 자동 동기화
    }),
    TodosModule, // Todos 기능 모듈 임포트
  ],
})
export class AppModule {}
```

### 3단계: `Todos` 모듈, 엔티티, DTO 생성

```bash
# Todos 모듈, 컨트롤러, 서비스 한번에 생성
nest g resource todos
```
- 위 명령은 `todos` 폴더와 그 안의 기본 파일들, 그리고 `Todo` 엔티티와 DTO 클래스까지 생성해줍니다. 생성된 파일들을 아래와 같이 수정합니다.

```typescript
// src/todos/entities/todo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task: string;

  @Column({ default: false })
  isDone: boolean;
}
```

```typescript
// src/todos/dto/create-todo.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  task: string;
}
```

```typescript
// src/todos/dto/update-todo.dto.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional() // task는 선택적으로 업데이트 가능
  task?: string;

  @IsBoolean()
  @IsOptional() // isDone도 선택적으로 업데이트 가능
  isDone?: boolean;
}
```

### 4단계: `TodosService`에 CRUD 로직 구현

`todos.service.ts` 파일에 TypeORM 리포지토리를 주입받아 각 비즈니스 로직을 완성합니다.

```typescript
// src/todos/todos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create(createTodoDto);
    return this.todosRepository.save(todo);
  }

  findAll(isDone?: boolean): Promise<Todo[]> {
    if (isDone !== undefined) {
      return this.todosRepository.find({ where: { isDone } });
    }
    return this.todosRepository.find();
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todosRepository.preload({ id, ...updateTodoDto });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return this.todosRepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.todosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }
}
```

### 5단계: `TodosController` 구현 및 `ValidationPipe` 적용

`todos.controller.ts`에서 서비스의 메소드를 호출하고, 파이프를 적용합니다.

```typescript
// src/todos/todos.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ValidationPipe, ParseBoolPipe, DefaultValuePipe } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll(@Query('isDone', new DefaultValuePipe(undefined), ParseBoolPipe) isDone?: boolean) {
    return this.todosService.findAll(isDone);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }
}
```
- **참고**: `@Patch`는 리소스의 부분 수정을 의미하므로 `PUT`보다 더 적합합니다.
- `main.ts`에 `app.useGlobalPipes(new ValidationPipe({ whitelist: true }));`를 추가하면 컨트롤러에서 `ValidationPipe`를 반복적으로 선언하지 않아도 됩니다. `whitelist: true` 옵션은 DTO에 정의되지 않은 속성이 들어오면 자동으로 제거하는 유용한 기능입니다.

---

## 3. 연습 문제 및 개선 과제

### 문제 1: 검색 기능 추가
- **요구사항**: `GET /todos` 엔드포인트에 `task` 쿼리 파라미터를 추가하여, 특정 키워드가 포함된 Todo만 검색하는 기능을 구현하세요.
- **세부사항**:
    1. `TodosService`의 `findAll` 메소드를 수정하여, `task` 문자열을 인자로 받도록 합니다.
    2. TypeORM의 `Like` 연산자를 사용하여 `task` 컬럼에 대한 부분 일치 검색을 구현합니다. (예: `this.todosRepository.find({ where: { task: Like(`%${task}%`) } })`)
    3. `TodosController`의 `findAll` 메소드에서 `@Query('task')`로 검색어를 받아 서비스에 전달합니다.

<details>
<summary>문제 1 힌트</summary>

```typescript
// src/todos/todos.service.ts
import { Like } from 'typeorm';

// ...
  findAll(isDone?: boolean, task?: string): Promise<Todo[]> {
    const where: any = {};
    if (isDone !== undefined) where.isDone = isDone;
    if (task) where.task = Like(`%${task}%`);

    return this.todosRepository.find({ where });
  }
// ...
```
</details>

### 문제 2: 사용자(User)와 Todo 관계 맺기
- **요구사항**: `User` 엔티티를 만들고, 하나의 `User`가 여러 개의 `Todo`를 가질 수 있는 일대다(One-to-Many) 관계를 설정하세요.
- **세부사항**:
    1. `User` 엔티티를 생성합니다. (`id`, `name` 등)
    2. `User` 엔티티에는 `@OneToMany(() => Todo, todo => todo.user)` 데코레이터로 `todos` 속성을 추가합니다.
    3. `Todo` 엔티티에는 `@ManyToOne(() => User, user => user.todos)` 데코레이터로 `user` 속성을 추가하여 관계를 맺습니다. 이렇게 하면 `todo` 테이블에 `userId` 외래 키(Foreign Key)가 생성됩니다.
    4. Todo를 생성할 때 어떤 사용자의 Todo인지 `userId`를 함께 받도록 로직을 수정합니다.
    5. 특정 사용자의 Todo 목록만 조회하는 API(예: `GET /users/:userId/todos`)를 만들어봅니다.

<details>
<summary>문제 2 힌트</summary>

```typescript
// src/users/entities/user.entity.ts
// ...
@OneToMany(() => Todo, todo => todo.user)
todos: Todo[];

// src/todos/entities/todo.entity.ts
// ...
@ManyToOne(() => User, user => user.todos)
user: User;
```
</details>
