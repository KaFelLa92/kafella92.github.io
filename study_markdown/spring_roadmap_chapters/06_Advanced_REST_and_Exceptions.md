# 6장: RESTful API 심화와 예외 처리

잘 설계된 API는 협업의 효율성을 높이고 안정적인 서비스를 만드는 기반이 됩니다. RESTful API 설계 원칙을 더 깊이 이해하고, 애플리케이션 전역에서 발생하는 다양한 예외(Exception)를 일관되고 우아하게 처리하는 방법을 학습합니다.

---

## 1. 핵심 개념

- **REST (Representational State Transfer)**: 웹의 자원을 이름으로 구분하여 해당 자원의 상태를 주고받는 모든 것을 의미하는 아키텍처 스타일입니다.
- **RESTful API**: REST 아키텍처의 원칙을 잘 지켜서 설계된 API를 의미합니다. (자원(URI), 행위(HTTP Method), 표현(Representation)의 특징을 가집니다.)
- **예외 처리(Exception Handling)**: 프로그램 실행 중 발생할 수 있는 오류에 대비하고, 오류가 발생했을 때 프로그램이 비정상적으로 종료되지 않고 정상적인 흐름을 유지하도록 처리하는 과정입니다.
- **@RestControllerAdvice**: 애플리케이션 전역에서 발생하는 예외를 한 곳에서 처리할 수 있게 해주는 어노테이션입니다. `@ControllerAdvice`와 `@ResponseBody`가 합쳐진 형태입니다.
- **@ExceptionHandler**: 특정 예외가 발생했을 때 실행될 메소드를 지정하는 어노테이션입니다.

---

## 2. 예제 코드

전역 예외 처리기를 만들어 다양한 예외 상황에 대응해봅시다.

```java
// GlobalExceptionHandler.java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 유효성 검사 실패 시 발생하는 예외 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // 에러 메시지를 하나로 합치기
        String errorMessage = ex.getBindingResult()
                                .getAllErrors()
                                .get(0)
                                .getDefaultMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    // 개발자가 직접 정의한 예외 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<String> handleCustomException(CustomException ex) {
        return ResponseEntity.status(ex.getErrorCode().getStatus()).body(ex.getErrorCode().getMessage());
    }

    // 그 외 모든 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 내부 오류가 발생했습니다.");
    }
}
```

---

## 3. 직접 풀 문제

1. `IllegalArgumentException`이 발생했을 때, HTTP 상태 코드 400 (Bad Request)와 함께 "잘못된 파라미터입니다." 라는 메시지를 반환하는 `@ExceptionHandler`를 `GlobalExceptionHandler`에 추가해보세요.
2. 게시글을 찾지 못했을 때(`null` 반환) `throw new CustomException(ErrorCode.POST_NOT_FOUND)` 와 같이 직접 만든 예외를 발생시키도록 `BoardService`의 `boardFind` 메소드를 수정해보세요. (이를 위해 `CustomException`과 `ErrorCode` Enum 클래스 생성이 필요합니다.)
