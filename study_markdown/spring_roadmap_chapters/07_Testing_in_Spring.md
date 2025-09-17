# 7장: Spring에서의 테스트

내가 만든 코드가 올바르게 동작하는지 검증하는 것은 매우 중요합니다. 버그를 사전에 발견하고, 코드 변경에 대한 안정성을 확보하며, 더 나은 설계를 유도하는 테스트 코드 작성법을 배웁니다.

---

## 1. 핵심 개념

- **단위 테스트 (Unit Test)**: 애플리케이션의 가장 작은 단위(메소드, 클래스 등)가 의도대로 동작하는지 검증하는 테스트입니다. 다른 부분과 독립적으로 진행되어야 합니다.
- **통합 테스트 (Integration Test)**: 여러 컴포넌트(Controller, Service, Repository 등)를 연동하여 전체적인 기능이 정상적으로 동작하는지 검증하는 테스트입니다.
- **JUnit5**: 자바 진영의 대표적인 테스트 프레임워크입니다.
- **Mockito**: 실제 객체 대신 가짜 객체(Mock)를 만들어 테스트를 도와주는 라이브러리입니다. 단위 테스트에서 외부 의존성을 격리할 때 사용됩니다.
- **@SpringBootTest**: 스프링 부트의 모든 설정을 로드하여 실제 애플리케이션과 거의 동일한 환경에서 통합 테스트를 진행할 때 사용합니다.
- **@WebMvcTest**: 웹 계층(Controller)만 테스트하고 싶을 때 사용합니다. `@Service`, `@Repository` 등은 Bean으로 등록되지 않습니다.

---

## 2. 예제 코드

`BoardService`의 `boardWrite` 메소드를 테스트하는 단위 테스트 코드입니다.

```java
@ExtendWith(MockitoExtension.class) // Mockito 확장 기능 사용
class BoardServiceTest {

    @Mock // 가짜 BoardMapper 객체 생성
    private BoardMapper boardMapper;

    @InjectMocks // @Mock으로 생성된 객체를 주입할 대상
    private BoardService boardService;

    @Test
    @DisplayName("게시글 작성 성공 테스트")
    void boardWrite_success() {
        // given (테스트 준비)
        BoardDto dto = new BoardDto(0, "테스트 내용", "테스트 작성자");
        // boardMapper.boardWrite가 어떤 dto로든 호출되면 1을 반환하도록 설정
        when(boardMapper.boardWrite(any(BoardDto.class))).thenReturn(1);

        // when (테스트 실행)
        int result = boardService.boardWrite(dto);

        // then (결과 검증)
        assertThat(result).isEqualTo(1);
    }
}
```

---

## 3. 직접 풀 문제

1. `BoardService`의 `boardFind` 메소드에 대한 단위 테스트 코드를 작성해보세요. `boardMapper.find(1)`이 호출되면 특정 `BoardDto` 객체를 반환하도록 Mockito를 설정하고, 서비스 메소드의 결과가 이와 일치하는지 검증해야 합니다.

2. `@WebMvcTest(BoardController.class)`를 사용하여 `BoardController`의 `boardFind` API(`GET /board/find?bno=1`)를 테스트하는 코드를 작성해보세요. MockMvc를 사용하여 실제 HTTP 요청을 보내고, 응답 상태 코드가 200인지, 응답 본문에 예상한 데이터가 포함되어 있는지 검증해야 합니다.
