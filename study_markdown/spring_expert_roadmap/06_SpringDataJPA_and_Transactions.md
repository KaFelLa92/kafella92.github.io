# 6주차: Spring Data JPA와 트랜잭션

**목표:** Spring Data JPA가 제공하는 강력한 기능을 통해 지루하고 반복적인 CRUD 코드를 제거하는 방법을 배웁니다. `JpaRepository` 인터페이스의 동작 원리를 이해하고, 쿼리 메소드와 `@Query`를 사용하여 원하는 데이터를 손쉽게 조회하는 기술을 익힙니다. 또한, 데이터 일관성을 보장하는 데 필수적인 트랜잭션의 개념과 `@Transactional` 어노테이션의 사용법을 학습합니다.

---

## 1. Spring Data JPA: Repository의 마법

5주차에 우리는 `EntityManager`를 사용하여 영속성 컨텍스트에 접근하고, `em.persist()`, `em.find()` 등의 메소드로 데이터를 관리했습니다. 하지만 이마저도 반복적인 코드 작성을 요구합니다.

```java
// 일반적인 JPA Repository (DAO)
@Repository
public class JpaTodoRepository {

    @PersistenceContext
    private EntityManager em;

    public Todo save(Todo todo) {
        em.persist(todo);
        return todo;
    }

    public Optional<Todo> findById(Long id) {
        Todo todo = em.find(Todo.class, id);
        return Optional.ofNullable(todo);
    }

    public List<Todo> findAll() {
        return em.createQuery("select t from Todo t", Todo.class)
                 .getResultList();
    }
    // ... update, delete 등등 ...
}
```

모든 엔티티에 대해 위와 비슷한 코드를 반복해서 작성해야 합니다. Spring Data JPA는 이 문제를 아주 우아하게 해결합니다.

### 1.1 `JpaRepository` 인터페이스

Spring Data JPA의 핵심은 `Repository` 인터페이스입니다. 개발자는 그저 **인터페이스를 만들기만 하면**, Spring Data JPA가 실행 시점에 **자동으로 그 구현체를 만들어 스프링 빈으로 등록**해줍니다.

```java
// TodoRepository.java
// ✨ 이게 전부입니다! 구현 클래스를 만들 필요가 없습니다.
public interface TodoRepository extends JpaRepository<Todo, Long> {
    // <T, ID> -> T: 엔티티 타입, ID: 엔티티의 @Id 필드 타입
}
```

`JpaRepository`를 상속받는 것만으로, 우리는 다음과 같은 수많은 메소드를 공짜로 얻게 됩니다.

-   `save(S entity)`: 새로운 엔티티는 저장(persist), 이미 있는 엔티티는 병합(merge) - **UPSERT**
-   `findById(ID id)`: ID로 엔티티 하나 조회 (`Optional<T>` 반환)
-   `findAll()`: 모든 엔티티 조회
-   `count()`: 엔티티 총 개수 조회
-   `delete(T entity)`: 엔티티 삭제
-   `deleteById(ID id)`: ID로 엔티티 삭제
-   `existsById(ID id)`: 해당 ID의 엔티티 존재 여부 확인
-   ... 등등

이제 서비스 계층에서는 이 `TodoRepository`를 주입받아 바로 사용하면 됩니다.

```java
@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Transactional
    public Long createTodo(String title, String content) {
        Todo todo = new Todo(title, content);
        Todo savedTodo = todoRepository.save(todo); // save() 메소드를 바로 사용
        return savedTodo.getId();
    }

    public Optional<Todo> findTodoById(Long id) {
        return todoRepository.findById(id); // findById() 메소드를 바로 사용
    }
}
```

### 1.2 어떻게 가능한가? (동작 원리)

애플리케이션이 시작될 때, Spring Data JPA는 `JpaRepository`를 상속한 모든 인터페이스를 찾습니다. 그리고 해당 엔티티(`Todo`)에 대한 **프록시(Proxy) 객체**를 동적으로 생성하여 스프링 빈으로 등록합니다. 우리가 `todoRepository.save()`를 호출하면, 실제로는 이 프록시 객체의 메소드가 호출되고, 프록시 객체 내부에서는 `EntityManager`를 사용하여 실제 JPA 작업을 수행하는 것입니다.

## 2. 쿼리 메소드 (Query Methods)

`JpaRepository`가 기본 제공하는 메소드 외에, 더 복잡한 조건의 조회가 필요할 때가 많습니다. Spring Data JPA는 **메소드 이름을 분석하여 JPQL 쿼리를 자동으로 생성**해주는 강력한 `쿼리 메소드` 기능을 제공합니다.

### 2.1 쿼리 메소드 작성 규칙

`find...By...`, `read...By...`, `get...By...`, `count...By...`, `exists...By...` 등의 접두사로 시작하고, 뒤에 엔티티의 필드 이름을 조합하여 메소드를 만듭니다.

-   **`And`**: 여러 조건을 `AND`로 연결
    -   `findByTitleAndCompleted(String title, boolean completed)`
    -   JPQL: `... where title = ?1 and completed = ?2`

-   **`Or`**: 여러 조건을 `OR`로 연결
    -   `findByTitleOrContent(String title, String content)`
    -   JPQL: `... where title = ?1 or content = ?2`

-   **비교 연산자**
    -   `Is`, `Equals`: 같음 (생략 가능. `findByTitle(...)`)
    -   `Between`: `... where createdAt between ?1 and ?2`
    -   `LessThan`, `GreaterThan`: `... where id < ?1`
    -   `IsNull`, `IsNotNull`: `... where title is not null`
    -   `Like`, `NotLike`: `... where title like ?1`
    -   `StartingWith`, `EndingWith`, `Containing`: `... where title like ?1%` (편의 기능)

-   **`OrderBy`**: 정렬
    -   `findAllByOrderByCreatedAtDesc()`
    -   JPQL: `... order by createdAt desc`

-   **`Top` or `First`**: 결과 개수 제한
    -   `findTop5ByOrderByCreatedAtDesc()`
    -   JPQL: `... order by createdAt desc limit 5`

### 2.2 쿼리 메소드 예제

```java
public interface TodoRepository extends JpaRepository<Todo, Long> {

    // 제목으로 Todo 조회
    List<Todo> findByTitle(String title);

    // 완료되지 않은 Todo 목록을 생성일자 내림차순으로 조회
    List<Todo> findByCompletedFalseOrderByCreatedAtDesc();

    // 제목에 특정 키워드가 포함된 Todo 개수 조회
    long countByTitleContaining(String keyword);

    // 특정 날짜 이후에 생성된 Todo가 존재하는지 확인
    boolean existsByCreatedAtAfter(LocalDateTime dateTime);
}
```

> **주의:** 쿼리 메소드는 매우 편리하지만, 이름이 너무 길어지면 가독성이 떨어지고 복잡한 조인(Join)에는 한계가 있습니다. 그럴 때는 `@Query`를 사용합니다.

## 3. `@Query` 어노테이션

메소드 이름으로 표현하기 힘든 복잡한 쿼리는 `@Query` 어노테이션을 사용하여 **직접 JPQL(Java Persistence Query Language)을 작성**할 수 있습니다.

-   **JPQL:** SQL과 유사하지만, 테이블이 아닌 **엔티티 객체를 대상**으로 하는 쿼리 언어입니다. (`select t from Todo t` 에서 `Todo`는 테이블이 아닌 엔티티 클래스)

### 3.1 `@Query` 사용법

```java
public interface TodoRepository extends JpaRepository<Todo, Long> {

    // 1. 위치 기반 파라미터 바인딩 (?1, ?2)
    @Query("select t from Todo t where t.title = ?1 and t.completed = ?2")
    List<Todo> findTodosByCustomQuery(String title, boolean completed);

    // 2. 이름 기반 파라미터 바인딩 (:name)
    @Query("select t from Todo t where t.content like %:keyword%")
    List<Todo> findByContentKeyword(@Param("keyword") String keyword);

    // 3. DTO로 직접 조회 (new 키워드 사용)
    //    - 패키지 경로를 포함한 전체 클래스 이름을 적어주어야 합니다.
    @Query("select new com.example.demo.dto.TodoSimpleResponse(t.id, t.title, t.completed) from Todo t where t.completed = false")
    List<TodoSimpleResponse> findUncompletedTodosAsDto();

    // 4. Native Query 사용 (DB에 직접 보내는 SQL)
    //    - DB에 특화된 함수를 사용하거나, 복잡한 통계 쿼리에 사용
    @Query(value = "SELECT * FROM todo WHERE title = ?1", nativeQuery = true)
    List<Todo> findByTitleWithNativeQuery(String title);
}
```

## 4. 트랜잭션 (Transaction)

트랜잭션은 **"더 이상 쪼갤 수 없는 하나의 업무 단위"** 를 의미합니다. 예를 들어, "계좌 이체"라는 작업은 (1) A 계좌에서 돈을 빼고, (2) B 계좌에 돈을 더하는 두 가지 작업으로 이루어집니다. 이 두 작업은 반드시 모두 성공하거나, 하나라도 실패하면 모두 실패(원상 복구)해야 합니다. 이것이 트랜잭션입니다.

### 4.1 `@Transactional` 어노테이션

스프링은 `@Transactional` 어노테이션 하나로 선언적 트랜잭션 관리를 지원합니다.

-   이 어노테이션이 붙은 메소드나 클래스는 **AOP**를 통해 트랜잭션 기능이 적용됩니다.
-   메소드가 시작될 때 트랜잭션을 시작하고, 메소드가 정상적으로 종료되면 트랜잭션을 커밋(commit)합니다.
-   만약 **`RuntimeException` (Unchecked Exception)이 발생하면, 트랜잭션을 롤백(rollback)** 합니다.
-   `Exception` (Checked Exception)이 발생하면, 기본적으로는 커밋합니다. (롤백하고 싶으면 `rollbackFor` 옵션 사용)

```java
@Service
@Transactional // 클래스 레벨에 붙이면 모든 public 메소드에 트랜잭션이 적용됨
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public Long createTodo(String title, String content) {
        Todo todo = new Todo(title, content);
        todoRepository.save(todo);
        // ... 만약 여기서 RuntimeException이 발생하면, 위 save() 작업은 롤백된다.
        return todo.getId();
    }

    public void updateTodoTitle(Long id, String newTitle) {
        // @Transactional 안에서 엔티티를 조회하면, 해당 엔티티는 영속 상태가 된다.
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));

        // 값만 변경해주면, 트랜잭션이 끝날 때 변경 감지(Dirty Checking)에 의해 UPDATE 쿼리가 자동으로 실행된다.
        todo.setTitle(newTitle);
    }

    @Transactional(readOnly = true) // 조회 전용 메소드에는 readOnly=true 옵션을 주자.
    public List<Todo> findCompletedTodos() {
        // readOnly=true 옵션은 성능 최적화에 도움이 된다. (JPA가 변경 감지를 위한 스냅샷을 만들지 않음)
        return todoRepository.findByCompleted(true);
    }
}
```

> **중요:** `@Transactional`은 **public 메소드**에만 적용됩니다. 또한, 같은 클래스 내의 메소드 호출(self-invocation)에는 AOP 프록시가 동작하지 않아 트랜잭션이 적용되지 않을 수 있으니 주의해야 합니다.

---

## ✏️ 6주차 실습 과제

5주차에 만든 `Todo` 엔티티와 H2 데이터베이스 설정을 기반으로, `TodoRepository`와 `TodoService`를 완성합니다.

1.  **`TodoRepository` 인터페이스 생성**
    -   `JpaRepository<Todo, Long>`를 상속받도록 작성합니다.
    -   다음 쿼리 메소드를 추가로 정의하세요.
        -   완료되지 않은 할 일 목록을 ID 내림차순으로 조회하는 메소드
        -   제목 또는 내용에 특정 키워드가 포함된 할 일을 조회하는 메소드 (`@Query`와 `@Param` 사용)

2.  **`TodoService` 클래스 리팩토링**
    -   `EntityManager` 대신 `TodoRepository`를 주입받도록 수정합니다.
    -   클래스 레벨에 `@Transactional`을 붙입니다.
    -   기존에 만들었던 API 기능들을 `TodoRepository`를 사용하여 모두 구현합니다. (생성, 조회, 수정, 삭제)
    -   **수정 기능**은 `findById`로 엔티티를 조회한 후, DTO의 값으로 엔티티의 필드를 변경하는 방식으로 **변경 감지(Dirty Checking)** 를 활용하여 구현해보세요.
    -   **조회 기능**에는 `@Transactional(readOnly = true)`를 붙여 성능을 최적화하세요.

3.  **`TodoApiController`와 연결**
    -   `TodoApiController`가 `TodoService`를 호출하도록 의존 관계를 설정합니다.
    -   Postman으로 API를 호출하여 데이터가 실제로 DB에 저장되고, 수정되고, 삭제되는지 H2 콘솔과 로그를 통해 확인합니다.

---

## 🤔 심화 학습

-   `save()` 메소드는 새로운 엔티티를 저장(persist)할 때와 이미 존재하는 엔티티를 수정(merge)할 때 어떻게 다르게 동작할까요?
-   트랜잭션의 전파(Propagation) 옵션에는 어떤 것들이 있으며, `REQUIRED`와 `REQUIRES_NEW`는 어떻게 다른가요?
-   N+1 문제란 무엇이며, Fetch Join을 사용하여 어떻게 해결할 수 있을까요? (`@Query`에서 `join fetch` 사용)

---

## 📝 6주차 요약

-   **Spring Data JPA**를 사용하면 `JpaRepository` 인터페이스를 상속하는 것만으로도 기본적인 CRUD 구현이 자동으로 완성된다.
-   **쿼리 메소드**는 정해진 규칙에 따라 메소드 이름을 짓는 것만으로 원하는 조건의 조회 쿼리를 생성해준다.
-   복잡한 쿼리는 **`@Query`** 어노테이션을 사용하여 JPQL이나 Native SQL을 직접 작성할 수 있다.
-   **`@Transactional`** 어노테이션은 메소드 실행 시 트랜잭션을 시작하고, 정상 종료 시 커밋, `RuntimeException` 발생 시 롤백하여 데이터의 **정합성**을 보장한다.
-   조회 전용 메소드에는 **`@Transactional(readOnly = true)`** 옵션을 사용하여 성능을 최적화하자.
-   트랜잭션 내에서 조회한 영속 상태의 엔티티는 값만 변경해도 **변경 감지(Dirty Checking)** 에 의해 자동으로 UPDATE 쿼리가 실행된다.
