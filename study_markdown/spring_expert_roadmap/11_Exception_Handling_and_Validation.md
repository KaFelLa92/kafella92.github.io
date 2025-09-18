# 11주차: 예외 처리 및 유효성 검사

**목표:** 애플리케이션의 안정성과 사용자 경험을 향상시키기 위한 두 가지 중요한 기술을 배웁니다. `@RestControllerAdvice`를 사용하여 여러 컨트롤러에서 발생하는 예외를 한 곳에서 공통으로 처리하는 방법을 익히고, Jakarta Bean Validation(과거 JavaX Validation)을 활용하여 API 요청 데이터의 유효성을 선언적으로 검증하는 기술을 학습합니다.

---

## 1. 전역 예외 처리 (Global Exception Handling)

지금까지 우리는 서비스나 컨트롤러에서 예외가 발생하면, 톰캣이 제공하는 기본 오류 페이지(Whitelabel Error Page)나 알아보기 힘든 JSON 오류 응답을 받았습니다. 이는 사용자 친화적이지도 않고, 어떤 문제가 발생했는지 파악하기도 어렵습니다.

```java
// 컨트롤러마다 try-catch를 사용하는 방식의 문제점
@RestController
public class TodoController {
    @GetMapping("/todos/{id}")
    public ResponseEntity<TodoResponse> getTodo(@PathVariable Long id) {
        try {
            Todo todo = todoService.findById(id);
            return ResponseEntity.ok(new TodoResponse(todo));
        } catch (IllegalArgumentException e) {
            // 이런 코드가 모든 컨트롤러, 모든 메소드에 중복된다.
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
```

### 1.1 `@RestControllerAdvice`와 `@ExceptionHandler`

Spring은 AOP를 기반으로, 여러 컨트롤러에서 발생하는 예외를 한 곳에서 처리할 수 있는 `@RestControllerAdvice` (또는 `@ControllerAdvice`) 어노테이션을 제공합니다.

-   **`@RestControllerAdvice`**: `@ControllerAdvice`와 `@ResponseBody`가 합쳐진 어노테이션. API 서버 환경에서 예외 처리 결과를 JSON 형태로 반환할 때 사용합니다.
-   **`@ExceptionHandler(Exception.class)`**: 이 어노테이션이 붙은 메소드는 지정된 `Exception` 클래스(및 그 자식 클래스들)가 발생했을 때 호출됩니다.

이제 컨트롤러 전역에 흩어져 있던 예외 처리 로직을 하나의 클래스로 모을 수 있습니다.

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// 이 클래스가 모든 @RestController에서 발생하는 예외를 처리함을 선언
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 직접 만든 커스텀 예외 처리
    @ExceptionHandler(TodoNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleTodoNotFoundException(TodoNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    // 일반적인 비즈니스 로직 예외 처리
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // 처리하지 못한 나머지 모든 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred");
        // 실제 운영 환경에서는 로그를 남기는 것이 매우 중요합니다.
        // log.error("Unhandled exception: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    // 공통으로 사용할 에러 응답 DTO
    public static class ErrorResponse {
        private int status;
        private String message;
        // 생성자, getter
    }
}
```

이제 서비스 계층에서는 비즈니스 상황에 맞는 예외를 던지기만 하면 됩니다. 컨트롤러는 더 이상 `try-catch` 블록으로 지저분해지지 않습니다.

```java
@Service
public class TodoService {
    public Todo findById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException("Todo not found with id: " + id));
    }
}

@RestController
public class TodoController {
    @GetMapping("/todos/{id}")
    public ResponseEntity<TodoResponse> getTodo(@PathVariable Long id) {
        // 예외 처리 로직이 사라지고 코드가 깔끔해졌다.
        Todo todo = todoService.findById(id);
        return ResponseEntity.ok(new TodoResponse(todo));
    }
}
```

## 2. 요청 데이터 유효성 검사 (Validation)

API 서버는 클라이언트로부터 들어오는 데이터가 항상 올바를 것이라고 가정해서는 안 됩니다. 제목이 비어 있거나, 이메일 형식이 아니거나, 나이가 음수인 데이터를 걸러내지 못하면 데이터베이스에 잘못된 값이 저장되거나 심각한 오류가 발생할 수 있습니다.

```java
// 서비스 계층에서 유효성 검사를 하는 방식의 문제점
@Service
public class MemberService {
    public void signup(SignUpRequest request) {
        if (request.getEmail() == null || !request.getEmail().contains("@")) {
            throw new IllegalArgumentException("이메일 형식이 올바르지 않습니다.");
        }
        if (request.getPassword().length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다.");
        }
        // ... 이런 코드가 계속 반복된다.
    }
}
```

### 2.1 Jakarta Bean Validation

Spring Boot는 `spring-boot-starter-validation` 의존성을 통해 Jakarta Bean Validation(과거 JavaX Validation)을 지원합니다. 이를 통해 DTO 필드에 **어노테이션을 붙이는 것만으로** 유효성 검사 규칙을 선언적으로 정의할 수 있습니다.

-   `@NotNull`: `null`을 허용하지 않음
-   `@NotEmpty`: `null`과 빈 문자열(`""`)을 허용하지 않음 (문자열, 컬렉션 등에 사용)
-   `@NotBlank`: `null`, 빈 문자열, 공백만 있는 문자열을 허용하지 않음 (문자열에 사용)
-   `@Size(min=, max=)`: 문자열 길이, 컬렉션 크기를 제한
-   `@Min(value)`, `@Max(value)`: 숫자 최솟값, 최댓값 제한
-   `@Email`: 이메일 형식이어야 함
-   `@Pattern(regexp=)`: 정규식 패턴을 만족해야 함

### 2.2 `@Valid`와 `@Validated`

컨트롤러 메소드의 DTO 파라미터 앞에 `@Valid` (또는 `@Validated`) 어노테이션을 붙이면, 스프링이 해당 DTO에 정의된 유효성 검사 규칙을 자동으로 검증해줍니다.

만약 유효성 검사에 실패하면, `MethodArgumentNotValidException`이 발생하고, 우리가 만든 `@RestControllerAdvice`에서 이 예외를 잡아 처리할 수 있습니다.

```java
// 1. Request DTO에 유효성 검사 어노테이션 추가
public class TodoCreateRequest {
    @NotBlank(message = "제목은 필수 입력 항목입니다.")
    @Size(max = 100, message = "제목은 100자를 넘을 수 없습니다.")
    private String title;

    private String content;
}

// 2. Controller에서 @Valid로 검증 활성화
@RestController
public class TodoController {
    @PostMapping("/todos")
    public ResponseEntity<Void> createTodo(@Valid @RequestBody TodoCreateRequest request) {
        // 유효성 검사를 통과한 경우에만 이 로직이 실행된다.
        todoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}

// 3. GlobalExceptionHandler에 예외 처리 로직 추가
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        // 유효성 검사 실패 시, 어떤 필드가 어떤 이유로 실패했는지 상세한 정보를 만들 수 있다.
        BindingResult bindingResult = ex.getBindingResult();
        String errorMessage = bindingResult.getFieldError().getDefaultMessage();

        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), errorMessage);
        return ResponseEntity.badRequest().body(errorResponse);
    }
    // ... 다른 예외 처리기들 ...
}
```

이제 서비스 계층은 유효성 검사 로직으로부터 완전히 해방되어, 순수한 비즈니스 로직에만 집중할 수 있습니다. **컨트롤러는 외부 세계와의 관문**이므로, 유효성 검사와 같은 "문지기" 역할은 컨트롤러 계층에서 처리하는 것이 가장 이상적인 아키텍처입니다.

---

## ✏️ 11주차 실습 과제

기존의 **할 일(Todo) 애플리케이션**에 전역 예외 처리와 유효성 검사를 적용합니다.

1.  **`GlobalExceptionHandler` 클래스 생성**
    -   `@RestControllerAdvice` 어노테이션을 붙입니다.
    -   공통으로 사용할 `ErrorResponse` DTO를 내부 클래스 또는 별도 파일로 정의합니다.
    -   `TodoNotFoundException` (직접 만들 커스텀 예외), `IllegalArgumentException`, `MethodArgumentNotValidException`을 처리하는 `@ExceptionHandler` 메소드를 각각 구현합니다.

2.  **서비스 계층 수정**
    -   `TodoService`에서 ID로 조회 시 할 일이 없으면, `IllegalArgumentException` 대신 직접 만든 `TodoNotFoundException`을 던지도록 수정합니다.

3.  **DTO에 유효성 검사 추가**
    -   `spring-boot-starter-validation` 의존성이 있는지 확인합니다.
    -   `TodoCreateRequest`와 `TodoUpdateRequest` DTO의 `title` 필드에 `@NotBlank`와 `@Size` 어노테이션을 추가하여 유효성 검사 규칙을 정의합니다. (메시지도 직접 작성해보세요.)

4.  **컨트롤러 계층 수정**
    -   `TodoApiController`의 `createTodo`, `updateTodo` 메소드에서 요청 DTO를 받는 파라미터 앞에 `@Valid` 어노테이션을 추가합니다.
    -   컨트롤러 내부에 있던 모든 `try-catch` 블록을 제거합니다.

5.  **Postman으로 테스트**
    -   존재하지 않는 ID로 할 일을 조회하여 `404 Not Found`와 함께 `GlobalExceptionHandler`에서 정의한 JSON 응답이 오는지 확인합니다.
    -   할 일을 생성/수정할 때, 제목을 비우거나 너무 길게 입력하여 `400 Bad Request`와 함께 DTO에 설정한 유효성 검사 메시지가 정상적으로 반환되는지 확인합니다.

---

## 🤔 심화 학습

-   `@Valid`와 `@Validated`의 차이점은 무엇일까요? (유효성 검사 그룹 기능)
-   여러 필드를 조합하여 검증해야 하는 경우(e.g., 비밀번호와 비밀번호 확인 필드가 일치하는지)는 어떻게 커스텀 유효성 검사 어노테이션을 만들어 해결할 수 있을까요?
-   `@ControllerAdvice`의 `basePackages` 속성은 어떤 용도로 사용될까요?

---

## 📝 11주차 요약

-   **`@RestControllerAdvice`** 와 **`@ExceptionHandler`** 를 사용하면, 여러 컨트롤러에 흩어져 있는 예외 처리 코드를 한 곳으로 모아 **전역적으로 관리**할 수 있다.
-   이를 통해 컨트롤러는 예외 처리 로직에서 벗어나 비즈니스 로직 호출에만 집중할 수 있고, 서비스 계층은 상황에 맞는 예외를 던지는 책임만 가지게 된다.
-   **Jakarta Bean Validation**과 **`@Valid`** 어노테이션을 사용하면, DTO에 선언적인 방식으로 유효성 검사 규칙을 정의하고 컨트롤러 진입 단계에서 자동으로 검증할 수 있다.
-   **유효성 검사는 외부와 맞닿아 있는 컨트롤러 계층의 책임**으로 두는 것이 아키텍처상 바람직하다.
-   전역 예외 처리와 유효성 검사를 통해 애플리케이션의 안정성과 코드의 유지보수성을 크게 향상시킬 수 있다.
