# 1주차: 스프링의 핵심 - IoC/DI와 스프링 컨테이너

**목표:** 스프링 프레임워크의 가장 근본적인 설계 사상인 IoC(제어의 역전)와 DI(의존성 주입)를 완벽하게 이해합니다. 개발자가 직접 객체를 생성하고 연결하던 방식에서 벗어나, 왜 스프링에게 그 제어권을 넘겨야 하는지 체감하고, 스프링 컨테이너와 빈(Bean)의 개념을 익힙니다.

---

## 1. 프로그래밍의 패러다임 전환: 제어의 역전 (IoC)

### 1.1 기존 방식의 문제점

스프링이 없던 시절, 우리는 보통 다음과 같이 코드를 작성했습니다.

```java
// OrderService.java (주문 서비스)
public class OrderService {
    // 주문을 처리하려면 어떤 데이터베이스에 저장할지 알아야 합니다.
    // OrderService가 직접 `MySqlOrderRepository` 객체를 생성합니다.
    private MySqlOrderRepository orderRepository = new MySqlOrderRepository();

    public void createOrder(Order order) {
        // ... 비즈니스 로직 ...
        orderRepository.save(order);
    }
}

// MySqlOrderRepository.java (MySQL 저장소)
public class MySqlOrderRepository {
    public void save(Order order) {
        System.out.println("MySQL에 주문 정보를 저장합니다.");
        // ... JDBC 코드 ...
    }
}
```

이 코드의 **문제점**은 무엇일까요?

1.  **강한 결합 (Tight Coupling):** `OrderService`는 `MySqlOrderRepository`라는 구체적인 클래스를 직접 알고 있어야 합니다. 만약 데이터베이스를 Oracle로 변경해야 한다면? `OrderService` 코드 자체를 `new OracleOrderRepository()`로 수정해야 합니다. 이는 OCP(개방-폐쇄 원칙)를 위반합니다.
2.  **유연성 부족:** 기능 확장이나 변경이 있을 때마다 관련된 모든 코드의 수정이 불가피합니다.
3.  **테스트의 어려움:** `OrderService`를 테스트하려면 항상 실제 `MySqlOrderRepository` 객체가 필요합니다. 즉, 실제 데이터베이스가 동작해야만 테스트가 가능해집니다. 단위 테스트가 매우 어렵습니다.

### 1.2 해결책: 제어의 역전 (Inversion of Control)

**"Don't call us, we'll call you." (헐리우드 원칙)**

IoC는 이 문제점을 해결하기 위해 등장한 개념입니다. 객체의 생성, 구성, 생명주기 관리 등 모든 '제어'의 권한을 개발자가 아닌, 외부의 특정 주체에게 넘기는 것을 말합니다. 스프링에서는 그 주체가 바로 **스프링 컨테이너(Spring Container)** 입니다.

개발자는 더 이상 `new` 키워드를 사용하여 객체를 직접 생성하지 않습니다. 단지 어떤 객체들이 필요하고, 어떻게 설정되어야 하는지를 스프링에게 알려주기만 하면 됩니다. 그러면 스프링 컨테이너가 알아서 객체를 만들고, 필요한 곳에 연결(주입)해줍니다.

## 2. IoC 구현 방법: 의존성 주입 (DI)

의존성 주입은 제어의 역전(IoC)을 실제로 구현하는 방법론 중 하나입니다. 어떤 객체(`OrderService`)가 필요로 하는 다른 객체(`OrderRepository`)를 '의존성'이라고 부릅니다. 이 의존성을 외부(스프링 컨테이너)에서 주입해주는 것을 **의존성 주입(Dependency Injection)** 이라고 합니다.

### 2.1 인터페이스를 활용한 리팩토링

먼저 강한 결합을 끊어내기 위해 인터페이스를 도입합니다.

```java
// OrderRepository.java (인터페이스)
public interface OrderRepository {
    void save(Order order);
}

// MySqlOrderRepository.java (구현체 1)
public class MySqlOrderRepository implements OrderRepository {
    @Override
    public void save(Order order) {
        System.out.println("MySQL에 주문 정보를 저장합니다.");
    }
}

// OracleOrderRepository.java (구현체 2)
public class OracleOrderRepository implements OrderRepository {
    @Override
    public void save(Order order) {
        System.out.println("Oracle에 주문 정보를 저장합니다.");
    }
}
```

이제 `OrderService`는 구체적인 클래스가 아닌, `OrderRepository` 인터페이스에만 의존하게 됩니다.

```java
// OrderService.java
public class OrderService {
    private final OrderRepository orderRepository;

    // ✨ 핵심: 생성자를 통해 외부에서 의존성을 주입받습니다.
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public void createOrder(Order order) {
        // ... 비즈니스 로직 ...
        orderRepository.save(order);
    }
}
```

`OrderService`는 이제 `orderRepository`가 `MySqlOrderRepository`인지 `OracleOrderRepository`인지 전혀 알지 못합니다. 그저 `save()` 메소드를 가진 `OrderRepository` 구현체일 뿐입니다.

### 2.2 누가, 어떻게 주입하는가? - AppConfig의 등장

그렇다면 `OrderService`에게 `MySqlOrderRepository`를 주입해주는 역할은 누가 할까요? 스프링이 없을 때는 다음과 같이 별도의 설정(Configuration) 클래스를 만들어 처리했습니다.

```java
// AppConfig.java (애플리케이션 전체의 설정을 담당)
public class AppConfig {

    public OrderRepository orderRepository() {
        // 현재 우리 앱은 MySQL을 사용하기로 결정!
        return new MySqlOrderRepository();
    }

    public OrderService orderService() {
        // OrderService를 생성할 때, 위에서 만든 orderRepository()를 주입해준다.
        return new OrderService(orderRepository());
    }
}
```

이제 `main` 메소드에서는 `AppConfig`를 통해 필요한 객체를 얻어 사용합니다.

```java
public static void main(String[] args) {
    AppConfig appConfig = new AppConfig();
    OrderService orderService = appConfig.orderService();

    Order order = new Order(...);
    orderService.createOrder(order);
}
```

`OrderService`는 자신의 의존성이 어떻게 만들어지는지 전혀 신경쓰지 않아도 됩니다. 만약 DB를 Oracle로 바꾸고 싶다면? `AppConfig`의 `orderRepository()` 메소드만 수정하면 됩니다.

```java
// AppConfig.java
public OrderRepository orderRepository() {
    // 이 부분만 수정하면 모든 것이 바뀐다!
    return new OracleOrderRepository();
}
```

이 `AppConfig`의 역할을 스프링에서는 **스프링 컨테이너**가 담당합니다.

## 3. 스프링 컨테이너와 빈 (Bean)

-   **스프링 컨테이너 (Spring Container):** 스프링에서 객체를 생성하고 관리하는 IoC 컨테이너입니다. `ApplicationContext` 인터페이스로 구현되며, 이 컨테이너가 `AppConfig`의 역할을 대신합니다.
-   **빈 (Bean):** 스프링 컨테이너가 관리하는 객체를 '빈'이라고 부릅니다. 위 예제에서 `orderService`, `orderRepository`가 모두 빈에 해당합니다.

### 3.1 스프링에게 빈을 등록하는 방법

스프링 컨테이너에게 어떤 객체를 빈으로 관리해달라고 알려주는 방법은 크게 두 가지입니다.

**1. 컴포넌트 스캔 (Component Scan)과 어노테이션**

스프링 부트가 가장 선호하는 방법입니다. 개발자가 직접 클래스에 특정 어노테이션을 붙여주면, 스프링이 애플리케이션 시작 시 해당 클래스들을 모두 찾아 자동으로 빈으로 등록합니다.

-   `@Component`: 가장 기본적인 컴포넌트 스캔 대상 어노테이션.
-   `@Controller`: 웹 MVC의 컨트롤러 계층을 위한 어노테이션.
-   `@Service`: 비즈니스 로직을 담당하는 서비스 계층을 위한 어노테이션.
-   `@Repository`: 데이터 접근 계층(DAO)을 위한 어노테이션. (DB 예외를 스프링 예외로 변환해주는 기능 포함)

```java
// OrderServiceImpl.java
@Service // "이 클래스는 비즈니스 로직을 담당하는 서비스 빈입니다."
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    // 생성자가 하나일 경우 @Autowired 생략 가능
    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
    // ...
}

// MySqlOrderRepository.java
@Repository // "이 클래스는 데이터 접근을 담당하는 리포지토리 빈입니다."
public class MySqlOrderRepository implements OrderRepository {
    // ...
}
```

**2. Java 설정 클래스에 직접 빈 등록**

`@Configuration` 어노테이션이 붙은 클래스에 `@Bean` 어노테이션을 사용하여 수동으로 빈을 등록할 수 있습니다. 주로 외부 라이브러리나, 개발자가 직접 수정할 수 없는 클래스를 빈으로 등록할 때 사용합니다.

```java
@Configuration
public class AppConfig {

    @Bean // "이 메소드가 반환하는 객체를 스프링 빈으로 등록해주세요."
    public OrderRepository orderRepository() {
        return new MySqlOrderRepository();
    }

    @Bean
    public OrderService orderService() {
        return new OrderServiceImpl(orderRepository());
    }
}
```

### 3.2 의존성 주입 방법 3가지

스프링 컨테이너가 빈에게 의존성을 주입하는 방법은 3가지가 있습니다.

1.  **생성자 주입 (Constructor Injection) - ✨ 권장**
    -   생성자를 통해 의존성을 주입받습니다.
    -   **장점:**
        -   **불변성(Immutability):** `final` 키워드를 사용할 수 있어, 한번 주입된 의존성이 변경될 일이 없습니다.
        -   **누락 방지:** 객체 생성 시점에 반드시 의존성이 주입되어야 하므로, `NullPointerException`을 원천적으로 방지할 수 있습니다.
        -   **순환 참조 방지:** 빈 A가 B를, B가 다시 A를 참조하는 '순환 참조' 발생 시, 애플리케이션 시작 시점에 오류를 발견할 수 있습니다.
    -   스프링 공식 문서에서 권장하는 방식입니다.

    ```java
    @Service
    public class OrderServiceImpl {
        private final OrderRepository orderRepository;

        // 생성자가 1개만 있을 경우 @Autowired 생략 가능
        @Autowired
        public OrderServiceImpl(OrderRepository orderRepository) {
            this.orderRepository = orderRepository;
        }
    }
    ```

2.  **수정자 주입 (Setter Injection)**
    -   setter 메소드를 통해 의존성을 주입받습니다.
    -   **장점:** 선택적으로 의존성을 주입할 수 있습니다.
    -   **단점:** 객체가 생성된 이후에도 외부에서 의존성을 변경할 수 있어 불변성이 깨집니다. 주입이 누락될 경우 `NullPointerException`이 발생할 수 있습니다.

    ```java
    @Service
    public class OrderServiceImpl {
        private OrderRepository orderRepository;

        @Autowired
        public void setOrderRepository(OrderRepository orderRepository) {
            this.orderRepository = orderRepository;
        }
    }
    ```

3.  **필드 주입 (Field Injection)**
    -   필드에 직접 `@Autowired`를 붙여 주입합니다.
    -   **장점:** 코드가 간결해집니다.
    -   **단점:** 외부에서 의존성을 주입하기가 매우 어렵고, `final` 키워드를 사용할 수 없어 불변성을 보장할 수 없습니다. 순수 Java 코드로 테스트하기가 까다로워 **사용을 지양**해야 합니다. (테스트 코드나 일부 특수한 경우에만 제한적으로 사용)

    ```java
    @Service
    public class OrderServiceImpl {
        @Autowired
        private OrderRepository orderRepository;
    }
    ```

---

## ✏️ 1주차 실습 과제

1.  **순수 Java로 DI 구현하기**
    -   `MemberService`와 `MemberRepository` 인터페이스를 만듭니다.
    -   `MemoryMemberRepository` 구현체를 만듭니다. (DB 대신 `Map`을 사용하여 회원 정보 저장)
    -   `MemberServiceImpl` 구현체를 만들고, 생성자 주입 방식으로 `MemberRepository`에 의존하도록 작성합니다.
    -   `AppConfig` 클래스를 만들어 `MemberServiceImpl`과 `MemoryMemberRepository`를 조립(연결)합니다.
    -   `main` 메소드에서 `AppConfig`를 통해 `MemberService`를 얻어와 회원을 가입시키는 코드를 실행해보세요.

2.  **스프링을 사용하여 1번 과제 전환하기**
    -   `spring-boot-starter-web` 의존성을 추가하여 스프링 부트 프로젝트를 생성합니다.
    -   `MemberServiceImpl`과 `MemoryMemberRepository`에 각각 `@Service`, `@Repository` 어노테이션을 붙여 컴포넌트 스캔 대상으로 만듭니다.
    -   `AppConfig`는 삭제하거나, `@Configuration`과 `@Bean`을 사용하는 방식으로 변경해봅니다.
    -   스프링 부트의 메인 애플리케이션 클래스에서 `ApplicationContext`를 통해 `MemberService` 빈을 직접 조회하고, 회원을 가입시키는 코드를 실행해보세요.

---

##  🤔 심화 학습

-   `BeanFactory`와 `ApplicationContext`의 차이점은 무엇일까요?
-   스프링 빈의 스코프(Scope)에는 어떤 종류가 있을까요? (Singleton, Prototype 등)
-   컴포넌트 스캔의 탐색 범위는 어떻게 지정될까요? (`@ComponentScan`)

---

## 📝 1주차 요약

-   **IoC (제어의 역전):** 객체의 생성과 생명주기 관리의 제어권이 개발자에서 스프링 컨테이너로 넘어갔다.
-   **DI (의존성 주입):** IoC를 구현하는 방법으로, 필요한 의존성을 외부(컨테이너)에서 주입해준다. DI를 통해 클래스 간의 **결합도를 낮추고 유연성을 높일 수 있다.**
-   **스프링 컨테이너와 빈:** 스프링 컨테이너(`ApplicationContext`)는 스프링이 관리하는 객체(`Bean`)를 담고 있는 저장소이다.
-   **의존성 주입은 반드시 생성자 주입을 사용하자.** 불변성, 안정성, 테스트 용이성 등 모든 면에서 가장 우수하다.
