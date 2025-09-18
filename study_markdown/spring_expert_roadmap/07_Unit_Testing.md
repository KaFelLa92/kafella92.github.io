# 7주차: 단위 테스트 (Unit Test)

**목표:** 고품질의 소프트웨어를 만들기 위한 필수 역량인 테스트 코드 작성법을 배웁니다. 단위 테스트의 개념을 이해하고, JUnit5와 AssertJ를 사용하여 테스트 케이스를 작성하는 방법을 익힙니다. 또한, Mockito를 활용하여 외부 의존성을 격리하고 순수한 비즈니스 로직을 검증하는 기술을 학습합니다.

---

## 1. 왜 테스트 코드를 작성해야 하는가?

많은 신입 개발자들이 테스트 코드 작성을 번거롭고 부가적인 일로 생각하지만, 테스트 코드는 선택이 아닌 **필수**입니다. Postman으로 API를 테스트하거나, `System.out.println`으로 로그를 찍어보는 것도 테스트의 일종이지만, 자동화된 테스트 코드는 다음과 같은 강력한 장점을 제공합니다.

-   **품질 보증 및 버그 감소:** 개발자가 작성한 코드가 의도한 대로 정확히 동작하는지 검증하여, 프로덕션 환경에서 발생할 수 있는 버그를 사전에 예방합니다.
-   **안정적인 리팩토링:** 테스트 코드가 튼튼하게 받쳐준다면, 기존 코드의 구조를 개선하는 리팩토링을 자신감 있게 진행할 수 있습니다. 기능 변경 없이 내부 구조만 바꾼 후, 테스트를 통과하면 코드가 여전히 잘 동작한다는 것을 보장할 수 있습니다.
-   **살아있는 문서:** 잘 작성된 테스트 코드는 그 자체로 해당 코드의 기능과 사용법을 설명하는 가장 정확한 문서가 됩니다.
-   **빠른 피드백:** 수동 테스트에 비해 훨씬 빠른 속도로 코드의 문제점을 발견하고 수정할 수 있습니다.

## 2. 단위 테스트 (Unit Test)란?

테스트는 크게 단위 테스트, 통합 테스트, E2E(End-to-End) 테스트로 나눌 수 있습니다. 그 중 **단위 테스트**는 테스트 피라미드의 가장 아래층을 차지하는 가장 기본적이고 중요한 테스트입니다.

-   **단위(Unit):** 테스트할 수 있는 가장 작은 단위의 코드. 일반적으로 메소드나 클래스 하나를 의미합니다.
-   **단위 테스트의 특징:**
    -   **빠르다:** 테스트 실행 속도가 매우 빨라야 합니다.
    -   **격리되어 있다:** 테스트 대상은 다른 외부 의존성(DB, 네트워크, 다른 클래스 등)으로부터 완벽하게 격리되어야 합니다. 오직 자기 자신의 로직만 테스트해야 합니다.

예를 들어, `TodoService`의 `createTodo` 메소드를 단위 테스트한다고 가정해봅시다. 이 메소드는 내부적으로 `TodoRepository`를 호출합니다. 단위 테스트에서는 **실제 `TodoRepository`나 데이터베이스를 사용해서는 안 됩니다.** 대신, `TodoRepository`가 특정 상황에서 특정 값을 반환한다고 **"가정"** 하고, `TodoService`의 비즈니스 로직이 올바르게 동작하는지만 검증해야 합니다. 이 "가정"을 만들어주는 도구가 바로 **Mockito**와 같은 Mocking 프레임워크입니다.

## 3. 테스트를 위한 핵심 라이브러리

스프링 부트에서 `spring-boot-starter-test` 의존성을 추가하면, 테스트에 필요한 대부분의 라이브러리가 자동으로 포함됩니다.

-   **JUnit 5:** 자바 진영의 표준 테스트 프레임워크. 테스트를 실행하고 생명주기를 관리하는 역할을 합니다. (`@Test`, `@BeforeEach` 등)
-   **AssertJ:** 테스트의 결과를 검증(Assertion)하는 라이브러리. `isEqualsTo`, `isNotNull`, `hasSize` 등 직관적이고 풍부한 검증 메소드를 제공하여 가독성을 높여줍니다.
-   **Mockito:** Mock(가짜) 객체를 생성하고, 해당 객체의 행동을 정의하는 Mocking 프레임워크. 외부 의존성을 격리하기 위해 사용됩니다.

### 3.1 JUnit 5 기본 어노테이션

-   `@Test`: 이 메소드가 테스트 케이스임을 나타냅니다.
-   `@BeforeEach`: 각각의 `@Test` 메소드가 실행되기 **전에** 항상 실행됩니다. (테스트 간 독립성 보장)
-   `@AfterEach`: 각각의 `@Test` 메소드가 실행된 **후에** 항상 실행됩니다.
-   `@BeforeAll`: 모든 `@Test` 메소드 실행 전 **한 번만** 실행됩니다. (`static` 메소드여야 함)
-   `@AfterAll`: 모든 `@Test` 메소드 실행 후 **한 번만** 실행됩니다. (`static` 메소드여야 함)
-   `@DisplayName("테스트 이름")`: 테스트의 의도를 명확하게 설명하는 이름을 지정할 수 있습니다.
-   `@Disabled`: 이 테스트를 일시적으로 비활성화합니다.

### 3.2 AssertJ 사용법

AssertJ는 `assertThat(실제값).검증메소드(기대값)` 형태로 사용되어, "A는 B와 같다" 와 같이 자연스러운 문장처럼 읽힙니다.

```java
import static org.assertj.core.api.Assertions.*;

@Test
void assertionTest() {
    String name = "robbie";
    int age = 30;
    List<String> skills = List.of("java", "spring", "jpa");

    assertThat(name).isEqualTo("robbie");
    assertThat(age).isGreaterThan(20);
    assertThat(skills).hasSize(3).contains("spring");
    assertThatThrownBy(() -> {
        // 예외가 발생하는 코드
        skills.get(5);
    }).isInstanceOf(IndexOutOfBoundsException.class);
}
```

## 4. Mockito를 이용한 의존성 격리

단위 테스트의 핵심은 **격리**입니다. `TodoService`를 테스트하기 위해 `TodoRepository`의 가짜 객체(Mock)를 만드는 방법을 알아봅시다.

### 4.1 Mock 객체 생성

-   `@ExtendWith(MockitoExtension.class)`: JUnit5에서 Mockito를 사용하기 위한 확장 기능을 선언합니다.
-   `@Mock`: 가짜 객체를 만들 필드에 붙입니다.
-   `@InjectMocks`: 가짜 객체(`@Mock`)를 주입할 대상 필드에 붙입니다. Mockito는 `@InjectMocks`가 붙은 객체를 생성하고, `@Mock`으로 만들어진 객체들을 해당 객체에 주입해줍니다.

```java
@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository; // 가짜 TodoRepository

    @InjectMocks
    private TodoService todoService; // 가짜 Repository를 주입받을 실제 테스트 대상

    // ... 테스트 코드 ...
}
```

### 4.2 Mock 객체 행동 정의 (Stubbing)

Mock 객체는 껍데기일 뿐, 아무런 행동을 하지 않습니다. `when(...).thenReturn(...)` 구문을 사용하여 Mock 객체가 특정 상황에서 어떻게 행동해야 할지 정의할 수 있습니다. 이를 **스터빙(Stubbing)** 이라고 합니다.

-   `when(mock.method(args)).thenReturn(returnValue)`: `mock` 객체의 `method`가 `args` 인자와 함께 호출되면, `returnValue`를 반환하도록 정의합니다.
-   `when(mock.method(any())).thenReturn(returnValue)`: 어떤 인자가 들어오든 상관없이 `returnValue`를 반환하도록 정의합니다.
-   `when(mock.method(args)).thenThrow(exception)`: 예외를 발생시키도록 정의할 수도 있습니다.

### 4.3 단위 테스트 예제 코드

`TodoService`의 `createTodo`와 `findById` 메소드를 테스트하는 코드입니다.

```java
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoService todoService;

    private Todo todo;

    @BeforeEach
    void setUp() {
        // 각 테스트 전에 공통으로 사용할 Todo 객체 생성
        todo = new Todo(1L, "테스트 제목", "테스트 내용", false, LocalDateTime.now());
    }

    @Test
    @DisplayName("할 일 생성 성공")
    void createTodo_success() {
        // given (주어진 상황)
        // 1. todoRepository.save() 메소드에 어떤 Todo 객체든(any()) 전달되면,
        //    미리 만들어둔 todo 객체를 반환하라고 정의 (Stubbing)
        when(todoRepository.save(any(Todo.class))).thenReturn(todo);

        // when (무엇을 할 때)
        // 2. 실제 테스트 대상 메소드 호출
        Long createdId = todoService.createTodo("테스트 제목", "테스트 내용");

        // then (결과는 이래야 한다)
        // 3. 결과 검증
        assertThat(createdId).isEqualTo(1L);
    }

    @Test
    @DisplayName("할 일 ID로 조회 성공")
    void findById_success() {
        // given
        // 1. todoRepository.findById(1L)이 호출되면, Optional.of(todo)를 반환하도록 정의
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo));

        // when
        Todo foundTodo = todoService.findTodoById(1L);

        // then
        assertThat(foundTodo.getId()).isEqualTo(1L);
        assertThat(foundTodo.getTitle()).isEqualTo("테스트 제목");
    }

    @Test
    @DisplayName("존재하지 않는 ID로 조회 시 예외 발생")
    void findById_throwsException_whenNotFound() {
        // given
        // 1. todoRepository.findById(99L)이 호출되면, 빈 Optional을 반환하도록 정의
        when(todoRepository.findById(99L)).thenReturn(Optional.empty());

        // when & then
        // 2. todoService.findTodoById(99L) 호출 시 IllegalArgumentException이 발생하는지 검증
        assertThatThrownBy(() -> todoService.findTodoById(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Todo not found");
    }
}
```

> **Given-When-Then 패턴**
> 테스트 코드는 `given` (준비), `when` (실행), `then` (검증)의 세 단계로 구조화하면 가독성이 매우 좋아집니다.

---

## ✏️ 7주차 실습 과제

6주차에 만든 `TodoService`의 모든 public 메소드에 대해 단위 테스트 코드를 작성합니다.

1.  **테스트 환경 설정**
    -   `build.gradle` 또는 `pom.xml`에 `spring-boot-starter-test` 의존성이 있는지 확인합니다.
    -   `src/test/java` 디렉토리 아래에 `com.example.demo.service.TodoServiceTest` 클래스를 생성합니다.

2.  **`TodoServiceTest` 클래스 작성**
    -   `@ExtendWith(MockitoExtension.class)`를 클래스에 붙입니다.
    -   `TodoRepository`는 `@Mock`으로, `TodoService`는 `@InjectMocks`로 선언합니다.

3.  **테스트 케이스 작성**
    -   **`createTodo`**: 성공 케이스 (7주차 본문 예제 참고)
    -   **`findTodoById`**: 성공 케이스, 실패(ID 없음) 케이스 (7주차 본문 예제 참고)
    -   **`updateTodo` (변경 감지 활용)**
        -   **Given:** `findById`가 특정 Todo 객체를 담은 `Optional`을 반환하도록 스터빙합니다.
        -   **When:** `updateTodo` 메소드를 호출합니다.
        -   **Then:** `findById`로 반환했던 Todo 객체의 필드 값이 요청 DTO의 값으로 변경되었는지 `assertThat`으로 검증합니다. (변경 감지는 `@Transactional`이 있어야 동작하지만, 단위 테스트에서는 서비스 메소드 내에서 객체의 상태가 올바르게 변경되었는지만 확인하면 됩니다.)
    -   **`deleteTodo`**
        -   **Given:** `findById`가 특정 Todo 객체를 담은 `Optional`을 반환하도록 스터빙합니다.
        -   **When:** `deleteTodo` 메소드를 호출합니다.
        -   **Then:** `todoRepository.delete()` 메소드가 정확히 1번 호출되었는지 검증합니다. (`verify(todoRepository, times(1)).delete(any(Todo.class));`)

---

## 🤔 심화 학습

-   BDD(Behavior-Driven Development) 스타일의 Mockito 구문(`given(...).willReturn(...)`)과 기존 `when(...).thenReturn(...)`의 차이점은 무엇일까요?
-   `@Spy` 어노테이션은 `@Mock`과 어떻게 다른가요? 실제 객체를 사용하면서 일부 메소드만 스터빙하고 싶을 때 어떻게 사용할 수 있을까요?
-   테스트 커버리지(Test Coverage)란 무엇이며, JaCoCo와 같은 도구를 사용하여 어떻게 측정할 수 있을까요?

---

## 📝 7주차 요약

-   **자동화된 테스트 코드**는 코드의 품질을 보증하고, 안정적인 리팩토링을 가능하게 하며, 그 자체로 훌륭한 문서가 된다.
-   **단위 테스트**는 외부 의존성을 모두 **격리**하고, 테스트 대상 클래스나 메소드의 **논리적인 동작**만을 검증하는 테스트이다.
-   **JUnit 5**는 테스트 실행을, **AssertJ**는 결과 검증을, **Mockito**는 가짜 객체(Mock) 생성을 담당한다.
-   `@Mock`으로 가짜 의존성을 만들고, `@InjectMocks`로 테스트 대상에 주입한다.
-   `when(...).thenReturn(...)` 구문을 사용하여 Mock 객체의 행동을 **스터빙(Stubbing)** 할 수 있다.
-   테스트 코드는 **Given-When-Then** 패턴으로 작성하여 가독성을 높이자.
