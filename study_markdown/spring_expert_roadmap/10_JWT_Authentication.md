# 10주차: JWT를 이용한 API 인증

**목표:** 전통적인 세션-쿠키 방식의 한계를 이해하고, 현대적인 API 서버 환경에 적합한 JWT(JSON Web Token) 기반의 인증 방식을 학습합니다. JWT의 구조와 동작 원리를 배우고, Spring Security 필터 체인에 JWT 인증 필터를 직접 구현하여 통합하는 방법을 익힙니다.

---

## 1. 세션-쿠키 방식의 한계

9주차에서 배운 Form Login은 Spring Security가 **세션(Session)** 을 사용하여 인증 상태를 유지하는 방식입니다.

1.  사용자가 로그인에 성공하면, 서버는 세션 저장소(보통 서버 메모리)에 사용자 정보를 저장하고, 세션 ID를 생성합니다.
2.  서버는 이 세션 ID를 쿠키(`JSESSIONID`)에 담아 클라이언트에게 응답으로 보냅니다.
3.  클라이언트는 이후 모든 요청에 해당 쿠키를 포함하여 보냅니다.
4.  서버는 쿠키의 세션 ID를 보고, 세션 저장소에서 사용자 정보를 찾아 인증 상태를 확인합니다.

이 방식은 전통적인 웹 애플리케이션에서는 잘 동작하지만, 현대적인 아키텍처에서는 다음과 같은 한계가 있습니다.

-   **상태 유지 (Stateful):** 서버가 각 사용자의 세션 정보를 저장하고 있어야 합니다. 사용자가 많아질수록 서버의 메모리 부담이 커집니다.
-   **확장성 문제:** 여러 대의 서버로 로드 밸런싱(분산)하는 경우, 각 서버가 세션 정보를 공유해야 하는 문제가 발생합니다. (이를 위해 세션 클러스터링이나 Redis 같은 별도의 세션 저장소가 필요해짐)
-   **CORS 문제:** 도메인이 다른 클라이언트(e.g., `front.com`에서 `api.com` 호출)에서 쿠키를 주고받으려면 복잡한 CORS(Cross-Origin Resource Sharing) 처리가 필요합니다.
-   **모바일 앱과의 호환성:** 모바일 앱에서는 쿠키를 관리하는 것이 웹 브라우저보다 번거롭습니다.

## 2. 대안: 토큰 기반 인증과 JWT

**토큰 기반 인증**은 이러한 문제를 해결하기 위해 등장했습니다. 서버는 더 이상 사용자의 상태를 저장하지 않고(**Stateless**), 인증 정보를 암호화된 토큰에 담아 클라이언트에게 전달합니다. 클라이언트는 이 토큰을 저장해두었다가, 요청 시마다 토큰을 헤더에 포함하여 보냅니다.

**JWT(JSON Web Token)** 는 토큰 기반 인증에서 가장 널리 사용되는 표준 규격입니다.

### 2.1 JWT의 구조

JWT는 `aaaaa.bbbbb.ccccc` 와 같이 점(.)으로 구분된 세 부분으로 구성됩니다.

1.  **헤더 (Header):** 토큰의 타입(JWT)과 서명에 사용할 해싱 알고리즘(e.g., HS256) 정보를 담습니다.
2.  **페이로드 (Payload):** 토큰에 담을 실제 정보(데이터 조각)인 **클레임(Claim)** 들을 포함합니다. 클레임은 등록된 클레임, 공개 클레임, 비공개 클레임으로 나뉩니다.
    -   `iss` (발급자), `sub` (주제, 보통 사용자 ID), `aud` (수신자), `exp` (만료 시간), `iat` (발급 시간) 등
    -   **주의:** 페이로드는 Base64로 인코딩될 뿐, 암호화된 것이 아닙니다. 따라서 비밀번호와 같은 민감한 정보는 절대 담아서는 안 됩니다.
3.  **서명 (Signature):** `헤더`와 `페이로드`를 합친 후, 서버만 알고 있는 **비밀 키(Secret Key)** 를 사용하여 해싱한 값입니다. 이 서명 덕분에 토큰의 위변조 여부를 검증할 수 있습니다.

### 2.2 JWT 인증 흐름

1.  사용자가 아이디/비밀번호로 로그인 요청을 보냅니다.
2.  서버는 아이디/비밀번호가 유효한지 확인하고, 유효하다면 JWT를 생성합니다. (사용자 ID, 역할, 만료 시간 등을 페이로드에 담고, 비밀 키로 서명)
3.  서버는 생성된 JWT를 클라이언트에게 응답으로 전달합니다.
4.  클라이언트는 JWT를 로컬 스토리지, 세션 스토리지 등에 저장합니다.
5.  이후 클라이언트는 보호된 자원에 접근할 때, HTTP 요청 헤더(`Authorization` 헤더)에 JWT를 담아 보냅니다. (e.g., `Authorization: Bearer <JWT>`)
6.  서버는 요청 헤더의 JWT를 받아 서명이 유효한지, 토큰이 만료되지 않았는지 검증합니다.
7.  검증에 성공하면, 페이로드의 정보를 바탕으로 사용자를 식별하고 요청을 처리합니다.

## 3. Spring Security에 JWT 통합하기

Spring Security의 기본 필터 체인에 우리가 직접 만든 **JWT 인증 필터**를 끼워 넣는 방식으로 구현합니다.

### 3.1 JWT 생성 및 검증 유틸리티

먼저 JWT를 생성하고, 검증하고, 페이로드에서 정보를 추출하는 유틸리티 클래스를 만듭니다. `jjwt` 라이브러리를 사용하면 편리합니다.

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

```java
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    private Key key;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // JWT 생성
    public String generateToken(Authentication authentication) {
        // ... 사용자 정보로 클레임 생성 ...
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(authentication.getName())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT 검증 및 정보 추출
    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        // ... 클레임에서 권한 정보 추출 ...
        UserDetails userDetails = userDetailsService.loadUserByUsername(claims.getSubject());
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // MalformedJwtException, ExpiredJwtException 등
            return false;
        }
    }
}
```

### 3.2 JWT 인증 필터 (`JwtAuthenticationFilter`)

클라이언트의 모든 요청에 대해, `Authorization` 헤더의 JWT를 검사하여 유효하면 `SecurityContextHolder`에 인증 정보를 등록해주는 커스텀 필터를 만듭니다. 이 필터는 `UsernamePasswordAuthenticationFilter`보다 **앞에** 위치해야 합니다.

```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request); // 1. 요청에서 토큰 추출

        if (token != null && jwtTokenProvider.validateToken(token)) { // 2. 토큰 유효성 검증
            Authentication authentication = jwtTokenProvider.getAuthentication(token); // 3. 토큰에서 인증 정보 가져오기
            SecurityContextHolder.getContext().setAuthentication(authentication); // 4. SecurityContext에 인증 정보 저장
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

### 3.3 `SecurityConfig` 수정

이제 `SecurityConfig`에서 Form Login, 세션 관리 등 기존 설정을 비활성화하고, 우리가 만든 `JwtAuthenticationFilter`를 등록해야 합니다.

```java
@Configuration
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    // ... 생성자 ...

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. CSRF, Form Login, HTTP Basic 비활성화
            .csrf(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)

            // 2. 세션 관리를 Stateless로 설정
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 3. 인가(Authorization) 설정
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/login", "/signup").permitAll()
                .anyRequest().authenticated()
            )
            // 4. JWT 필터 추가
            //    UsernamePasswordAuthenticationFilter 앞에 우리가 만든 필터를 추가한다.
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    // ... PasswordEncoder 빈 ...
}
```

### 3.4 로그인 API

마지막으로, 아이디/비밀번호를 받아 인증에 성공하면 JWT를 발급해주는 로그인 API를 직접 만들어야 합니다.

```java
@RestController
public class AuthController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;

    // ... 생성자 ...

    @PostMapping("/login")
    public ResponseEntity<TokenInfo> login(@RequestBody LoginRequest loginRequest) {
        // 1. 사용자가 입력한 username, password로 AuthenticationToken 생성
        UsernamePasswordAuthenticationToken authenticationToken = 
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());

        // 2. 실제 인증 수행 (UserDetailsService의 loadUserByUsername 호출)
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // 3. 인증 정보를 기반으로 JWT 생성
        String jwt = jwtTokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new TokenInfo("Bearer", jwt));
    }
}
```

---

## ✏️ 10주차 실습 과제

9주차에 구현한 Form Login 기반의 보안 설정을 JWT 기반으로 전환합니다.

1.  **`jjwt` 라이브러리 의존성 추가**

2.  **`JwtTokenProvider` 클래스 작성**
    -   `application.yml`에 `jwt.secret`과 `jwt.expiration-ms` 값을 설정합니다. (secret 값은 충분히 길고 복잡한 문자열 사용)
    -   JWT를 생성하고, 검증하고, `Authentication` 객체를 추출하는 메소드를 구현합니다.

3.  **`JwtAuthenticationFilter` 클래스 작성**
    -   `OncePerRequestFilter`를 상속받아, 요청 헤더에서 JWT를 추출하고 유효성을 검증하여 `SecurityContextHolder`에 인증 정보를 저장하는 로직을 구현합니다.

4.  **`SecurityConfig` 수정**
    -   기존의 `formLogin`, `logout` 설정을 제거합니다.
    -   `csrf`, `httpBasic`을 비활성화하고, 세션 관리 정책을 `STATELESS`로 변경합니다.
    -   `addFilterBefore`를 사용하여 `JwtAuthenticationFilter`를 필터 체인에 등록합니다.

5.  **로그인 API 컨트롤러 작성**
    -   `AuthController`를 만들고 `/login` 엔드포인트를 구현합니다.
    -   `AuthenticationManager`를 사용하여 사용자를 인증하고, 성공 시 `JwtTokenProvider`를 통해 JWT를 생성하여 클라이언트에게 반환하는 로직을 작성합니다.

6.  **Postman으로 테스트**
    -   `/login` API를 호출하여 JWT를 발급받습니다.
    -   보호된 API(e.g., 할 일 목록 조회)를 호출할 때, `Authorization` 헤더에 `Bearer <발급받은_JWT>` 형식으로 토큰을 포함하여 요청을 보내고, 정상적으로 응답이 오는지 확인합니다.
    -   토큰 없이 요청을 보내면 401 Unauthorized 또는 403 Forbidden 에러가 발생하는지 확인합니다.

---

## 🤔 심화 학습

-   Access Token과 Refresh Token은 각각 어떤 역할을 하며, 왜 두 가지 토큰을 함께 사용하는 것이 더 안전할까요?
-   `SecurityContextHolder`의 `strategy`에는 어떤 종류가 있으며, `MODE_THREADLOCAL`과 `MODE_INHERITABLETHREADLOCAL`은 어떻게 다른가요?
-   인증 과정에서 발생하는 예외(e.g., 토큰 만료, 잘못된 서명)를 처리하기 위한 `AuthenticationEntryPoint`와 `AccessDeniedHandler`는 어떻게 커스터마이징할 수 있을까요?

---

## 📝 10주차 요약

-   **JWT(JSON Web Token)** 는 인증 정보를 담고 있는, 서명된 토큰으로, **Stateless**한 서버 아키텍처에 적합하다.
-   JWT는 **헤더, 페이로드, 서명** 세 부분으로 구성되며, 서명을 통해 위변조 여부를 검증할 수 있다.
-   Spring Security에 JWT를 통합하려면, **세션 관리를 `STATELESS`로 설정**하고, 요청 헤더의 토큰을 검증하는 **커스텀 필터(`JwtAuthenticationFilter`)** 를 필터 체인에 추가해야 한다.
-   Form Login을 비활성화했으므로, 아이디/비밀번호를 받아 인증을 처리하고 **JWT를 발급해주는 로그인 API**를 직접 구현해야 한다.
-   클라이언트는 발급받은 JWT를 저장해두었다가, API 요청 시 **`Authorization: Bearer <JWT>`** 헤더에 담아 보내야 한다.
