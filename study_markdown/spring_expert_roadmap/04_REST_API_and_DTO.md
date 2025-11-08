# 4주차: REST API와 DTO

**목표:** 현대적인 웹 애플리케이션의 표준 아키텍처인 REST(Representational State Transfer)를 이해합니다. `@RequestBody`를 통해 JSON 데이터를 서버에서 받는 방법을 배우고, 계층 간 데이터 전송을 위한 객체인 DTO(Data Transfer Object)의 필요성과 올바른 사용법을 익힙니다.

---

## 1. REST 아키텍처의 이해

REST는 웹의 창시자 중 한 명인 로이 필딩이 제안한, 분산 하이퍼미디어 시스템(웹과 같은)을 위한 아키텍처 스타일입니다. 쉽게 말해, **"웹의 장점을 최대한 활용할 수 있는 아키텍처의 모범 답안"** 이라고 할 수 있습니다.

### 1.1 REST의 핵심 원칙

1.  **자원 (Resource):** 모든 것을 **자원**으로 정의합니다. 예를 들어, `회원`, `게시글`, `주문` 등이 모두 자원입니다. 각 자원은 고유한 식별자(URI)를 가집니다.
    -   `/users/1` : 1번 회원
    -   `/posts/100` : 100번 게시글

2.  **행위 (Verb):** 자원에 대한 행위는 **HTTP 메소드(Verb)** 로 표현합니다. URL에 행위를 나타내는 동사(e.g., `getUsers`, `createPost`)를 사용하지 않습니다.
    -   **GET**: 자원 조회
    -   **POST**: 자원 생성
    -   **PUT**: 자원 전체 수정
    -   **PATCH**: 자원 일부 수정
    -   **DELETE**: 자원 삭제

    | 자원 (URI) | GET | POST | PUT | DELETE |
    | :--- | :--- | :--- | :--- | :--- |
    | `/posts` | 모든 게시글 조회 | 새 게시글 생성 | (X) | (X) |
    | `/posts/123` | 123번 게시글 조회 | (X) | 123번 게시글 수정 | 123번 게시글 삭제 |

3.  **표현 (Representation):** 클라이언트와 서버는 자원을 **표현**의 형태로 주고받습니다. 가장 널리 사용되는 표현 형태가 바로 **JSON(JavaScript Object Notation)** 입니다.

4.  **무상태성 (Stateless):** 서버는 클라이언트의 상태를 저장하지 않습니다. 각 요청은 독립적으로 처리되어야 하며, 필요한 모든 정보를 요청 자체에 포함해야 합니다. (e.g., 인증을 위한 JWT 토큰)

### 1.2 RESTful API

위와 같은 REST 아키텍처의 원칙을 잘 지켜서 설계된 API를 **RESTful API**라고 부릅니다. RESTful API는 그 자체로 이해하기 쉽고, 확장성이 뛰어나며, 클라이언트-서버 구조를 명확하게 분리해줍니다.

## 2. JSON 데이터 처리

3주차에서는 HTML Form 데이터를 `@ModelAttribute`로 받았습니다. 하지만 현대적인 API는 대부분 클라이언트(React, Vue, Angular, 모바일 앱 등)와 서버가 **JSON** 형식으로 데이터를 주고받습니다.

### 2.1 `@RequestBody`: JSON을 자바 객체로

클라이언트가 보낸 HTTP 요청의 본문(Body)에 담긴 JSON 데이터를 자바 객체로 변환(역직렬화, Deserialize)해주는 어노테이션입니다.

-   클라이언트는 요청 시 `Content-Type` 헤더를 `application/json`으로 지정해야 합니다.
-   스프링 부트는 내부적으로 `Jackson`이라는 라이브러리를 사용하여 JSON <-> 자바 객체 변환을 자동으로 처리합니다.

```java
@RestController
@RequestMapping("/api/posts")
public class PostApiController {

    // POST /api/posts
    // Request Body (JSON):
    // {
    //   "title": "새로운 게시글",
    //   "content": "게시글 내용입니다.",
    //   "author": "robbie"
    // }
    @PostMapping
    public String createPost(@RequestBody PostCreateRequest request) {
        // Jackson 라이브러리가 JSON을 PostCreateRequest 객체로 자동 변환해준다.
        return String.format("Title: %s, Content: %s, Author: %s",
                request.getTitle(), request.getContent(), request.getAuthor());
    }

    // JSON 데이터를 받을 DTO
    public static class PostCreateRequest {
        private String title;
        private String content;
        private String author;
        // getter, setter or Lombok @Getter, @Setter
    }
}
```

> **`@ModelAttribute` vs `@RequestBody`**
> - `@ModelAttribute`: `form-urlencoded` 또는 `multipart/form-data` 형식의 데이터를 처리. 쿼리 파라미터도 바인딩 가능. **각 필드를 개별적으로 매핑.**
> - `@RequestBody`: `application/json` 형식의 데이터를 처리. 요청 본문 전체를 **하나의 객체로 통째로 매핑.** 한 메소드에 한번만 사용 가능.

### 2.2 `@ResponseBody`와 `ResponseEntity`

-   **`@ResponseBody`**: `@RestController`에 이미 포함되어 있으며, 자바 객체를 JSON 데이터로 변환(직렬화, Serialize)하여 HTTP 응답 본문에 담아주는 역할을 합니다.

-   **`ResponseEntity<T>`**: `@ResponseBody`의 기능을 포함하며, 추가적으로 **HTTP 상태 코드(Status Code)와 헤더(Header)를 직접 제어**할 수 있는 클래스입니다. API 응답을 더 세밀하게 제어하고 싶을 때 사용합니다.

```java
@RestController
@RequestMapping("/api/users")
public class UserApiController {

    // 1. 객체만 반환 (상태 코드: 200 OK 고정)
    @GetMapping("/{userId}")
    public UserResponse getUser(@PathVariable Long userId) {
        // ... userId로 유저 조회 로직 ...
        if (userNotFound) {
            // 이런 경우 처리가 곤란하다.
        }
        return new UserResponse("robbie", "robbie@example.com");
    }

    // 2. ResponseEntity 사용 (상태 코드 동적 제어)
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserCreateRequest request) {
        // ... 유저 생성 로직 ...
        UserResponse responseBody = new UserResponse("newUser", request.getEmail());

        // HTTP 상태 코드 201 Created 와 함께 응답 본문에 데이터를 담아 반환
        return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
    }

    @GetMapping("/search")
    public ResponseEntity<UserResponse> searchUser(@RequestParam String email) {
        // ... 유저 검색 로직 ...
        User user = userService.findByEmail(email);

        if (user == null) {
            // 유저가 없으면 404 Not Found 상태 코드 반환
            return ResponseEntity.notFound().build();
        }

        // 유저가 있으면 200 OK 와 함께 데이터 반환
        return ResponseEntity.ok(new UserResponse(user.getName(), user.getEmail()));
    }
}
```

## 3. DTO(Data Transfer Object)의 중요성

DTO는 계층(Layer) 간 데이터 교환을 위해 사용하는 객체입니다. 특히 **Controller - Service - Repository** 구조에서 각 계층이 주고받는 데이터를 명확하게 정의하는 역할을 합니다.

### 3.1 왜 Entity를 직접 사용하면 안될까?

5주차에 배울 **Entity**는 데이터베이스 테이블과 1:1로 매핑되는 핵심 객체입니다. 이 Entity를 API의 요청/응답에 직접 사용하면 심각한 문제가 발생할 수 있습니다.

-   **보안 문제:** Entity에는 `password` 같은 민감한 정보나, 외부에 노출될 필요 없는 관리용 필드가 포함될 수 있습니다. Entity를 그대로 반환하면 이 모든 정보가 클라이언트에게 노출됩니다.
-   **API 스펙의 종속성:** Entity의 필드 이름이나 타입이 변경되면, 이는 곧 API의 스펙 변경으로 이어집니다. DB 구조 변경이 API에 직접적인 영향을 미쳐 유연성이 떨어집니다.
-   **유효성 검사(Validation)의 모호함:** Entity는 DB 데이터의 일관성을 위한 제약조건을 가지는 반면, API 요청은 그와 다른 유효성 검사 규칙이 필요할 수 있습니다. (e.g., 회원가입 시에만 `password` 필드가 필요)

### 3.2 올바른 DTO 사용법

API의 각 기능(Use Case)에 맞게 별도의 요청(Request) DTO와 응답(Response) DTO를 만드는 것이 가장 이상적입니다.

-   **Request DTO:** API 요청에 필요한 데이터만 필드로 정의합니다. 유효성 검사 어노테이션(`@NotBlank`, `@Email` 등)을 여기에 추가합니다.
-   **Response DTO:** 클라이언트에게 전달할 데이터만 필드로 정의합니다.

```java
// --- Controller Layer ---
@RestController
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<MemberSignUpResponse> signUp(@RequestBody MemberSignUpRequest request) {
        // 1. Request DTO로 요청을 받는다.
        // 2. Service 계층에는 DTO를 그대로 넘기거나, 필요한 데이터만 넘긴다.
        MemberDto memberDto = memberService.register(request.getEmail(), request.getPassword(), request.getName());

        // 3. Service에서 받은 결과를 Response DTO로 변환하여 반환한다.
        MemberSignUpResponse response = new MemberSignUpResponse(memberDto.getId(), memberDto.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

// --- Service Layer ---
@Service
public class MemberService {
    private final MemberRepository memberRepository;

    public MemberDto register(String email, String password, String name) {
        // Service 계층은 Controller의 DTO를 몰라도 된다.
        // 필요한 데이터만 받아서 비즈니스 로직을 처리한다.
        Member member = new Member(email, password, name);
        Member savedMember = memberRepository.save(member);

        // 결과를 담아 반환 (Entity를 직접 반환하지 않는다!)
        return new MemberDto(savedMember.getId(), savedMember.getEmail(), savedMember.getName());
    }
}

// --- DTOs ---

// Controller에서 사용하는 요청 DTO
public class MemberSignUpRequest { 
    private String email;
    private String password;
    private String name;
}

// Controller에서 사용하는 응답 DTO
public class MemberSignUpResponse {
    private Long id;
    private String email;
}

// Service와 Controller 사이에서 사용하는 DTO
public class MemberDto {
    private Long id;
    private String email;
    private String name;
}

// --- Domain Layer ---
// DB와 매핑되는 Entity
public class Member {
    private Long id;
    private String email;
    private String password; // 절대 외부에 노출되면 안됨!
    private String name;
    private LocalDateTime createdAt;
}
```

> **핵심:** **절대 Entity를 API의 요청/응답 객체로 사용하지 마세요.** 번거롭더라도 반드시 DTO로 변환하는 과정을 거쳐야 합니다. 이는 좋은 아키텍처를 위한 필수적인 약속입니다.

---

## ✏️ 4주차 실습 과제

3주차에 만든 **할 일(Todo) 목록 API**를 RESTful하게 개선하고, JSON 요청/응답을 처리하도록 수정합니다.

1.  **`TodoController`를 `TodoApiController`로 변경**
    -   `@RequestMapping` 경로를 `/api/todos`로 변경합니다.

2.  **할 일 생성 API 수정**
    -   **URL:** `POST /api/todos`
    -   **요청:** `@ModelAttribute` 대신 `@RequestBody`를 사용하도록 변경합니다. 클라이언트가 JSON으로 `{ "title": "새 할일", "content": "내용" }` 과 같이 요청을 보낸다고 가정합니다.
    -   `TodoCreateRequest` DTO를 만들어 요청 데이터를 받습니다.
    -   **응답:** 생성된 할 일의 정보를 담은 `TodoResponse` DTO (필드: `id`, `title`, `content`, `completed`)를 `ResponseEntity`에 담아 `201 Created` 상태 코드와 함께 반환합니다. (ID는 임의의 Long 값을 넣어주세요.)

3.  **할 일 수정 API 추가**
    -   **URL:** `PUT /api/todos/{todoId}`
    -   **요청:** `@RequestBody`로 `TodoUpdateRequest` DTO (필드: `title`, `content`, `completed`)를 받습니다.
    -   **응답:** 수정된 할 일의 전체 정보를 `TodoResponse` DTO에 담아 `200 OK` 상태 코드와 함께 반환합니다.

4.  **할 일 삭제 API 추가**
    -   **URL:** `DELETE /api/todos/{todoId}`
    -   **응답:** 응답 본문 없이 `204 No Content` 상태 코드를 반환합니다. (`ResponseEntity.noContent().build()`)

5.  **Postman**을 사용하여 모든 API(생성, 조회, 수정, 삭제)가 의도한 대로 동작하는지, 상태 코드가 올바르게 반환되는지 확인합니다.

---

## 🤔 심화 학습

-   `PUT`과 `PATCH`의 의미상 차이점은 무엇이며, RESTful API에서 각각 어떤 경우에 사용해야 할까요?
-   DTO에서 Entity로, Entity에서 DTO로 변환하는 코드가 반복됩니다. `MapStruct`나 `ModelMapper` 같은 라이브러리는 이 문제를 어떻게 해결해줄 수 있을까요?
-   API의 버전을 관리하는 방법에는 어떤 것들이 있을까요? (e.g., `/api/v1/todos`, `/api/v2/todos`)

---

## 📝 4주차 요약

-   **RESTful API**는 자원(URI), 행위(HTTP Method), 표현(JSON)을 통해 API를 설계하는 아키텍처 스타일이다.
-   `@RequestBody`는 클라이언트가 보낸 **JSON 데이터를 자바 객체(DTO)로** 변환해준다.
-   `ResponseEntity`를 사용하면 **HTTP 상태 코드와 헤더를 직접 제어**하여 더 명확한 API 응답을 만들 수 있다.
-   **Entity를 API의 요청/응답에 절대로 직접 사용해서는 안 된다.** 보안, 유연성, 유효성 검사 문제를 야기한다.
-   API의 기능(Use Case)에 맞게 **요청(Request) DTO와 응답(Response) DTO를 분리하여 사용**하는 것이 가장 좋은 설계이다.
