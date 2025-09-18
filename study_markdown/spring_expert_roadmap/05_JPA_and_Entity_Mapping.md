# 5주차: JPA와 엔티티 매핑

**목표:** 자바 진영의 표준 ORM(Object-Relational Mapping) 기술인 JPA의 기본 개념을 이해합니다. 객체(Entity)를 관계형 데이터베이스의 테이블에 어떻게 매핑하는지 배우고, 영속성 컨텍스트의 동작 원리를 통해 JPA가 어떻게 데이터베이스 작업을 처리하는지 학습합니다.

---

## 1. ORM과 JPA, 그리고 Hibernate

### 1.1 JDBC의 한계와 ORM의 등장

전통적인 JDBC(Java Database Connectivity) 방식은 개발자가 직접 SQL 쿼리를 작성하고, `ResultSet`을 받아 일일이 자바 객체에 매핑해주어야 했습니다.

```java
// JDBC 예시
String sql = "SELECT id, name, email FROM member WHERE id = ?";
PreparedStatement pstmt = connection.prepareStatement(sql);
pstmt.setLong(1, memberId);

ResultSet rs = pstmt.executeQuery();

if (rs.next()) {
    Member member = new Member();
    member.setId(rs.getLong("id"));
    member.setName(rs.getString("name"));
    member.setEmail(rs.getString("email"));
}
```

이 방식의 문제점은 다음과 같습니다.

-   **반복적인 코드:** CRUD(Create, Read, Update, Delete) 작업마다 유사한 JDBC 코드가 반복됩니다.
-   **SQL 종속성:** 객체 지향적인 자바 코드와 관계형 데이터베이스 중심의 SQL 사이의 패러다임 불일치가 발생합니다. 필드 하나를 추가/수정하려면 관련된 모든 SQL문을 찾아 수정해야 합니다.
-   **데이터베이스 종속성:** 특정 데이터베이스(MySQL, Oracle 등)의 방언(Dialect)에 맞는 SQL을 작성하면, 다른 데이터베이스로 교체하기가 매우 어렵습니다.

**ORM(Object-Relational Mapping)** 은 이러한 문제를 해결하기 위해 등장했습니다. ORM은 이름 그대로 **객체(Object)와 관계형 데이터베이스(Relational Database)를 자동으로 매핑**해주는 기술입니다. 개발자는 더 이상 SQL을 직접 작성하지 않고, 마치 자바 컬렉션에 객체를 저장하고 조회하듯이 코드를 작성할 수 있습니다.

```java
// ORM(JPA) 예시
Member member = jpa.find(Member.class, memberId); // SQL 없이 객체를 바로 조회
```

### 1.2 JPA, Hibernate, Spring Data JPA의 관계

-   **JPA (Java Persistence API):** 자바 진영의 **ORM 기술 표준 명세(인터페이스)** 입니다. JPA는 어떻게 동작해야 하는지에 대한 규칙만 정의하고, 실제 구현은 제공하지 않습니다.

-   **Hibernate:** JPA라는 표준 명세를 **실제로 구현한 구현체** 중 하나입니다. 가장 널리 사용되고 성숙한 JPA 구현체이며, 사실상의 표준으로 여겨집니다.

-   **Spring Data JPA:** 스프링 프레임워크에서 JPA를 더 쉽고 편하게 사용할 수 있도록 **한 단계 더 추상화한 모듈**입니다. `Repository` 인터페이스를 만드는 것만으로도 기본적인 CRUD 기능을 자동으로 구현해줍니다. (6주차에 자세히 다룹니다.)

> **관계 정리:** `Spring Data JPA` -> `Hibernate` -> `JPA`
> 우리는 스프링 부트에서 `spring-boot-starter-data-jpa` 의존성을 추가하면, 이 모든 기술을 한번에 사용할 수 있게 됩니다. 개발자는 주로 Spring Data JPA와 JPA의 표준 API를 사용하게 됩니다.

## 2. 엔티티(Entity)와 테이블 매핑

JPA에서 가장 중요한 일은 데이터베이스 테이블과 매핑될 자바 객체, 즉 **엔티티(Entity)** 를 설계하는 것입니다.

### 2.1 `@Entity`

-   이 클래스가 JPA가 관리하는 엔티티임을 나타냅니다.
-   `@Entity`가 붙은 클래스는 반드시 **기본 생성자(No-args constructor)** 를 가지고 있어야 합니다. (JPA 구현체가 리플렉션을 통해 객체를 생성할 때 필요)
-   `final` 클래스, `enum`, `interface`, `inner` 클래스에는 사용할 수 없습니다.

### 2.2 `@Table`

-   엔티티와 매핑될 테이블을 지정합니다. 생략하면 엔티티 이름을 테이블 이름으로 사용합니다. (e.g., `Member` 클래스 -> `member` 테이블)
-   `@Table(name = "MBR")` 처럼 이름을 직접 지정할 수 있습니다.

### 2.3 기본 키(Primary Key) 매핑

-   **`@Id`**: 해당 필드가 테이블의 기본 키(PK)임을 나타냅니다.
-   **`@GeneratedValue`**: 기본 키 값을 자동으로 생성하는 방법을 지정합니다.
    -   `strategy = GenerationType.IDENTITY`: 데이터베이스의 `AUTO_INCREMENT` 또는 `IDENTITY` 컬럼을 사용하여 PK 값을 생성합니다. (MySQL, PostgreSQL 등)
    -   `strategy = GenerationType.SEQUENCE`: 데이터베이스 시퀀스를 사용하여 PK 값을 생성합니다. (Oracle 등)
    -   `strategy = GenerationType.AUTO`: 사용하는 데이터베이스 방언에 따라 위 전략 중 하나를 자동으로 선택합니다. (기본값)

### 2.4 필드(Column) 매핑

-   **`@Column`**: 필드와 테이블의 컬럼을 매핑합니다.
    -   `name`: 컬럼 이름을 지정합니다. (e.g., `@Column(name = "user_name")`)
    -   `nullable`: `false`로 설정하면 `NOT NULL` 제약조건이 됩니다.
    -   `unique`: `true`로 설정하면 `UNIQUE` 제약조건이 됩니다.
    -   `length`: 문자열 타입의 길이를 지정합니다.
-   **`@Transient`**: 이 필드는 데이터베이스에 매핑하지 않음을 나타냅니다. (메모리에서만 임시로 사용)
-   **`@Enumerated`**: Enum 타입을 매핑할 때 사용합니다.
    -   `EnumType.STRING`: Enum의 이름을 DB에 저장합니다. (**권장**)
    -   `EnumType.ORDINAL`: Enum의 순서(0, 1, 2...)를 DB에 저장합니다. (사용하지 말 것! 순서가 바뀌면 데이터가 꼬임)
-   **`@Temporal`**: `java.util.Date`, `Calendar` 타입을 매핑할 때 사용합니다. (Java 8 이상의 `LocalDate`, `LocalDateTime`을 사용할 경우 불필요)
-   **`@Lob`**: 대용량 데이터(CLOB, BLOB)를 매핑할 때 사용합니다.

### 2.5 엔티티 매핑 예제

```java
@Entity // 이 클래스는 JPA 엔티티입니다.
@Table(name = "members") // `members` 테이블과 매핑됩니다.
public class Member {

    @Id // 이 필드가 Primary Key 입니다.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB의 IDENTITY 전략을 따릅니다.
    private Long id;

    @Column(name = "user_name", nullable = false, length = 50) // `user_name` 컬럼, NOT NULL, 길이 50
    private String name;

    @Column(unique = true) // UNIQUE 제약조건
    private String email;

    private String password; // @Column 생략 시 필드명을 컬럼명으로 사용 (e.g., password)

    @Enumerated(EnumType.STRING) // Enum 이름을 DB에 저장 (e.g., "USER", "ADMIN")
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt; // Java 8 이상에서는 @Temporal 불필요

    @Transient // 이 필드는 DB에 저장되지 않습니다.
    private String tempValue;

    // JPA는 기본 생성자를 필요로 합니다.
    protected Member() {}

    // 개발 편의를 위한 생성자
    public Member(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = LocalDateTime.now();
    }
    // getters...
}

public enum Role {
    USER, ADMIN
}
```

## 3. 영속성 컨텍스트 (Persistence Context)

JPA를 이해하는 데 가장 중요한 개념입니다. 영속성 컨텍스트는 **"엔티티를 영구 저장하는 환경"** 이라는 뜻으로, 논리적인 개념입니다. `EntityManager`를 통해 이 영속성 컨텍스트에 접근할 수 있습니다.

쉽게 말해, **엔티티들을 담아두는 1차 캐시(메모리 공간)** 라고 생각할 수 있습니다.

### 3.1 영속성 컨텍스트의 특징

1.  **1차 캐시:** 영속성 컨텍스트 내부에는 `Map` 형태의 캐시가 있어, `@Id` 값을 키로, 엔티티 객체를 값으로 저장합니다.
    -   `em.find()`로 엔티티를 조회할 때, 먼저 1차 캐시를 찾아보고, 없으면 데이터베이스에서 조회한 후 1차 캐시에 저장합니다.
    -   따라서 같은 트랜잭션 내에서 동일한 엔티티를 여러 번 조회해도, 최초 한 번만 SQL이 실행됩니다.

    ```java
    // 1. 최초 조회: DB에서 조회 후 1차 캐시에 저장 (SELECT SQL 실행)
    Member member1 = em.find(Member.class, 1L);

    // 2. 두 번째 조회: 1차 캐시에서 바로 가져옴 (SELECT SQL 실행 안 함)
    Member member2 = em.find(Member.class, 1L);
    ```

2.  **동일성(Identity) 보장:** 같은 트랜잭션 내에서 1차 캐시 덕분에, 동일한 `@Id` 값으로 조회한 엔티티는 항상 같은 메모리 주소를 가진 객체임이 보장됩니다. (`member1 == member2` 는 `true`)

3.  **쓰기 지연 (Transactional write-behind):** `em.persist(member)`를 호출해도 바로 `INSERT` SQL이 실행되지 않습니다. 영속성 컨텍스트의 **쓰기 지연 SQL 저장소**에 쿼리를 쌓아둡니다.
    -   그리고 트랜잭션이 커밋(commit)되는 시점에, 쌓아두었던 SQL들을 모아서 한번에 데이터베이스로 보냅니다(flush).

4.  **변경 감지 (Dirty Checking):** JPA의 가장 강력한 기능 중 하나입니다.
    -   트랜잭션 내에서 조회한 엔티티의 값을 변경하면, `em.update()` 같은 메소드를 호출하지 않아도 트랜잭션 커밋 시점에 JPA가 자동으로 변경 사항을 감지하여 `UPDATE` SQL을 실행합니다.
    -   원리: 1차 캐시에 저장될 때의 최초 상태(스냅샷)와 현재 엔티티의 상태를 비교하여 변경된 부분을 찾아냅니다.

    ```java
    @Transactional
    public void updateMemberName(Long id, String newName) {
        Member member = em.find(Member.class, id); // 엔티티 조회 (영속 상태)

        // 별도의 update 메소드 호출 없이, 값만 변경
        member.setName(newName);

    } // 트랜잭션이 끝나는 시점에 변경 감지가 동작하여 UPDATE 쿼리 실행
    ```

### 3.2 엔티티의 생명주기

-   **비영속 (New/Transient):** 순수한 자바 객체 상태. JPA와 아무 관련이 없습니다.
    ```java
    Member member = new Member();
    ```
-   **영속 (Managed):** `em.persist(member)` 또는 `em.find()`를 통해 영속성 컨텍스트가 관리하는 상태. 1차 캐시에 저장되며, 변경 감지 등의 혜택을 받습니다.
    ```java
    em.persist(member);
    ```
-   **준영속 (Detached):** 영속성 컨텍스트가 관리하다가 분리된 상태. `em.detach(member)` 또는 `em.close()` 호출 시 이렇게 됩니다. 더 이상 JPA의 관리를 받지 못합니다.
-   **삭제 (Removed):** `em.remove(member)`를 통해 삭제된 상태. 트랜잭션 커밋 시 실제 DB에서 삭제됩니다.

---

## ✏️ 5주차 실습 과제

4주차에 만들었던 **할 일(Todo) API**에 실제 데이터베이스를 연동합니다.

1.  **의존성 및 설정 추가**
    -   `pom.xml` 또는 `build.gradle`에 `spring-boot-starter-data-jpa` 의존성을 추가합니다.
    -   개발용으로 간편한 인메모리(in-memory) 데이터베이스인 `H2 Database` 의존성을 추가합니다.
    -   `application.yml`에 H2 데이터베이스 설정을 추가합니다. (JPA가 생성하는 SQL을 보고, DDL(테이블 생성)을 자동으로 수행하도록 설정)
        ```yaml
        spring:
          h2:
            console:
              enabled: true # H2 웹 콘솔 사용
          datasource:
            url: jdbc:h2:mem:testdb # 메모리 모드로 동작
            driver-class-name: org.h2.Driver
            username: sa
            password:
          jpa:
            hibernate:
              ddl-auto: create # 애플리케이션 실행 시점에 테이블을 새로 생성
            properties:
              hibernate:
                show_sql: true # 실행되는 SQL 쿼리 로그 출력
                format_sql: true # SQL 쿼리 예쁘게 포맷팅
        ```

2.  **`Todo` 엔티티 클래스 작성**
    -   `com.example.demo.domain` 패키지를 만들고 `Todo` 클래스를 작성합니다.
    -   **필드:**
        -   `id`: `Long` 타입, PK, 자동 증가
        -   `title`: `String` 타입, `null` 불가능
        -   `content`: `String` 타입, `TEXT`와 같이 긴 텍스트를 저장할 수 있도록 `@Lob` 사용
        -   `completed`: `boolean` 타입
        -   `createdAt`: `LocalDateTime` 타입, 생성 시각
    -   위 필드들에 맞게 JPA 매핑 어노테이션(`@Entity`, `@Id`, `@GeneratedValue`, `@Column` 등)을 적절히 설정하세요.

3.  **H2 콘솔 확인**
    -   애플리케이션을 실행하고, 웹 브라우저에서 `http://localhost:8080/h2-console` 로 접속합니다.
    -   `JDBC URL`을 `jdbc:h2:mem:testdb`로 맞추고 연결합니다.
    -   `TODO` 테이블이 의도한 대로 잘 생성되었는지 확인합니다.

---

## 🤔 심화 학습

-   엔티티 간의 연관관계 매핑(`@OneToMany`, `@ManyToOne`, `@OneToOne`, `@ManyToMany`)은 어떻게 설정할까요? (다음 주차 예고)
-   `em.flush()`와 트랜잭션 커밋의 관계는 무엇일까요? `flush()`를 호출하면 1차 캐시는 어떻게 될까요?
-   `ddl-auto` 옵션의 종류(`create`, `create-drop`, `update`, `validate`, `none`)는 각각 어떤 의미이며, 운영 환경에서는 어떤 값을 사용해야 할까요?

---

## 📝 5주차 요약

-   **JPA**는 자바 객체와 관계형 데이터베이스를 매핑해주는 **ORM 기술 표준**이며, 개발자를 반복적인 SQL 작업에서 해방시켜준다.
-   `@Entity` 어노테이션이 붙은 클래스는 JPA가 관리하는 **엔티티**이며, 데이터베이스 테이블과 매핑된다.
-   `@Id`, `@GeneratedValue`, `@Column` 등의 어노테이션을 통해 객체 필드와 테이블 컬럼을 상세하게 매핑할 수 있다.
-   **영속성 컨텍스트**는 엔티티를 보관하는 1차 캐시이자, **쓰기 지연**, **변경 감지**, **동일성 보장** 등의 중요한 기능을 제공하는 JPA의 핵심 엔진이다.
-   엔티티의 값을 수정할 때는 `update` 메소드 없이, **트랜잭션 안에서 엔티티를 조회하여 값만 변경**하면 **변경 감지(Dirty Checking)** 기능이 알아서 UPDATE 쿼리를 실행해준다.
