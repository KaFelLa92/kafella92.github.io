# 2장: Spring MVC와 웹 요청 처리

웹 애플리케이션의 핵심인 HTTP 요청을 받고 응답하는 방법을 배웁니다. 사용자의 URL 요청을 어떤 컨트롤러의 어떤 메소드가 처리할지 '매핑'하고, 클라이언트로부터 데이터를 어떤 형식으로 받아 어떻게 응답할지 결정하는 방법을 복습합니다.

---

## 1. 핵심 개념

- **MVC**: Model-View-Controller의 약자로, 애플리케이션을 세 가지 역할로 구분하는 디자인 패턴입니다.
  - **Model**: 데이터와 비즈니스 로직 (Service, Repository/DAO, DTO)
  - **View**: 사용자에게 보여지는 UI (JSP, Thymeleaf, React)
  - **Controller**: 사용자의 요청을 받아 Model과 View를 중개하는 역할
- **@RestController**: `@Controller`와 `@ResponseBody`가 합쳐진 어노테이션으로, 주로 JSON 형태의 데이터를 반환하는 RESTful API를 만들 때 사용됩니다.
- **@GetMapping, @PostMapping 등**: HTTP Method에 따라 URL을 매핑하는 어노테이션입니다.
- **@RequestParam**: URL의 쿼리 스트링(`?key=value`) 값을 메소드 파라미터로 받을 때 사용합니다.
- **@RequestBody**: HTTP 요청의 본문(Body)에 담겨 온 JSON 등의 데이터를 자바 객체(DTO)로 변환하여 받을 때 사용합니다.
- **@PathVariable**: URL 경로 자체에 포함된 값(예: `/posts/{id}`)을 파라미터로 받을 때 사용합니다.

---

## 2. 예제를 통한 복습

`dongjinWeb2/src/main/java/example/day07/controller/BoardController.java` 코드는 다양한 요청 처리 방식을 잘 보여줍니다.

**POST 요청과 @RequestBody, @Valid**
```java
// 새 게시글 등록
@PostMapping("")
public ResponseEntity<Integer> boardWrite(@RequestBody @Valid BoardDto boardDto, BindingResult bindingResult) {
    // @RequestBody: JSON 데이터를 BoardDto로 변환
    // @Valid: BoardDto에 정의된 유효성 검사 규칙을 실행
    // BindingResult: 유효성 검사 결과를 담는 객체
    if (bindingResult.hasErrors()) {
        return ResponseEntity.status(400).body(0);
    }
    int result = boardService.boardWrite(boardDto);
    return ResponseEntity.ok(result);
}
```

**GET 요청과 @RequestParam**
```java
// 특정 게시글 조회
@GetMapping("/find")
public ResponseEntity<BoardDto> boardFind(@RequestParam int bno) {
    // @RequestParam: URL의 ?bno=1 과 같은 쿼리 스트링 값을 int bno 파라미터에 매핑
    return ResponseEntity.status(200).body(boardService.boardFind(bno));
}
```

---

## 3. 직접 풀 문제

1. `BoardController`에 `@PathVariable`을 사용하여 특정 게시글을 조회하는 API를 추가해보세요. URL 형식은 `GET /board/{bno}` 입니다. 기존의 `?bno=1` 방식과 어떤 차이가 있는지, 언제 사용하는 것이 더 적절할지(RESTful) 생각해보세요.

2. `boardWrite` 메소드에서 유효성 검사에 실패했을 때, 단순히 `0`을 반환하는 대신 어떤 필드에서 어떤 오류가 발생했는지 구체적인 에러 메시지를 `List<String>` 형태로 반환하도록 수정해보세요.

<details>
<summary>문제 1 정답 예시</summary>

```java
@GetMapping("/{bno}")
public ResponseEntity<BoardDto> boardFind(@PathVariable int bno) {
    // @PathVariable: /board/1 과 같은 URL 경로상의 값을 int bno 파라미터에 매핑
    return ResponseEntity.status(200).body(boardService.boardFind(bno));
}
```
</details>
