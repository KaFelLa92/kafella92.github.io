# 3주차: Spring MVC와 요청 처리

**목표:** 스프링 MVC의 동작 원리를 이해하고, 클라이언트(웹 브라우저, 모바일 앱 등)로부터 들어오는 다양한 HTTP 요청을 처리하는 방법을 익힙니다. `@RestController`와 다양한 요청 매핑 어노테이션을 활용하여 웹 애플리케이션의 엔드포인트를 자유자재로 다룰 수 있게 됩니다.

---

## 1. 스프링 웹 MVC 아키텍처

스프링 부트에서 웹 애플리케이션을 개발할 때, 우리는 내부적으로 스프링 MVC 프레임워크를 사용하게 됩니다. 스프링 MVC의 모든 요청은 하나의 "중앙 관제탑"을 통해 처리되는데, 이것이 바로 **`DispatcherServlet`** 입니다.

### 1.1 `DispatcherServlet`의 요청 처리 흐름

클라이언트로부터 요청이 오면 `DispatcherServlet`은 다음과 같은 과정을 거쳐 응답을 반환합니다.

1.  **요청 접수:** 클라이언트의 모든 HTTP 요청을 `DispatcherServlet`이 가장 먼저 받습니다.
2.  **`HandlerMapping`에게 위임:** `DispatcherServlet`은 이 요청을 어떤 컨트롤러가 처리해야 할지 모릅니다. 그래서 `HandlerMapping`에게 물어봅니다. `HandlerMapping`은 요청 URL, HTTP 메소드 등을 보고, 이 요청을 처리할 핸들러(컨트롤러의 메소드)를 찾아 `DispatcherServlet`에게 알려줍니다.
3.  **`HandlerAdapter`에게 위임:** `DispatcherServlet`은 찾은 핸들러를 직접 실행하지 않고, `HandlerAdapter`에게 실행을 위임합니다. `HandlerAdapter`는 컨트롤러 메소드에 필요한 파라미터들을 준비하고, 실제로 메소드를 호출하는 역할을 합니다.
4.  **컨트롤러 메소드 실행:** `HandlerAdapter`에 의해 컨트롤러의 메소드가 실행됩니다. 이 메소드는 비즈니스 로직을 처리하고, 결과를 반환합니다.
5.  **`ModelAndView` 반환:** 컨트롤러는 처리 결과(Model)와 다음에 보여줄 뷰(View)의 이름을 담은 `ModelAndView` 객체를 `DispatcherServlet`에게 반환합니다. (REST API의 경우 `@ResponseBody`가 이 과정을 대신합니다.)
6.  **`ViewResolver`에게 위임:** `DispatcherServlet`은 뷰의 논리적인 이름(e.g., "home")을 `ViewResolver`에게 전달하여, 실제 렌더링할 뷰 객체(e.g., `home.html`, `home.jsp`)를 찾습니다.
7.  **뷰 렌더링 및 응답:** `ViewResolver`가 찾은 뷰 객체가 모델 데이터를 사용하여 최종 응답(HTML, JSON 등)을 생성하고, `DispatcherServlet`은 이 응답을 클라이언트에게 전송합니다.

> **핵심:** 개발자는 `HandlerMapping`, `HandlerAdapter`, `ViewResolver`를 직접 다룰 일이 거의 없습니다. 스프링 부트의 자동 설정 덕분입니다. 우리는 **오직 컨트롤러(Controller) 코드 작성에만 집중**하면 됩니다.

## 2. 컨트롤러와 요청 매핑

### 2.1 `@Controller` vs `@RestController`

-   **`@Controller`**: 주로 **뷰(View)를 반환**하기 위해 사용됩니다. 메소드가 문자열을 반환하면, 스프링 MVC는 그것을 뷰의 이름으로 해석하여 `ViewResolver`를 통해 해당 뷰를 렌더링합니다. (e.g., `return "home";` -> `home.html` 파일을 찾아서 보여줌)

-   **`@RestController`**: `@Controller`와 `@ResponseBody`가 합쳐진 어노테이션입니다. 이 어노테이션이 붙은 컨트롤러의 모든 메소드는 **뷰가 아닌 데이터(주로 JSON)**를 직접 반환합니다. 현대적인 REST API 개발에 사용됩니다.

    ```java
    @RestController // 이 클래스의 모든 메소드는 데이터를 반환합니다.
    public class HelloController {

        @GetMapping("/hello-string")
        public String helloString() {
            return "Hello, World!"; // 문자열 데이터를 그대로 반환
        }

        @GetMapping("/hello-json")
        public HelloData helloJson() {
            return new HelloData("Robbie"); // 객체를 JSON 형태로 자동 변환하여 반환
        }

        public static class HelloData {
            private String name;
            // getter, constructor ...
        }
    }
    ```

### 2.2 요청 매핑 어노테이션

`@RequestMapping`과 그 단축형 어노테이션들은 특정 URL과 HTTP 메소드에 컨트롤러 메소드를 연결(매핑)하는 역할을 합니다.

-   **`@RequestMapping("/hello")`**: 모든 HTTP 메소드(GET, POST, PUT, DELETE 등)의 `/hello` 요청을 처리합니다.

-   **`@GetMapping("/hello")`**: HTTP GET 요청만 처리합니다. (`@RequestMapping(value = "/hello", method = RequestMethod.GET)` 과 동일)
-   **`@PostMapping("/hello")`**: HTTP POST 요청만 처리합니다.
-   **`@PutMapping("/hello")`**: HTTP PUT 요청만 처리합니다.
-   **`@DeleteMapping("/hello")`**: HTTP DELETE 요청만 처리합니다.
-   **`@PatchMapping("/hello")`**: HTTP PATCH 요청만 처리합니다.

> **Best Practice:** 항상 요청의 의도에 맞는 구체적인 매핑 어노테이션(`@GetMapping`, `@PostMapping` 등)을 사용하는 것이 좋습니다.

## 3. HTTP 요청 파라미터 받기

클라이언트가 서버로 보내는 데이터를 컨트롤러에서 받는 방법은 다양합니다.

### 3.1 URL 경로 변수 (Path Variable)

URL 경로 자체에 변수를 포함하여 데이터를 전달하는 방식입니다. 주로 특정 리소스를 식별할 때 사용됩니다. (e.g., `/users/123` -> 123번 유저 조회)

-   **`@PathVariable`** 어노테이션을 사용합니다.

```java
@RestController
@RequestMapping("/users")
public class UserController {

    // GET /users/100
    @GetMapping("/{userId}")
    public String getUserById(@PathVariable Long userId) {
        return "Fetching user with ID: " + userId;
    }

    // GET /users/100/posts/5
    @GetMapping("/{userId}/posts/{postId}")
    public String getUserPost(@PathVariable Long userId, @PathVariable Long postId) {
        return String.format("User %d, Post %d", userId, postId);
    }
}
```

### 3.2 쿼리 파라미터 (Query Parameter)

URL 뒤에 `?key=value&key2=value2` 형식으로 데이터를 전달하는 방식입니다. 주로 정렬, 필터링, 검색 등 부가적인 옵션을 전달할 때 사용됩니다.

-   **`@RequestParam`** 어노테이션을 사용합니다.

```java
@RestController
@RequestMapping("/search")
public class SearchController {

    // GET /search?keyword=spring&page=1
    @GetMapping
    public String search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page) { // 기본값 설정 가능

        return String.format("Keyword: %s, Page: %d", keyword, page);
    }
}
```

### 3.3 HTML Form 데이터 (form-urlencoded)

HTML `<form>` 태그를 통해 `POST` 방식으로 전송되는 데이터를 받는 방법입니다.

-   **`@RequestParam`**: 각 필드를 개별적으로 받을 때 사용합니다.
-   **`@ModelAttribute`**: 여러 필드를 객체(DTO)로 한번에 바인딩하여 받을 때 사용합니다. (`@ModelAttribute`는 생략 가능)

```java
@Controller
public class FormController {

    // 1. @RequestParam 으로 받기
    @PostMapping("/events/param")
    @ResponseBody
    public String createEventWithParam(@RequestParam String name, @RequestParam int maxAttendees) {
        return String.format("Event: %s, Max Attendees: %d", name, maxAttendees);
    }

    // 2. @ModelAttribute 로 받기 (권장)
    @PostMapping("/events/model")
    @ResponseBody
    public String createEventWithModel(@ModelAttribute EventDto eventDto) {
        return String.format("Event: %s, Max Attendees: %d", eventDto.getName(), eventDto.getMaxAttendees());
    }

    // EventDto 클래스 (데이터를 담을 객체)
    public static class EventDto {
        private String name;
        private int maxAttendees;
        // getter, setter ...
    }
}
```

> **참고:** `@ModelAttribute`는 쿼리 파라미터도 객체로 바인딩할 수 있습니다. (e.g., `GET /events/model?name=spring&maxAttendees=10`)

---

## ✏️ 3주차 실습 과제

간단한 **할 일(Todo) 목록 API**의 컨트롤러를 작성해봅니다. (아직 데이터베이스 연동은 하지 않고, 메모리에 임시로 데이터를 저장하거나 단순히 요청을 받았다는 문자열만 반환합니다.)

1.  **`TodoController` 클래스 생성**
    -   `@RestController` 어노테이션을 붙입니다.
    -   클래스 레벨에 `@RequestMapping("/todos")`를 붙여 모든 메소드의 기본 경로를 `/todos`로 설정합니다.

2.  **전체 할 일 목록 조회 API**
    -   **URL:** `GET /todos`
    -   **메소드:** `getTodos()`
    -   **기능:** "전체 할 일 목록을 조회합니다." 라는 문자열을 반환합니다.

3.  **특정 할 일 상세 조회 API**
    -   **URL:** `GET /todos/{todoId}`
    -   **메소드:** `getTodoById()`
    -   **기능:** `@PathVariable`을 사용하여 `todoId`를 받고, "{todoId}번 할 일을 조회합니다." 라는 문자열을 반환합니다.

4.  **할 일 검색 API**
    -   **URL:** `GET /todos/search`
    -   **메소드:** `searchTodos()`
    -   **기능:** `@RequestParam`을 사용하여 `keyword` (검색어, 필수)와 `completed` (완료 여부, 선택) 파라미터를 받습니다. "키워드: {keyword}, 완료여부: {completed} 로 할 일을 검색합니다." 라는 문자열을 반환합니다.

5.  **할 일 생성 API**
    -   **URL:** `POST /todos`
    -   **메소드:** `createTodo()`
    -   **기능:** `TodoCreateDto` (필드: `title`, `content`) 클래스를 만들고, `@ModelAttribute`를 사용하여 Form 데이터를 DTO로 받습니다. "제목: {title}, 내용: {content} 할 일을 생성합니다." 라는 문자열을 반환합니다.
    -   Postman과 같은 API 테스트 도구를 사용하여 `x-www-form-urlencoded` 형식으로 요청을 보내 테스트합니다.

---

## 🤔 심화 학습

-   `@RequestMapping`의 `produces`와 `consumes` 속성은 각각 어떤 역할을 할까요?
-   `@RestControllerAdvice`와 `@ExceptionHandler`는 어떻게 사용될까요? (4주차 예고)
-   HTTP 요청의 전체 헤더(Header) 정보나 쿠키(Cookie)는 어떻게 읽어올 수 있을까요? (`@RequestHeader`, `@CookieValue`)

---

## 📝 3주차 요약

-   스프링 MVC의 모든 요청은 **`DispatcherServlet`** 을 통해 중앙에서 관리된다.
-   `@RestController`는 REST API 개발 시 사용하며, 메소드의 반환 값을 **데이터(JSON) 형태로** 클라이언트에게 직접 전달한다.
-   `@GetMapping`, `@PostMapping` 등 HTTP 메소드에 특화된 어노테이션을 사용하여 요청을 명확하게 매핑하자.
-   URL 경로의 값은 `@PathVariable`로, 쿼리스트링이나 Form 데이터는 `@RequestParam` 또는 `@ModelAttribute`를 사용하여 받는다.
-   단순 파라미터가 여러 개일 경우, **DTO(Data Transfer Object)와 `@ModelAttribute`를 사용**하여 객체로 받는 것이 효율적이다.
