# 6장: 데이터베이스 연동 (with TypeORM)

대부분의 웹 애플리케이션은 데이터를 영구적으로 저장하기 위해 데이터베이스를 사용합니다. NestJS에서 가장 널리 사용되는 ORM(Object-Relational Mapping) 라이브러리인 TypeORM을 사용하여 데이터베이스와 상호작용하는 방법을 배웁니다.

---

## 1. 핵심 개념

- **ORM (Object-Relational Mapping)**:
    - 객체 지향 프로그래밍 언어(TypeScript/JavaScript)의 객체(Object)와 관계형 데이터베이스(Relational Database)의 테이블을 자동으로 매핑(연결)해주는 기술입니다.
    - 복잡한 SQL 쿼리를 직접 작성하는 대신, `user.save()`, `userRepository.find()` 와 같은 객체 지향적인 코드로 데이터베이스를 조작할 수 있게 해줍니다.

- **TypeORM**: TypeScript와 JavaScript를 위한 ORM 라이브러리입니다. NestJS와 매우 잘 통합됩니다.

- **주요 용어**:
    - **Entity (엔티티)**: 데이터베이스의 테이블과 매핑되는 클래스입니다. 클래스의 속성(property)은 테이블의 컬럼(column)에 해당합니다. `@Entity()` 데코레이터로 정의합니다.
    - **Repository (리포지토리)**: 특정 엔티티에 대한 데이터베이스 작업을 수행하는 메소드(예: `find`, `findOne`, `save`, `delete`)를 제공하는 객체입니다. 리포지토리 패턴을 구현합니다.
    - **Connection/Data Source**: 데이터베이스 연결 정보를 담고 있는 객체입니다.

## 2. TypeORM 설정 및 연동

1.  **필요한 라이브러리 설치**:
    ```bash
    # typeorm과 nestjs 통합 모듈 설치
    npm install @nestjs/typeorm typeorm

    # 사용할 데이터베이스 드라이버 설치 (예: PostgreSQL)
    npm install pg
    # (SQLite를 사용한다면: npm install sqlite3)
    # (MySQL을 사용한다면: npm install mysql2)
    ```

2.  **데이터베이스 연결 설정 (`app.module.ts`)**: 루트 모듈(`AppModule`)의 `imports` 배열에 `TypeOrmModule.forRoot()`를 사용하여 데이터베이스 연결을 설정합니다.
    ```typescript
    // src/app.module.ts
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';

    @Module({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres', // 데이터베이스 타입
          host: 'localhost',
          port: 5432,
          username: 'your_username',
          password: 'your_password',
          database: 'your_database',
          entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 파일 경로
          synchronize: true, // 개발용 옵션: true로 설정 시 앱 실행 시마다 엔티티를 바탕으로 DB 스키마를 자동 생성. 프로덕션에서는 false로 설정해야 함.
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}
    ```
    **주의**: 실제 프로젝트에서는 위 설정 정보를 `.env` 파일과 ConfigService를 통해 관리하는 것이 좋습니다.

3.  **엔티티(Entity) 생성**:
    ```typescript
    // src/users/entities/user.entity.ts
    import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

    @Entity() // 이 클래스가 데이터베이스 테이블과 매핑됨을 나타냄
    export class User {
      @PrimaryGeneratedColumn() // 기본 키(Primary Key)이며, 값이 자동으로 생성됨
      id: number;

      @Column() // 일반 컬럼
      name: string;

      @Column({ unique: true }) // 유니크 제약 조건이 있는 컬럼
      email: string;
    }
    ```

4.  **기능 모듈에 리포지토리 등록 (`users.module.ts`)**: `TypeOrmModule.forFeature([User])`를 사용하여 `UsersModule`이 `User` 엔티티의 리포지토리를 사용할 수 있도록 등록합니다.
    ```typescript
    // src/users/users.module.ts
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { User } from './entities/user.entity';
    import { UsersService } from './users.service';
    import { UsersController } from './users.controller';

    @Module({
      imports: [TypeOrmModule.forFeature([User])], // User 리포지토리를 주입받을 수 있게 됨
      providers: [UsersService],
      controllers: [UsersController],
    })
    export class UsersModule {}
    ```

5.  **서비스에서 리포지토리 주입 및 사용**:
    ```typescript
    // src/users/users.service.ts
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { User } from './entities/user.entity';

    @Injectable()
    export class UsersService {
      constructor(
        // `@InjectRepository` 데코레이터를 사용하여 User 리포지토리를 주입받음
        @InjectRepository(User)
        private usersRepository: Repository<User>,
      ) {}

      findAll(): Promise<User[]> {
        return this.usersRepository.find();
      }

      findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
      }

      create(user: Partial<User>): Promise<User> {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
      }

      async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
      }
    }
    ```

---

## 3. 연습 문제

### 문제 1: `Post` 엔티티 및 모듈 설정하기
- **요구사항**: 블로그 게시물을 나타내는 `Post` 엔티티를 만들고, `PostsModule`에서 TypeORM과 연동되도록 설정하세요.
- **세부사항**:
    1. `src/posts/entities/post.entity.ts` 파일을 만듭니다.
    2. `Post` 엔티티는 `id`(자동 생성되는 숫자), `title`(문자열), `content`(문자열) 컬럼을 가져야 합니다.
    3. `PostsModule`의 `imports` 배열에 `TypeOrmModule.forFeature([Post])`를 추가합니다.
    4. `AppModule`의 `imports` 배열에 `PostsModule`이 포함되어 있는지 확인합니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
// src/posts/entities/post.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text') // 긴 텍스트를 위해 'text' 타입 지정 가능
  content: string;
}
```

```typescript
// src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
```
</details>

### 문제 2: `PostsService`에 CRUD 로직 구현하기
- **요구사항**: `PostsService`에 `Post` 리포지토리를 주입받아, 게시물에 대한 기본적인 CRUD(Create, Read, Update, Delete) 메소드를 구현하세요.
- **세부사항**:
    1. `PostsService`의 생성자에서 `@InjectRepository(Post)`를 사용하여 `Post` 리포지토리를 주입받습니다.
    2. `findAll()`, `findOne(id)`, `create(postData)`, `update(id, postData)`, `remove(id)` 메소드를 구현합니다.
    3. `update` 메소드 구현 시, `preload` 메소드를 사용하면 기존 엔티티를 불러와 새로운 데이터로 병합할 수 있어 편리합니다. (`this.postsRepository.preload({ id, ...postData })`)

<details>
<summary>문제 2 정답 예시</summary>

```typescript
// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto'; // DTO는 별도 생성

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: number): Promise<Post> {
    const post = this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(newPost);
  }

  async update(id: number, updatePostDto: any): Promise<Post> {
    const post = await this.postsRepository.preload({
      id: id,
      ...updatePostDto,
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }
}
```
</details>
