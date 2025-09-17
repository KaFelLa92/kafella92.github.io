# 5장: Spring Security를 이용한 인증과 인가

대부분의 웹 서비스는 '로그인' 기능을 필요로 합니다. Spring Security는 인증(Authentication)과 인가(Authorization)에 대한 강력하고 포괄적인 기능을 제공하는 프레임워크입니다. 필터 체인 기반으로 동작하며, 폼 로그인, 소셜 로그인(OAuth2), JWT(JSON Web Token) 등 다양한 인증 방식을 지원합니다.

---

## 1. 핵심 개념

- **인증 (Authentication)**: 당신이 누구인지 증명하는 과정입니다. (예: 아이디와 비밀번호로 로그인)
- **인가 (Authorization)**: 당신이 특정 리소스에 접근할 권한이 있는지 확인하는 과정입니다. (예: 'ADMIN' 역할을 가진 사용자만 관리자 페이지에 접근 가능)
- **Principal**: 현재 인증된 사용자의 정보를 담고 있는 객체. 주로 `UserDetails` 인터페이스의 구현체를 사용합니다.
- **Filter Chain**: Spring Security는 여러 보안 필터들이 체인처럼 연결되어 순서대로 요청을 검사하고 처리하는 구조로 동작합니다.
- **PasswordEncoder**: 비밀번호를 안전하게 저장하기 위해 단방향 암호화를 수행하는 컴포넌트입니다.

---

## 2. 예제 코드 (가상)

가장 기본적인 폼 로그인 설정을 살펴봅시다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/admin/**").hasRole("ADMIN") // /admin/** 경로는 ADMIN 역할 필요
                .requestMatchers("/my-page").authenticated() // /my-page는 인증만 되면 접근 가능
                .requestMatchers("/", "/login", "/signup").permitAll() // /, /login, /signup은 누구나 접근 가능
                .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요
            )
            .formLogin(form -> form
                .loginPage("/login") // 커스텀 로그인 페이지 경로
                .defaultSuccessUrl("/") // 로그인 성공 시 이동할 경로
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout") // 로그아웃 처리 URL
                .logoutSuccessUrl("/") // 로그아웃 성공 시 이동할 경로
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 비밀번호를 안전하게 저장하기 위한 암호화 인코더
        return new BCryptPasswordEncoder();
    }
}
```

---

## 3. 직접 풀 문제

1. `dongjinWeb1`의 `MemberController`에 구현된 세션 기반 로그인 로직을 Spring Security의 폼 로그인 방식으로 전환해보세요. (`build.gradle`에 `spring-boot-starter-security` 의존성 추가가 필요합니다.)
2. 회원가입 시 `PasswordEncoder`를 사용하여 비밀번호를 암호화하여 DB에 저장하도록 `MemberService` 로직을 수정해보세요.
