# 12주차: 설정 분리 및 비동기 처리

**목표:** 실제 프로덕션 환경에서 애플리케이션을 안정적으로 운영하기 위한 고급 기술들을 학습합니다. 프로파일(Profile)을 사용하여 개발, 테스트, 운영 환경별로 설정을 분리하는 방법을 익히고, `@Async`를 활용하여 오래 걸리는 작업을 비동기적으로 처리함으로써 애플리케이션의 응답성을 향상시키는 방법을 배웁니다.

---

## 1. 프로파일을 이용한 설정 분리

지금까지 우리는 `application.yml` (또는 `.properties`) 파일 하나에 모든 설정을 담았습니다. 하지만 실제 애플리케이션은 여러 환경(개발, 테스트, 스테이징, 운영)에서 실행되며, 각 환경은 서로 다른 설정을 필요로 합니다.

-   **개발(local) 환경:** 내 PC의 로컬 데이터베이스에 연결, H2 같은 인메모리 DB 사용, 디버그 로그 활성화
-   **테스트(test) 환경:** 테스트용 데이터베이스에 연결, 테스트 시에만 사용하는 설정 활성화
-   **운영(prod) 환경:** 실제 서비스용 데이터베이스에 연결, 로그 레벨은 INFO, 성능 관련 설정 최적화

이러한 환경별 설정을 하나의 파일에서 관리하는 것은 매우 위험하고 비효율적입니다. 스프링 부트는 **프로파일(Profile)** 기능을 통해 이 문제를 간단하게 해결합니다.

### 1.1 프로파일별 설정 파일 작성

`application-{profile}.yml` 형식으로 프로파일별 설정 파일을 작성할 수 있습니다.

-   `application.yml`: 모든 프로파일에 공통으로 적용되는 기본 설정
-   `application-local.yml`: `local` 프로파일이 활성화될 때 적용될 설정
-   `application-prod.yml`: `prod` 프로파일이 활성화될 때 적용될 설정

**`application.yml` (공통 설정)**
```yaml
spring:
  application:
    name: todo-app

server:
  port: 8080
```

**`application-local.yml` (개발 환경 설정)**
```yaml
# local 프로파일
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: create

logging:
  level:
    org.hibernate.SQL: debug # SQL 로그를 debug 레벨로 출력
```

**`application-prod.yml` (운영 환경 설정)**
```yaml
# prod 프로파일
spring:
  datasource:
    url: jdbc:mysql://prod-db-server:3306/tododb
    username: prod_user
    password: ${DB_PASSWORD} # 비밀번호는 환경 변수에서 가져옴
  jpa:
    hibernate:
      ddl-auto: validate # 테이블 구조를 변경하지 않고 검증만 함

logging:
  level:
    root: info # 전체 로그 레벨을 info로 설정
```

> **우선순위:** 프로파일별 설정(`application-local.yml`)이 공통 설정(`application.yml`)보다 우선순위가 높습니다. 즉, 프로파일별 설정이 공통 설정을 덮어씁니다.

### 1.2 프로파일 활성화 방법

1.  **`application.yml`에서 지정 (기본 프로파일 설정)**

    ```yaml
    spring:
      profiles:
        active: local # 기본으로 local 프로파일을 활성화
    ```

2.  **JAR 실행 시 인자로 전달 (가장 일반적인 방법)**

    ```bash
    # local 프로파일로 실행
    java -jar my-app.jar --spring.profiles.active=local

    # prod 프로파일로 실행
    java -jar my-app.jar --spring.profiles.active=prod
    ```

3.  **IDE 실행 설정에서 지정**
    -   IntelliJ 등에서는 실행 구성(Run Configuration)의 `Active profiles` 항목에 원하는 프로파일 이름을 입력할 수 있습니다.

### 1.3 `@Profile` 어노테이션

특정 프로파일에서만 특정 빈(@Bean)이나 설정(@Configuration)을 활성화하고 싶을 때 `@Profile` 어노테이션을 사용합니다.

```java
@Configuration
public class AppConfig {

    @Bean
    @Profile("local") // local 프로파일에서만 이 빈을 등록
    public TestDataInitializer testDataInitializer(TodoRepository todoRepository) {
        // 로컬 환경에서만 애플리케이션 시작 시 테스트 데이터를 넣어주는 빈
        return new TestDataInitializer(todoRepository);
    }

    @Bean
    @Profile("!prod") // prod 프로파일이 아닐 때만 이 빈을 등록
    public SomeBean someBean() {
        return new SomeBean();
    }
}
```

## 2. 비동기 처리와 `@Async`

웹 애플리케이션은 사용자의 요청을 최대한 빨리 처리하고 응답을 반환해야 합니다. 그런데 일부 작업은 처리하는 데 시간이 오래 걸릴 수 있습니다. (e.g., 대용량 이메일 발송, 복잡한 보고서 생성, 외부 API 호출 등)

만약 이러한 작업을 동기(Synchronous) 방식으로 처리하면, 작업이 끝날 때까지 스레드가 대기(blocking) 상태에 빠져 다른 요청을 처리할 수 없게 되고, 결국 애플리케이션의 전체적인 응답성과 처리량이 저하됩니다.

**비동기(Asynchronous) 처리**는 이러한 오래 걸리는 작업을 별도의 스레드에서 실행하도록 위임하고, 현재 스레드는 즉시 다음 작업을 계속하거나 사용자에게 응답을 반환하는 방식입니다.

### 2.1 `@Async` 사용법

스프링은 `@Async` 어노테이션 하나로 메소드를 간단하게 비동기로 만들 수 있습니다.

1.  **비동기 기능 활성화**
    -   메인 애플리케이션 클래스나 설정 클래스에 `@EnableAsync` 어노테이션을 추가합니다.

    ```java
    @EnableAsync
    @SpringBootApplication
    public class DemoApplication {
        public static void main(String[] args) {
            SpringApplication.run(DemoApplication.class, args);
        }
    }
    ```

2.  **비동기로 실행할 메소드에 `@Async` 추가**
    -   `@Async`가 붙은 메소드는 별도의 스레드 풀에서 실행됩니다.
    -   **주의:** `@Async` 메소드는 `public` 이어야 하며, 같은 클래스 내에서의 호출(self-invocation)은 AOP가 적용되지 않아 비동기로 동작하지 않습니다. 별도의 클래스로 분리해야 합니다.

```java
@Service
public class NotificationService {

    @Async // 이 메소드는 별도의 스레드에서 비동기로 실행된다.
    public void sendEmail(String to, String subject, String content) {
        System.out.println(Thread.currentThread().getName() + ": 이메일 발송 시작 -> " + to);
        try {
            // 메일 발송에 5초가 걸린다고 가정
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + ": 이메일 발송 완료");
    }
}

@RestController
public class MemberController {
    private final NotificationService notificationService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp() {
        // ... 회원가입 로직 처리 ...

        // 이메일 발송은 비동기로 호출 -> 응답은 즉시 반환됨
        notificationService.sendEmail("user@example.com", "가입 환영", "...");

        System.out.println(Thread.currentThread().getName() + ": 회원가입 처리 완료 및 응답 반환");
        return ResponseEntity.ok("회원가입 성공! 환영 이메일이 발송되었습니다.");
    }
}
```

위 예제에서 `/signup` API를 호출하면, 콘솔에는 "회원가입 처리 완료" 로그가 먼저 찍히고, 약 5초 뒤에 별도의 스레드에서 "이메일 발송 완료" 로그가 찍히는 것을 확인할 수 있습니다. 사용자는 이메일 발송을 기다릴 필요 없이 즉시 응답을 받게 됩니다.

### 2.2 `@Async`와 반환 값

`@Async` 메소드는 `Future<T>` 또는 `CompletableFuture<T>` 타입을 반환하여, 비동기 작업의 결과를 나중에 받아 처리할 수 있습니다.

```java
@Async
public CompletableFuture<Report> generateReport(ReportRequest request) {
    // ... 10초 걸리는 리포트 생성 로직 ...
    Report report = ...;
    return CompletableFuture.completedFuture(report);
}
```

### 2.3 스레드 풀 커스터마이징

스프링 부트는 기본적으로 `SimpleAsyncTaskExecutor`를 사용하지만, 이는 매번 새로운 스레드를 생성하여 성능에 좋지 않습니다. 실제 운영 환경에서는 스레드 풀(`ThreadPoolTaskExecutor`)을 직접 설정하여 사용하는 것이 좋습니다.

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);   // 기본 스레드 수
        executor.setMaxPoolSize(10);  // 최대 스레드 수
        executor.setQueueCapacity(100); // 큐 용량
        executor.setThreadNamePrefix("Async-Thread-");
        executor.initialize();
        return executor;
    }
}
```

---

## ✏️ 12주차 실습 과제

1.  **설정 프로파일 분리**
    -   기존 `application.yml`의 내용을 공통 설정만 남기고 정리합니다.
    -   `application-local.yml` 파일을 생성하고, H2 데이터베이스를 사용하고 SQL 로그를 출력하도록 개발 환경 설정을 옮깁니다.
    -   `application-prod.yml` 파일을 생성하고, 실제 운영 DB(MySQL 등, 없다면 H2의 다른 파일 기반 DB로 가정)에 연결하고 `ddl-auto`를 `validate` 또는 `none`으로 설정하는 운영 환경 설정을 작성합니다.
    -   IntelliJ나 실행 인자를 통해 `local`과 `prod` 프로파일을 각각 활성화하여 애플리케이션을 실행하고, 의도한 대로 설정이 적용되는지 확인합니다.

2.  **비동기 이메일 발송 기능 구현**
    -   `@EnableAsync`를 메인 애플리케이션에 추가합니다.
    -   `NotificationService` 클래스를 만들고, 이메일을 발송하는(것처럼 보이는) `sendWelcomeEmail` 메소드를 작성합니다. 이 메소드에 `@Async`를 붙이고, `Thread.sleep()`을 사용하여 3초 정도의 딜레이를 줍니다. 현재 스레드 이름을 로그로 출력하여 비동기 실행을 확인합니다.
    -   회원가입 서비스 로직(`MemberService`)에서 회원가입이 성공한 후, `NotificationService`의 `sendWelcomeEmail` 메소드를 호출하도록 수정합니다.
    -   회원가입 API를 호출했을 때, 응답이 즉시 오는지, 그리고 3초 뒤에 별도의 스레드에서 이메일 발송 로그가 찍히는지 확인합니다.

---

## 🤔 심화 학습

-   스프링 부트의 외부 설정(Externalized Configuration) 우선순위는 어떻게 될까요? (e.g., `application.yml`, 환경 변수, JVM 시스템 속성)
-   `CompletableFuture`를 사용하여 여러 비동기 작업의 결과를 조합하거나, 예외를 처리하는 방법은 무엇일까요?
-   메시지 큐(Message Queue, e.g., RabbitMQ, Kafka)를 사용하는 것은 `@Async`와 비교하여 어떤 장단점이 있을까요? 더 안정적인 비동기 처리가 필요한 경우는 언제일까요?

---

## 📝 12주차 요약

-   **프로파일(Profile)** 기능을 사용하면 **개발, 테스트, 운영 등 환경별로 설정을 분리**하여 안전하고 효율적으로 애플리케이션을 관리할 수 있다.
-   `application-{profile}.yml` 형식으로 파일을 만들고, 실행 시 `spring.profiles.active` 옵션으로 원하는 프로파일을 활성화한다.
-   **`@Async`** 어노테이션을 사용하면 오래 걸리는 작업을 **별도의 스레드에서 비동기적으로 실행**하여, 메인 스레드의 대기 시간을 줄이고 애플리케이션의 전체적인 응답성을 향상시킬 수 있다.
-   `@Async`를 사용하려면 설정 클래스에 **`@EnableAsync`** 를 추가해야 하며, 비동기 메소드는 **public**이고 **다른 클래스에서 호출**되어야 한다.
-   운영 환경에서는 스레드를 재사용하는 **스레드 풀(`ThreadPoolTaskExecutor`)을 빈으로 직접 설정**하여 사용하는 것이 성능상 유리하다.
