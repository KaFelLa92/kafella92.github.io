# 8주차: 통합 테스트 (Integration Test)

**목표:** 단위 테스트를 넘어, 여러 컴포넌트(컨트롤러, 서비스, 리포지토리 등)를 함께 묶어 실제 애플리케이션의 동작을 검증하는 통합 테스트 방법을 배웁니다. 스프링 부트가 제공하는 강력한 테스트 지원 기능인 `@SpringBootTest`와 테스트 슬라이스(`@WebMvcTest`, `@DataJpaTest`)를 활용하여 효율적인 통합 테스트를 작성하는 기술을 익힙니다.

---

## 1. 통합 테스트란?

**통합 테스트(Integration Test)** 는 단위 테스트에서 격리했던 외부 의존성(다른 클래스, 데이터베이스, 메시지 큐 등)을 실제로 연결하여, 여러 컴포넌트가 함께 동작하는 전체 흐름을 테스트하는 것입니다.

-   **단위 테스트:** `TodoService`를 테스트하기 위해 `TodoRepository`를 가짜(Mock)로 만들었다.
-   **통합 테스트:** `TodoController`, `TodoService`, `TodoRepository`를 모두 실제 스프링 컨테이너에 빈으로 등록하고, 컨트롤러에 HTTP 요청을 보냈을 때 데이터베이스까지 모든 과정이 올바르게 동작하는지 검증한다.

### 1.1 통합 테스트의 장단점

-   **장점:**
    -   **높은 신뢰도:** 실제 운영 환경과 유사한 조건에서 테스트하므로, 단위 테스트보다 훨씬 높은 신뢰도를 가집니다. 전체 흐름의 안정성을 보장합니다.
    -   **컴포넌트 간 상호작용 검증:** 각 컴포넌트의 연결 지점(인터페이스, 데이터 형식 등)에서 발생할 수 있는 문제를 발견할 수 있습니다.

-   **단점:**
    -   **느린 속도:** 실제 스프링 컨테이너를 구동하고, 데이터베이스에 접근하는 등 무거운 작업이 많아 단위 테스트보다 훨씬 느립니다.
    -   **복잡한 설정:** 테스트 환경을 구성하기가 복잡하고, 테스트 간 데이터 격리가 어려워 잘못하면 서로 영향을 줄 수 있습니다.
    -   **오류 원인 파악의 어려움:** 테스트가 실패했을 때, 어느 컴포넌트에서 문제가 발생했는지 즉시 파악하기 어렵습니다.

> **테스트 전략:** 실행 속도가 빠르고 격리 수준이 높은 **단위 테스트를 주력**으로 작성하여 코드 커버리지를 높이고, 핵심적인 전체 흐름에 대해서만 **통합 테스트를 작성**하여 안정성을 보완하는 것이 효율적입니다.

## 2. `@SpringBootTest`: 만능 통합 테스트

`@SpringBootTest`는 스프링 부트의 모든 설정(`@Configuration`, `@Component` 등)을 다 읽어와서, 실제 애플리케이션과 거의 동일한 **전체 스프링 컨테이너를 띄워서 테스트**하는 가장 강력한 통합 테스트 어노테이션입니다.

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {

    @Autowired
    private TodoService todoService;

    @Test
    void contextLoads() {
        // 이 테스트가 성공하면, 스프링 컨테이너가 정상적으로 구동되었음을 의미한다.
        assertThat(todoService).isNotNull();
    }
}
```

### 2.1 `@Transactional`을 이용한 데이터 롤백

통합 테스트에서 가장 큰 골칫거리는 데이터베이스 상태 관리입니다. 테스트마다 DB를 초기화하지 않으면, 한 테스트에서 생성한 데이터가 다른 테스트에 영향을 미칠 수 있습니다.

스프링 테스트 컨텍스트는 이 문제를 해결하기 위해, 테스트 케이스에 `@Transactional` 어노테이션이 붙어 있으면 **테스트가 끝난 후 모든 데이터베이스 작업을 자동으로 롤백(Rollback)** 해줍니다.

```java
@SpringBootTest
@Transactional // ✨ 이 어노테이션 하나로 테스트 후 DB가 자동으로 원상 복구된다.
public class TodoServiceIntegrationTest {

    @Autowired
    private TodoService todoService;

    @Autowired
    private TodoRepository todoRepository;

    @Test
    @DisplayName("할 일 생성 통합 테스트")
    void createTodo() {
        // when
        Long createdId = todoService.createTodo("새로운 할일", "내용");

        // then
        // DB에 정말 저장되었는지 Repository를 통해 직접 확인
        Optional<Todo> foundTodo = todoRepository.findById(createdId);
        assertThat(foundTodo).isPresent();
        assertThat(foundTodo.get().getTitle()).isEqualTo("새로운 할일");
    } // 테스트 종료 시 @Transactional에 의해 롤백됨
}
```

## 3. 테스트 슬라이스 (Test Slices)

`@SpringBootTest`는 강력하지만, 모든 빈을 다 로드하기 때문에 너무 무겁고 느립니다. 대부분의 경우, 우리는 특정 계층(Web, Data 등)만 테스트하고 싶을 때가 많습니다. **테스트 슬라이스**는 이러한 요구에 맞춰, **특정 계층과 관련된 빈들만 로드**하여 테스트를 가볍게 만들어주는 기능입니다.

### 3.1 `@WebMvcTest`: 웹(Controller) 계층 테스트

`@WebMvcTest`는 웹 계층, 즉 컨트롤러를 테스트하는 데 최적화된 슬라이스 테스트입니다.

-   `@Controller`, `@RestController`, `@ControllerAdvice` 등 웹과 관련된 빈들만 로드합니다.
-   `@Service`, `@Repository` 등은 로드하지 않으므로, 이들은 **`@MockBean`을 사용하여 가짜 객체로 대체**해야 합니다.
-   **`MockMvc`** 라는 테스트용 HTTP 클라이언트를 자동으로 설정해주어, 실제 네트워크 요청 없이 컨트롤러를 테스트할 수 있습니다.

```java
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoApiController.class) // 테스트할 컨트롤러를 지정
public class TodoApiControllerTest {

    @Autowired
    private MockMvc mockMvc; // 컨트롤러 테스트를 위한 Mock HTTP 클라이언트

    @MockBean // @Service는 로드되지 않으므로 가짜 객체로 대체
    private TodoService todoService;

    @Autowired
    private ObjectMapper objectMapper; // JSON <-> 객체 변환용

    @Test
    @DisplayName("GET /api/todos/{id} - 성공")
    void getTodoById_success() throws Exception {
        // given
        Long todoId = 1L;
        TodoResponse responseDto = new TodoResponse(todoId, "테스트", "내용", false);
        when(todoService.findTodoDtoById(todoId)).thenReturn(responseDto);

        // when & then
        mockMvc.perform(get("/api/todos/{id}", todoId)) // GET 요청 보내기
                .andExpect(status().isOk()) // HTTP 상태 코드가 200 OK 인지 검증
                .andExpect(jsonPath("$.id").value(todoId)) // JSON 응답의 id 필드 검증
                .andExpect(jsonPath("$.title").value("테스트")); // title 필드 검증
    }

    @Test
    @DisplayName("POST /api/todos - 성공")
    void createTodo_success() throws Exception {
        // given
        TodoCreateRequest requestDto = new TodoCreateRequest("새 할일", "내용");
        when(todoService.createTodo(any(TodoCreateRequest.class))).thenReturn(1L);

        // when & then
        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON) // 요청의 Content-Type 지정
                        .content(objectMapper.writeValueAsString(requestDto))) // 요청 본문에 JSON 데이터 담기
                .andExpect(status().isCreated()) // HTTP 201 Created 검증
                .andExpect(header().exists("Location")); // 응답 헤더에 Location이 있는지 검증
    }
}
```

### 3.2 `@DataJpaTest`: 데이터(Repository) 계층 테스트

`@DataJpaTest`는 JPA 리포지토리를 테스트하는 데 최적화된 슬라이스 테스트입니다.

-   JPA 관련 설정(`DataSource`, `EntityManager` 등)과 `@Repository` 빈들만 로드합니다.
-   `@Service`, `@Controller` 등은 로드하지 않습니다.
-   기본적으로 **내장 데이터베이스(보통 H2)** 를 사용하여 테스트를 실행합니다.
-   `@Transactional` 기능이 내장되어 있어, 각 테스트가 끝나면 자동으로 롤백됩니다.
-   **`TestEntityManager`** 를 제공하여 테스트 데이터를 준비하는 데 도움을 줍니다.

```java
@DataJpaTest
public class TodoRepositoryTest {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    @Test
    @DisplayName("Todo 저장 및 조회 테스트")
    void saveAndFind() {
        // given
        Todo newTodo = new Todo("새 할일", "내용");

        // when
        Todo savedTodo = todoRepository.save(newTodo);

        // then
        Optional<Todo> foundTodo = todoRepository.findById(savedTodo.getId());
        assertThat(foundTodo).isPresent();
        assertThat(foundTodo.get().getTitle()).isEqualTo("새 할일");
    }

    @Test
    @DisplayName("findByCompleted 쿼리 메소드 테스트")
    void findByCompleted() {
        // given
        testEntityManager.persist(new Todo("할일1", "내용1", true));
        testEntityManager.persist(new Todo("할일2", "내용2", false));
        testEntityManager.persist(new Todo("할일3", "내용3", true));

        // when
        List<Todo> completedTodos = todoRepository.findByCompleted(true);

        // then
        assertThat(completedTodos).hasSize(2);
    }
}
```

## 4. 어떤 테스트를 선택해야 할까?

-   **`@SpringBootTest`**: 전체 애플리케이션의 흐름을 검증해야 하는 **핵심 시나리오**에 사용합니다. (e.g., 주문 생성부터 결제까지) 너무 남발하면 테스트 스위트가 매우 느려집니다.
-   **`@WebMvcTest`**: 컨트롤러의 요청/응답 매핑, 파라미터 바인딩, 유효성 검사, JSON 직렬화/역직렬화 등을 테스트하는 데 집중합니다. **서비스 로직은 Mocking**합니다.
-   **`@DataJpaTest`**: 리포지토리의 쿼리 메소드나 `@Query`로 작성한 JPQL이 올바르게 동작하는지 검증하는 데 집중합니다.
-   **단위 테스트 (Mockito만 사용)**: 서비스 계층의 복잡한 비즈니스 로직, 조건문, 반복문 등을 테스트하는 데 집중합니다.

> **Best Practice:** 대부분의 코드는 **단위 테스트**로 커버하고, 각 계층의 연결 부위는 **슬라이스 테스트**(`@WebMvcTest`, `@DataJpaTest`)로 검증하며, 정말 중요한 전체 시나리오만 **`@SpringBootTest`** 로 확인하는 것이 가장 효율적이고 안정적인 테스트 전략입니다.

---

## ✏️ 8주차 실습 과제

7주차에 만든 단위 테스트에 더하여, 통합 테스트와 슬라이스 테스트를 작성합니다.

1.  **`@DataJpaTest`로 `TodoRepository` 테스트**
    -   `src/test/java` 아래에 `repository` 패키지를 만들고 `TodoRepositoryTest` 클래스를 생성합니다.
    -   `@DataJpaTest` 어노테이션을 붙입니다.
    -   `save()` 메소드가 정상 동작하는지 테스트합니다.
    -   6주차에 만들었던 커스텀 쿼리 메소드(`findByCompleted...`, `findByTitleContaining...` 등)가 의도대로 동작하는지 테스트합니다. `TestEntityManager`나 `todoRepository.save()`를 사용하여 테스트 데이터를 미리 준비하세요.

2.  **`@WebMvcTest`로 `TodoApiController` 테스트**
    -   `src/test/java` 아래에 `controller` 패키지를 만들고 `TodoApiControllerTest` 클래스를 생성합니다.
    -   `@WebMvcTest(TodoApiController.class)` 어노테이션을 붙입니다.
    -   `TodoService`는 `@MockBean`으로 등록합니다.
    -   `MockMvc`를 사용하여 다음 API들이 정상 동작하는지 테스트합니다.
        -   `GET /api/todos/{id}`: 성공 케이스(200 OK), 실패 케이스(404 Not Found)
        -   `POST /api/todos`: 성공 케이스(201 Created), 실패 케이스(400 Bad Request - 유효성 검사 실패 등)
    -   `jsonPath()`를 사용하여 응답 JSON의 값을 상세하게 검증해보세요.

3.  **`@SpringBootTest`로 서비스 통합 테스트 (선택 사항)**
    -   `TodoService`의 핵심적인 기능(e.g., 생성 후 바로 조회)이 실제 DB와 연동하여 잘 동작하는지 `@SpringBootTest`와 `@Transactional`을 사용하여 테스트 코드를 작성해보세요.

---

## 🤔 심화 학습

-   `@ActiveProfiles("test")` 어노테이션은 언제 사용할까요? 테스트 환경에서만 다른 설정(`application-test.yml`)을 사용하고 싶을 때 어떻게 적용할 수 있을까요?
-   `@AutoConfigureMockMvc`와 `@SpringBootTest`를 함께 사용하면 어떤 장점이 있을까요?
-   Testcontainers 라이브러리는 통합 테스트에서 어떤 문제를 해결해주며, 실제 DB(MySQL, PostgreSQL 등)를 Docker 컨테이너로 띄워 테스트하는 방법은 무엇일까요?

---

## 📝 8주차 요약

-   **통합 테스트**는 여러 컴포넌트를 함께 묶어 실제 동작을 검증하여 높은 신뢰도를 제공하지만, 속도가 느리고 복잡하다.
-   **`@SpringBootTest`** 는 전체 스프링 컨테이너를 로드하여 실제 애플리케이션과 가장 유사한 환경에서 테스트한다.
-   테스트에서 **`@Transactional`** 은 테스트 종료 후 데이터베이스 상태를 자동으로 롤백하여 테스트 간 독립성을 보장해준다.
-   **테스트 슬라이스**는 특정 계층만 테스트하여 통합 테스트를 더 가볍고 빠르게 만들어준다.
-   **`@WebMvcTest`** 는 컨트롤러 계층을, **`@DataJpaTest`** 는 데이터 접근 계층(Repository)을 테스트하는 데 사용된다.
-   효율적인 테스트 전략은 **단위 테스트를 기본**으로 하고, **슬라이스 테스트**와 **통합 테스트**를 보조적으로 활용하는 것이다.
