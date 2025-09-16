# 8장: 인증 - 사용자를 확인하고 보호하기

보안은 모든 애플리케이션의 핵심입니다. 이번 장에서는 사용자가 누구인지 확인하는 **인증(Authentication)** 시스템을 구축하는 방법을 배웁니다. NestJS는 Passport.js 라이브러리와의 통합을 통해 유연하고 확장 가능한 인증 전략을 쉽게 구현할 수 있도록 지원합니다. 여기서는 가장 널리 사용되는 JWT(JSON Web Token) 기반 인증을 다룹니다.

---

## 1. 핵심 개념

- **인증(Authentication)**: "당신은 누구인가?"를 확인하는 과정입니다. (예: 아이디/비밀번호로 로그인)
- **인가(Authorization)**: "당신이 이 작업을 수행할 권한이 있는가?"를 확인하는 과정입니다. (예: 관리자만 접근 가능한 페이지)

- **Passport.js**: Node.js를 위한 인증 미들웨어 라이브러리입니다. 다양한 인증 방식(전략, Strategy)을 지원하며, NestJS는 `@nestjs/passport` 모듈을 통해 이를 쉽게 통합할 수 있습니다.

- **JWT (JSON Web Token)**:
    - 인증에 필요한 정보들을 암호화된 JSON 형태로 담고 있는 웹 토큰입니다.
    - **구조**: `Header.Payload.Signature` 세 부분으로 구성됩니다.
        - `Header`: 토큰 타입, 암호화 알고리즘 정보
        - `Payload`: 유저 ID, 권한 등 전달할 데이터 (민감 정보는 담지 않음)
        - `Signature`: 토큰의 위변조 여부를 검증하기 위한 서명. 서버만 알고 있는 비밀 키(Secret Key)로 생성됩니다.
    - **동작 방식**:
        1.  **로그인**: 사용자가 아이디/비밀번호로 로그인을 요청합니다.
        2.  **토큰 발급**: 서버는 사용자 정보를 확인하고, 유효하다면 JWT(Access Token)를 생성하여 사용자에게 발급합니다.
        3.  **요청 시 토큰 첨부**: 클라이언트는 이후 서버에 요청을 보낼 때마다 HTTP 헤더(일반적으로 `Authorization: Bearer <token>`)에 이 토큰을 첨부하여 보냅니다.
        4.  **토큰 검증**: 서버는 요청을 받을 때마다 헤더의 토큰을 검증(서명 확인, 만료 시간 확인 등)하여 사용자가 유효한지 확인하고 요청을 처리합니다.

## 2. JWT 인증 구현 단계

1.  **필요한 라이브러리 설치**:
    ```bash
    npm install @nestjs/passport passport @nestjs/jwt passport-jwt
    npm install -D @types/passport-jwt # 타입 정의 파일
    ```

2.  **`AuthModule` 생성 및 설정**:
    ```bash
    nest g mo auth
    nest g s auth
    ```
    ```typescript
    // src/auth/auth.module.ts
    import { Module } from '@nestjs/common';
    import { AuthService } from './auth.service';
    import { UsersModule } from '../users/users.module'; // 사용자 정보를 찾기 위해 UsersModule 임포트
    import { PassportModule } from '@nestjs/passport';
    import { JwtModule } from '@nestjs/jwt';
    import { JwtStrategy } from './jwt.strategy';

    @Module({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: 'YOUR_SECRET_KEY', // .env 파일로 관리해야 함
          signOptions: { expiresIn: '60m' }, // 토큰 만료 시간
        }),
      ],
      providers: [AuthService, JwtStrategy], // JwtStrategy를 프로바이더로 등록
      exports: [AuthService],
    })
    export class AuthModule {}
    ```

3.  **`AuthService`에 로그인 및 토큰 생성 로직 구현**:
    ```typescript
    // src/auth/auth.service.ts
    import { Injectable, UnauthorizedException } from '@nestjs/common';
    import { UsersService } from '../users/users.service';
    import { JwtService } from '@nestjs/jwt';
    import * as bcrypt from 'bcrypt'; // 비밀번호 해싱을 위해 (npm install bcrypt @types/bcrypt)

    @Injectable()
    export class AuthService {
      constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
      ) {}

      async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user && await bcrypt.compare(pass, user.password)) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

      async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    }
    ```
    - **참고**: 위 예시는 `UsersService`에 `findOneByUsername`과 같은 메소드가 있고, `User` 엔티티에 `password` 필드가 있다고 가정합니다. 실제 구현 시에는 비밀번호를 해싱하여 저장하고 비교해야 합니다.

4.  **JWT 전략(`JwtStrategy`) 구현**: 요청 헤더의 JWT를 검증하는 로직입니다.
    ```typescript
    // src/auth/jwt.strategy.ts
    import { Injectable } from '@nestjs/common';
    import { PassportStrategy } from '@nestjs/passport';
    import { ExtractJwt, Strategy } from 'passport-jwt';

    @Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy) {
      constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더에서 Bearer 토큰 추출
          ignoreExpiration: false,
          secretOrKey: 'YOUR_SECRET_KEY', // AuthModule의 secret과 동일해야 함
        });
      }

      // 토큰 검증 성공 후 호출됨
      async validate(payload: any) {
        // payload에는 login 시 넣었던 정보가 담겨 있음
        // 이 리턴값은 req.user에 저장됨
        return { userId: payload.sub, username: payload.username };
      }
    }
    ```

5.  **컨트롤러에 로그인 엔드포인트 및 인증 가드 적용**:
    ```typescript
    // src/app.controller.ts (또는 auth.controller.ts)
    import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
    import { AuthGuard } from '@nestjs/passport';
    import { AuthService } from './auth/auth.service';

    @Controller()
    export class AppController {
      constructor(private authService: AuthService) {}

      // 로컬 인증 전략(아이디/비번)을 사용한 로그인
      @UseGuards(AuthGuard('local')) // 'local' 전략은 별도 구현 필요
      @Post('auth/login')
      async login(@Request() req) {
        return this.authService.login(req.user);
      }

      // JWT 인증 가드를 사용하여 보호된 라우트
      @UseGuards(AuthGuard('jwt'))
      @Get('profile')
      getProfile(@Request() req) {
        return req.user; // validate() 메소드가 리턴한 값이 담겨 있음
      }
    }
    ```
    - **참고**: 위 예제의 `@UseGuards(AuthGuard('local'))`은 아이디/비밀번호를 검증하는 `LocalStrategy`를 별도로 구현해야 완전하게 동작합니다. `AuthService`의 `validateUser`가 그 역할을 합니다.

---

## 3. 연습 문제

### 문제 1: `JwtAuthGuard` 만들기
- **요구사항**: `AuthGuard('jwt')`를 사용할 때마다 문자열을 쓰는 대신, 이 가드를 상속받는 커스텀 `JwtAuthGuard`를 만들어보세요.
- **세부사항**:
    1. `src/auth/guards/jwt-auth.guard.ts` 파일을 만듭니다.
    2. `export class JwtAuthGuard extends AuthGuard('jwt') {}` 와 같이 `AuthGuard`를 상속받는 빈 클래스를 만듭니다.
    3. 이제 컨트롤러에서 `@UseGuards(AuthGuard('jwt'))` 대신 `@UseGuards(JwtAuthGuard)`를 사용할 수 있습니다. 코드가 더 명확하고 재사용성이 높아집니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

```typescript
// 컨트롤러에서 사용
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```
</details>

### 문제 2: 현재 사용자 정보 가져오는 커스텀 데코레이터 만들기
- **요구사항**: 컨트롤러 핸들러에서 `req.user`에 접근하기 위해 `@Request() req` 전체를 주입받는 것은 비효율적입니다. `@User()` 라는 커스텀 데코레이터를 만들어 현재 사용자 정보(`req.user`)만 바로 가져올 수 있게 해보세요.
- **세부사항**:
    1. `src/common/decorators/user.decorator.ts` 파일을 만듭니다.
    2. `createParamDecorator` 함수를 사용하여 데코레이터를 정의합니다.
    3. 데코레이터의 콜백 함수는 `ExecutionContext`를 인자로 받아, `context.switchToHttp().getRequest().user`를 반환하도록 구현합니다.
    4. 이제 컨트롤러에서 `@Get('profile') getProfile(@User() user: any)` 와 같이 사용할 수 있습니다.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
// src/common/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

```typescript
// 컨트롤러에서 사용
import { User } from '../common/decorators/user.decorator.ts';

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@User() user: any) {
  // 더 이상 @Request() req가 필요 없음
  console.log(user);
  return user;
}
```
</details>
