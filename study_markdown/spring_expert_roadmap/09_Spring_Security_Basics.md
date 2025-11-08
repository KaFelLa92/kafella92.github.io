# 9주차: Spring Security 기본

**목표:** 스프링 기반 애플리케이션의 보안 표준 프레임워크인 Spring Security의 기본 개념과 아키텍처를 이해합니다. 서블릿 필터 기반의 동작 원리를 배우고, Form Login과 같은 기본적인 인증(Authentication) 및 인가(Authorization) 설정을 직접 구현하여 내 애플리케이션을 보호하는 방법을 익힙니다.

---

## 1. 왜 Spring Security인가?

웹 애플리케이션에서 보안(인증, 인가, 각종 공격 방어)을 직접 구현하는 것은 매우 어렵고 위험한 일입니다. Spring Security는 스프링 생태계와 완벽하게 통합되어, 이러한 보안 관련 기능들을 안정적이고 체계적으로 구현할 수 있도록 도와주는 강력한 프레임워크입니다.

-   **인증 (Authentication):** 당신이 누구인지 증명하는 과정. (e.g., 아이디/비밀번호로 로그인)
-   **인가 (Authorization):** 당신이 특정 자원(URL, 데이터 등)에 접근할 권한이 있는지 확인하는 과정. (e.g., 관리자만 접근 가능한 페이지)

Spring Security는 이 두 가지 핵심 기능을 중심으로, CSRF(Cross-Site Request Forgery) 방어, 세션 관리, 비밀번호 암호화 등 포괄적인 보안 기능을 제공합니다.

## 2. Spring Security 아키텍처

Spring Security의 핵심은 **서블릿 필터 체인(Servlet Filter Chain)** 에 기반한 아키텍처입니다. 클라이언트의 요청이 `DispatcherServlet`에 도달하기 전에, 여러 보안 필터들을 먼저 거치면서 인증/인가 등의 보안 처리를 수행합니다.

`Client -> FilterChainProxy (DelegatingFilterProxy) -> SecurityFilterChain -> (인증/인가 필터들) -> DispatcherServlet -> Controller`

-   **`SecurityFilterChain`**: Spring Security가 관리하는 필터들의 체인입니다. `UsernamePasswordAuthenticationFilter`(로그인 처리), `AuthorizationFilter`(권한 확인) 등 수많은 필터들이 체인 형태로 연결되어 순서대로 동작합니다.
-   **`SecurityContextHolder`**: 현재 인증된 사용자의 정보(`Authentication` 객체)를 담고 있는 저장소입니다. `ThreadLocal`을 사용하여 같은 스레드 내에서는 어디서든 현재 사용자 정보에 접근할 수 있습니다.
-   **`Authentication`**: 인증된 사용자의 정보를 나타내는 객체. `Principal`(사용자 정보, 보통 `UserDetails` 객체), `Credentials`(자격 증명, 보통 비밀번호), `Authorities`(권한 목록)를 포함합니다.
-   **`UserDetails`**: 사용자의 상세 정보를 나타내는 인터페이스. 개발자는 `UserDetailsService`를 구현하여 데이터베이스 등에서 사용자 정보를 조회하고, `UserDetails` 객체를 만들어 Spring Security에 제공해야 합니다.

## 3. Spring Security 5.7+ 설정 방식 (Component-based)

과거에는 `WebSecurityConfigurerAdapter`를 상속받아 설정했지만, 최신 버전에서는 **`SecurityFilterChain`을 빈(Bean)으로 등록**하는 컴포넌트 기반 설정 방식을 사용합니다.

### 3.1 의존성 추가

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

이 의존성을 추가하는 것만으로도, 스프링 부트는 모든 요청에 대해 인증을 요구하는 기본 보안 설정을 자동으로 활성화합니다. (HTTP Basic 인증과 Form Login 페이지 제공)

### 3.2 `SecurityFilterChain` 빈 등록

보안 설정을 커스터마이징하려면 `@Configuration` 클래스에 `SecurityFilterChain` 타입의 빈을 등록합니다.

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. 인가(Authorization) 설정
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/", "/home", "/signup").permitAll() // 특정 경로는 모두 허용
                .requestMatchers("/admin/**").hasRole("ADMIN") // /admin/** 경로는 ADMIN 역할만 허용
                .anyRequest().authenticated() // 나머지 모든 요청은 인증된 사용자만 허용
            )
            // 2. 인증(Authentication) 방식 설정 - Form Login
            .formLogin(formLogin -> formLogin
                .loginPage("/login") // 커스텀 로그인 페이지 경로
                .defaultSuccessUrl("/dashboard") // 로그인 성공 시 이동할 기본 URL
                .permitAll() // 로그인 페이지는 모두 접근 가능해야 함
            )
            // 3. 로그아웃 설정
            .logout(logout -> logout
                .logoutUrl("/logout") // 로그아웃 처리 URL
                .logoutSuccessUrl("/") // 로그아웃 성공 시 이동할 URL
            );

        return http.build();
    }
}
```

> **람다 DSL 스타일:** 최신 Spring Security는 `http.authorizeRequests().antMatchers(...).permitAll().and().formLogin()...` 과 같은 체이닝 방식 대신, 위 예제처럼 람다 표현식을 사용하여 각 설정을 그룹화하는 DSL(Domain-Specific Language) 스타일을 권장합니다. 가독성이 훨씬 좋습니다.

### 3.3 비밀번호 암호화 (`PasswordEncoder`)

사용자의 비밀번호를 절대 평문(Plain Text)으로 저장해서는 안 됩니다. 반드시 암호화(해싱)하여 저장해야 합니다. Spring Security는 비밀번호 암호화를 위한 `PasswordEncoder` 인터페이스를 제공합니다.

-   **`BCryptPasswordEncoder`**: 현재 가장 널리 사용되는 안전한 해시 함수입니다. 같은 비밀번호라도 매번 다른 해시 결과를 만들고, 내부에 Salt 값을 포함하여 보안성이 뛰어납니다.

`PasswordEncoder`를 스프링 빈으로 등록하면, Spring Security가 로그인 처리 시 자동으로 사용하여 사용자가 입력한 비밀번호와 DB에 저장된 암호화된 비밀번호를 비교해줍니다.

```java
@Configuration
public class SecurityConfig {

    // PasswordEncoder를 빈으로 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ... SecurityFilterChain 빈 설정 ...
}
```

회원가입 로직에서는 이 `PasswordEncoder`를 주입받아 비밀번호를 암호화한 후 DB에 저장해야 합니다.

```java
@Service
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(String username, String rawPassword) {
        // 비밀번호를 암호화
        String encodedPassword = passwordEncoder.encode(rawPassword);
        Member member = new Member(username, encodedPassword);
        memberRepository.save(member);
    }
}
```

## 4. `UserDetailsService`와 `UserDetails`

Spring Security가 사용자를 인증하려면, 입력된 아이디에 해당하는 사용자 정보를 어딘가에서 가져와야 합니다. 이 역할을 하는 것이 `UserDetailsService` 인터페이스입니다.

-   **`UserDetailsService`**: `loadUserByUsername(String username)` 메소드 하나만 가지고 있습니다. 개발자는 이 인터페이스를 구현하여, 데이터베이스 등에서 사용자 정보를 조회하고 `UserDetails` 객체로 만들어 반환해야 합니다.
-   **`UserDetails`**: 인증된 사용자의 정보를 담는 인터페이스. `getUsername()`, `getPassword()`, `getAuthorities()` 등의 메소드를 가집니다.

### 4.1 구현 예제

```java
// 1. UserDetails 구현체 (보통 Member 엔티티가 직접 구현하거나, 별도 클래스로 만듦)
public class CustomUserDetails implements UserDetails {
    private final Member member;

    public CustomUserDetails(Member member) {
        this.member = member;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 사용자의 권한 목록을 반환 (e.g., "ROLE_USER", "ROLE_ADMIN")
        return List.of(new SimpleGrantedAuthority(member.getRole().name()));
    }

    @Override
    public String getPassword() {
        return member.getPassword();
    }

    @Override
    public String getUsername() {
        return member.getUsername();
    }
    // ... 나머지 메소드들 (계정 만료, 잠김 여부 등) ...
}

// 2. UserDetailsService 구현체
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    public CustomUserDetailsService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // DB에서 username으로 사용자 정보를 조회
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // 조회된 사용자 정보를 바탕으로 UserDetails 객체를 생성하여 반환
        return new CustomUserDetails(member);
    }
}
```

이렇게 `UserDetailsService` 빈이 등록되어 있으면, Spring Security는 로그인 요청이 올 때 자동으로 `loadUserByUsername`을 호출하여 DB의 사용자 정보와 사용자가 입력한 정보를 비교하여 인증을 수행합니다.

---

## ✏️ 9주차 실습 과제

기존의 **할 일(Todo) 애플리케이션**에 Spring Security를 적용하여 로그인 기능을 구현합니다.

1.  **의존성 추가 및 엔티티 수정**
    -   `spring-boot-starter-security` 의존성을 추가합니다.
    -   `Member` 엔티티를 생성합니다. (필드: `id`, `username`, `password`, `role`)
    -   `Todo` 엔티티에 `Member`와의 연관 관계(`@ManyToOne`)를 추가하여, 어떤 회원이 작성한 할 일인지 알 수 있도록 수정합니다.

2.  **`SecurityConfig` 작성**
    -   `@Configuration` 클래스를 만들고, `PasswordEncoder` 빈(`BCryptPasswordEncoder`)을 등록합니다.
    -   `SecurityFilterChain` 빈을 등록하여 다음 규칙을 설정합니다.
        -   회원가입 URL(`/signup`), 로그인 URL(`/login`), 루트 URL(`/`)는 모두 접근 허용
        -   CSS, JS 등 정적 리소스(`/css/**`, `/js/**`) 경로도 모두 접근 허용
        -   나머지 모든 경로는 인증된 사용자만 접근 가능
        -   Form Login과 Logout 기능을 활성화합니다.

3.  **`UserDetailsService` 구현**
    -   `MemberRepository`를 사용하여 DB에서 사용자 정보를 조회하는 `CustomUserDetailsService`를 구현합니다.
    -   `Member` 엔티티 정보를 바탕으로 `UserDetails` 객체를 만들어 반환하도록 구현합니다. (스프링 시큐리티가 제공하는 `org.springframework.security.core.userdetails.User` 클래스를 사용해도 편리합니다.)

4.  **회원가입 기능 구현**
    -   `MemberController`와 `MemberService`를 만듭니다.
    -   회원가입 요청을 받아, `PasswordEncoder`로 비밀번호를 암호화한 후 `MemberRepository`를 통해 DB에 저장하는 로직을 구현합니다.

5.  **기능 확인**
    -   애플리케이션을 실행하고, 인증 없이 할 일 목록 페이지(`/api/todos`)에 접근하면 로그인 페이지로 리다이렉트되는지 확인합니다.
    -   회원가입 기능을 통해 새로운 회원을 등록합니다.
    -   등록한 아이디와 비밀번호로 로그인하여 할 일 목록에 정상적으로 접근되는지 확인합니다.

---

## 🤔 심화 학습

-   `AuthenticationManager`, `AuthenticationProvider`는 인증 과정에서 각각 어떤 역할을 할까요?
-   CSRF(Cross-Site Request Forgery) 공격은 무엇이며, Spring Security는 이를 어떻게 방어할까요? (`.csrf()` 설정)
-   `Principal` 객체와 `@AuthenticationPrincipal` 어노테이션을 사용하면 컨트롤러에서 현재 로그인한 사용자 정보를 어떻게 쉽게 가져올 수 있을까요?

---

## 📝 9주차 요약

-   **Spring Security**는 서블릿 필터 체인을 기반으로 동작하며, 인증(Authentication)과 인가(Authorization)를 중심으로 강력한 보안 기능을 제공한다.
-   최신 버전에서는 **`SecurityFilterChain`을 빈으로 등록**하여 보안 설정을 커스터마이징한다.
-   비밀번호는 반드시 **`PasswordEncoder`(`BCryptPasswordEncoder`)를 사용하여 암호화**해야 한다.
-   **`UserDetailsService`** 를 구현하여 데이터베이스 등에서 사용자 정보를 가져오는 로직을 작성해야 한다.
-   `authorizeHttpRequests`로 URL별 접근 권한을 설정하고, `formLogin`으로 로그인 방식을 지정할 수 있다.
