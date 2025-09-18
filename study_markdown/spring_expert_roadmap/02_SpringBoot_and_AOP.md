# 2주차: 스프링 부트와 AOP 입문

**목표:** 스프링 부트(Spring Boot)가 어떻게 복잡한 스프링 설정을 자동화하고 개발 생산성을 높여주는지 이해합니다. 또한, 애플리케이션의 공통 관심사를 효과적으로 분리할 수 있는 AOP(관점 지향 프로그래밍)의 기본 개념을 학습하고 실제 코드에 적용해 봅니다.

---

## 1. 스프링 개발의 혁신: 스프링 부트 (Spring Boot)

### 1.1 스프링 부트 이전의 문제점 (XML 지옥)

1주차에서 우리는 스프링의 핵심인 IoC/DI를 배웠습니다. 하지만 전통적인 스프링 프레임워크는 다음과 같은 불편함이 있었습니다.

-   **복잡한 설정:** `DispatcherServlet`, `ViewResolver`, `DataSource` 등 웹 애플리케이션을 하나 실행하기 위해 수많은 빈(Bean)을 XML 파일이나 Java 클래스에 직접 등록해야 했습니다.
-   **의존성 관리의 어려움:** 스프링 MVC를 쓰려면 어떤 라이브러리가 필요한지, 또 그 라이브러리들과 호환되는 버전은 무엇인지 개발자가 일일이 확인하고 `pom.xml`이나 `build.gradle`에 추가해야 했습니다.
-   **배포의 어려움:** 개발이 완료된 애플리케이션을 실행하려면 Tomcat 같은 별도의 웹 애플리케이션 서버(WAS)를 설치하고, WAR 파일 형태로 패키징하여 배포해야 했습니다.

이러한 문제점들 때문에 "설정만 하다가 하루가 다 간다"는 말이 나올 정도였습니다.

### 1.2 스프링 부트의 3가지 핵심 기능

스프링 부트는 이러한 문제들을 해결하고 개발자가 **오직 비즈니스 로직에만 집중할 수 있도록** 돕기 위해 탄생했습니다.

**1. 스타터 (Starters): 의존성 관리의 자동화**

"스프링 웹 애플리케이션을 만들고 싶어" 라고 생각하면, 그냥 `spring-boot-starter-web` 의존성 하나만 추가하면 됩니다.

```xml
<!-- pom.xml (Maven) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

그러면 스프링 부트가 웹 개발에 필요한 `spring-webmvc`, `spring-web`, 내장 Tomcat 서버, JSON 처리 라이브러리(`jackson-databind`) 등 수십 개의 관련 라이브러리들을 **가장 안정적이고 호환되는 버전으로** 알아서 모두 가져옵니다. 개발자는 더 이상 버전 충돌을 걱정할 필요가 없습니다.

-   `spring-boot-starter-data-jpa`: JPA와 하이버네이트 관련 라이브러리 포함
-   `spring-boot-starter-test`: JUnit, Mockito 등 테스트 관련 라이브러리 포함
-   `spring-boot-starter-security`: 스프링 시큐리티 관련 라이브러리 포함

**2. 자동 설정 (Auto-configuration): 설정의 자동화**

개발자가 `spring-boot-starter-web`을 추가했다면, 스프링 부트는 "아, 이 개발자는 웹 애플리케이션을 만들려나 보다"라고 추측합니다. 그리고 웹 개발에 필요한 `DispatcherServlet`, `ViewResolver` 등의 빈들을 **자동으로 스프링 컨테이너에 등록**해줍니다.

만약 `spring-boot-starter-data-jpa`를 추가하고 `application.properties`에 데이터베이스 연결 정보(URL, username, password)를 입력했다면, 스프링 부트는 `DataSource`와 `EntityManagerFactory` 같은 복잡한 JPA 관련 빈들을 자동으로 설정해줍니다.

이 모든 것은 **"Convention over Configuration (설정보다 관례)"** 철학에 기반합니다. 즉, "특별한 설정을 하지 않으면, 가장 보편적이고 일반적인 방식으로 알아서 설정해주겠다"는 의미입니다.

**3. 내장 WAS (Embedded WAS): 배포의 간소화**

스프링 부트는 Tomcat, Jetty, Undertow 같은 웹 애플리케이션 서버를 내장하고 있습니다. 따라서 별도의 WAS를 설치할 필요 없이, 애플리케이션을 JAR 파일로 패키징하여 Java만 설치되어 있으면 어디서든 `java -jar my-app.jar` 명령어로 간단하게 실행하고 배포할 수 있습니다.

### 1.3 `application.properties` 와 `application.yml`

스프링 부트의 자동 설정을 세밀하게 제어하고 싶을 때 이 파일들을 사용합니다.

-   **`application.properties`**: `key=value` 형식으로 설정합니다.

    ```properties
    # 서버 포트 변경
    server.port=8080

    # 데이터베이스 연결 정보
    spring.datasource.url=jdbc:mysql://localhost:3306/mydb
    spring.datasource.username=user
    spring.datasource.password=secret
    ```

-   **`application.yml`**: `key: value` 형식의 계층 구조로 설정합니다. 가독성이 뛰어나 최근 더 선호되는 방식입니다.

    ```yaml
    # 서버 포트 변경
    server:
      port: 8080

    # 데이터베이스 연결 정보
    spring:
      datasource:
        url: jdbc:mysql://localhost:3306/mydb
        username: user
        password: secret
    ```

## 2. 관점 지향 프로그래밍 (AOP)

### 2.1 AOP란 무엇인가?

AOP(Aspect-Oriented Programming)는 애플리케이션의 여러 부분에 공통적으로 나타나는 기능, 즉 **공통 관심사(Cross-cutting Concerns)** 를 핵심 비즈니스 로직에서 분리하여 모듈화하는 프로그래밍 패러다임입니다.

-   **핵심 비즈니스 로직:** 주문 처리, 상품 등록, 회원 가입 등 해당 모듈의 고유한 기능
-   **공통 관심사:** 로깅, 보안, 트랜잭션 관리, 성능 측정 등 여러 비즈니스 로직에 걸쳐 공통으로 필요한 부가 기능

예를 들어, 모든 서비스 메소드의 실행 시간을 측정하고 싶다고 가정해봅시다. AOP가 없다면 모든 메소드 시작과 끝에 시간을 측정하는 코드를 일일이 추가해야 합니다.

```java
public class OrderService {
    public void createOrder() {
        long startTime = System.currentTimeMillis(); // 시작 시간
        // ... 핵심 비즈니스 로직 ...
        long endTime = System.currentTimeMillis(); // 종료 시간
        System.out.println("실행 시간: " + (endTime - startTime));
    }
}

public class MemberService {
    public void join() {
        long startTime = System.currentTimeMillis(); // 시작 시간
        // ... 핵심 비즈니스 로직 ...
        long endTime = System.currentTimeMillis(); // 종료 시간
        System.out.println("실행 시간: " + (endTime - startTime));
    }
}
```

이 방식은 중복 코드가 많아지고, 비즈니스 로직이 부가 기능 코드로 인해 오염됩니다. AOP는 바로 이 **시간 측정 로직**을 별도의 파일로 분리하여, 원하는 메소드들이 실행될 때 **알아서 끼어들도록** 만들 수 있습니다.

### 2.2 AOP 주요 용어

-   **Aspect:** 공통 관심사를 모듈화한 것. (e.g., `LoggingAspect`)
-   **Target:** Aspect를 적용할 대상. (e.g., `OrderService`, `MemberService`)
-   **Advice:** Aspect가 Target에 적용되어야 할 시점과 무엇을 할지를 정의한 것. (e.g., 메소드 실행 전, 후, 예외 발생 시)
    -   `@Before`: 메소드 실행 전
    -   `@After`: 메소드 실행 후 (성공/실패 무관)
    -   `@AfterReturning`: 메소드가 성공적으로 실행된 후
    -   `@AfterThrowing`: 메소드 실행 중 예외가 발생한 후
    -   `@Around`: 메소드 실행 전후를 모두 감싸서 처리 (가장 강력함)
-   **Join Point:** Advice가 적용될 수 있는 모든 지점. (e.g., 메소드 실행, 필드 값 변경 등). 스프링 AOP에서는 **메소드 실행** 시점만 지원합니다.
-   **Pointcut:** 수많은 Join Point 중에서, 실제로 Advice를 적용할 곳을 선별하는 표현식. (e.g., `com.example.service` 패키지 아래의 모든 메소드)

### 2.3 스프링 부트에서 AOP 사용하기

1.  **의존성 추가**

    ```xml
    <!-- pom.xml -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-aop</artifactId>
    </dependency>
    ```

2.  **Aspect 클래스 작성**

    `@Aspect` 어노테이션을 붙여 이 클래스가 Aspect임을 알리고, `@Component`로 빈으로 등록합니다.

    ```java
    @Aspect
    @Component
    public class LoggingAspect {

        // Pointcut: com.example.demo.service 패키지 하위의 모든 클래스, 모든 메소드에 적용
        @Pointcut("execution(* com.example.demo.service..*.*(..))")
        private void allServiceMethods() {}

        // Advice: allServiceMethods() Pointcut에 해당하는 메소드가 실행되기 전에 이 코드를 실행
        @Before("allServiceMethods()")
        public void logBefore(JoinPoint joinPoint) {
            String methodName = joinPoint.getSignature().getName();
            System.out.println("메소드 실행 시작: " + methodName);
        }

        // Advice: 메소드가 성공적으로 실행된 후에 이 코드를 실행
        @AfterReturning("allServiceMethods()")
        public void logAfterReturning(JoinPoint joinPoint) {
            String methodName = joinPoint.getSignature().getName();
            System.out.println("메소드 정상 실행 완료: " + methodName);
        }
    }
    ```

이제 `com.example.demo.service` 패키지 아래의 어떤 서비스 메소드를 호출하더라도, 실행 전후에 자동으로 로그가 출력됩니다. 핵심 로직 코드는 전혀 건드리지 않았는데도 말이죠!

---

## ✏️ 2주차 실습 과제

1.  **스프링 부트 프로젝트 생성 및 API 작성**
    -   [start.spring.io](https://start.spring.io/)에 접속하여 다음 의존성을 포함하는 프로젝트를 생성하세요.
        -   `Spring Web`
        -   `Spring Boot Actuator` (애플리케이션 상태 모니터링용)
        -   `Lombok` (선택 사항, 보일러플레이트 코드 축소용)
    -   `HelloController`를 만들고, `/hello` 경로로 GET 요청이 오면 "Hello, Spring Boot!" 문자열을 반환하는 API를 작성하세요.
    -   `application.yml` 파일을 사용하여 서버 포트를 `9000`번으로 변경하고 애플리케이션을 실행하여 확인해보세요.

2.  **AOP로 API 실행 시간 측정하기**
    -   `spring-boot-starter-aop` 의존성을 추가하세요.
    -   `PerformanceAspect`라는 이름의 Aspect 클래스를 만드세요.
    -   `@Around` Advice를 사용하여 `com.example.demo.controller` 패키지에 있는 모든 public 메소드의 실행 시간을 측정하고, "[메소드명] 실행 시간: [XX]ms" 형태로 로그를 출력하는 AOP를 구현하세요.
    -   앞서 만든 `/hello` API를 호출하여 콘솔에 실행 시간이 정상적으로 출력되는지 확인하세요.

---

## 🤔 심화 학습

-   스프링 부트의 자동 설정은 어떤 원리로 동작할까요? `@ConditionalOn...` 어노테이션에 대해 알아보세요.
-   AOP의 프록시(Proxy) 방식에 대해 알아보세요. (JDK Dynamic Proxy, CGLIB)
-   `@Around` Advice가 `@Before`, `@After`와 다른 점은 무엇이며, `ProceedingJoinPoint`의 역할은 무엇일까요?

---

## 📝 2주차 요약

-   **스프링 부트:** 복잡한 스프링 설정을 자동화하고, 의존성 관리를 간소화하며, 내장 WAS를 통해 쉽게 배포할 수 있게 해주는 프레임워크이다.
-   **Starters, Auto-configuration, Embedded WAS**는 스프링 부트의 3대 핵심 기능이다.
-   **AOP (관점 지향 프로그래밍):** 로깅, 보안, 트랜잭션과 같은 **공통 관심사**를 **핵심 비즈니스 로직**으로부터 분리하여 코드의 중복을 줄이고 유지보수성을 높인다.
-   스프링 AOP는 **프록시 방식**으로 동작하며, `@Aspect`, `@Pointcut`, `@Advice` 등의 어노테이션을 사용하여 구현한다.
