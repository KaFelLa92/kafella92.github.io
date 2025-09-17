# Spring Boot 로드맵: 실무 역량을 갖춘 백엔드 개발자로 거듭나기

안녕하세요! 스프링을 가장 강력한 무기로 만들고 싶어 하는 당신의 열정을 응원합니다. 이 가이드라인은 당신의 학습 경로를 체계적으로 정리하고, 실무에서 마주할 기술들을 미리 경험할 수 있도록 설계되었습니다. React 가이드라인처럼 각 챕터는 개념, 용어, 예제, 실습, 그리고 더 깊은 고민을 위한 질문들로 구성되어 있습니다.

---

## Part 1: Spring 기초 다지기 (복습)

지금까지 학습한 내용을 바탕으로 Spring의 핵심 철학과 기본기를 단단히 다지는 파트입니다.

### 1장: Spring Boot와 제어의 역전(IoC) / 의존성 주입(DI)

#### 1. 개념 정리
Spring의 가장 핵심적인 사상인 IoC와 DI를 다시 한번 확실히 이해하는 챕터입니다. 왜 우리가 `new` 키워드로 객체를 직접 생성하지 않고, 스프링에게 객체 관리를 맡기는지에 대한 '철학'을 다집니다. 이것이 바로 클래스 간의 결합도를 낮추고 유연하고 확장 가능한 설계를 만드는 첫걸음입니다.

#### 2. 용어 설명
- **Spring Framework**: 자바 기반의 엔터프라이즈급 애플리케이션 개발을 위한 포괄적인 프로그래밍 및 설정 모델입니다.
- **Spring Boot**: 스프링 프레임워크를 더 쉽고 빠르게 사용할 수 있도록 만들어진 도구입니다. 내장 웹 서버(Tomcat)를 포함하고 복잡한 설정을 자동화해줍니다.
- **Bean**: Spring IoC 컨테이너가 관리하는 자바 객체를 의미합니다. `@Component`, `@Service`, `@Repository`, `@Controller` 등의 어노테이션이 붙은 클래스들이 스캔되어 Bean으로 등록됩니다.
- **IoC (Inversion of Control, 제어의 역전)**: 객체의 생성, 생명주기 관리 등을 개발자가 아닌 프레임워크(스프링 컨테이너)가 대신 해주는 것을 의미합니다. 제어권이 개발자에서 프레임워크로 넘어갔기 때문에 '제어의 역전'이라고 부릅니다.
- **DI (Dependency Injection, 의존성 주입)**: 어떤 객체가 사용하는 다른 객체(의존성)를 외부(스프링 컨테이너)에서 직접 주입해주는 방식입니다. `new` 키워드를 사용하지 않고 필요한 객체를 얻을 수 있어 클래스 간의 결합도(coupling)를 낮춥니다.
- **Container**: Bean들을 생성하고, 관리하며, 제공하는 거대한 저장소 또는 공장입니다.

#### 3. 예제를 통한 복습
`dongjinWeb1/src/main/java/example/day08/_2MVC/` 프로젝트에서 MVC 각 계층이 서로를 필요로 할 때 어떻게 DI를 사용했는지 다시 살펴봅시다.

**Controller → Service 의존성 주입**
```java
// MvcController.java
@RestController
public class MvcController {
    @Autowired // [2] Service 빈 주입
    private MvcService mvcService;
    
    @GetMapping("/day08/mvc")
    public void method(){
        mvcService.method(); // 직접 new MvcService() 하지 않고, 주입받은 객체를 사용
    }
}
```

**Service → Repository(DAO) 의존성 주입**
```java
// MvcService.java
@Service
public class MvcService {
    @Autowired  // [2] Repository(DAO) 빈 주입
    private MvcDao mvcDao;

    public void method(){
        mvcDao.method(); // 직접 new MvcDao() 하지 않고, 주입받은 객체를 사용
    }
}
```
이처럼 `@Autowired`를 통해 스프링 컨테이너에 미리 등록된 Bean을 '주입'받아 사용함으로써, 각 클래스는 자신이 어떤 구체적인 구현체에 의존하는지 신경 쓸 필요가 없어집니다.

#### 4. 실습 문제
1. `@Autowired`를 사용한 필드 주입 방식 대신, '생성자 주입' 방식을 사용하도록 `MvcController`와 `MvcService` 코드를 수정해보세요. 왜 생성자 주입이 더 권장되는지 이유를 찾아보세요.
2. 간단한 `MessageService` 클래스를 만들고 `@Component` 어노테이션을 붙여 Bean으로 등록한 뒤, `MvcController`에서 주입받아 "Hello, Spring!"을 출력하는 메소드를 호출해보세요.

#### 5. 더 생각해보기
- 만약 동일한 타입의 Bean이 두 개 이상 컨테이너에 등록되어 있다면, `@Autowired`는 어떻게 동작할까요? (`@Qualifier`, `@Primary` 어노테이션에 대해 알아보세요.)
- Bean의 생명주기(생성 -> 사용 -> 소멸)는 어떻게 관리될까요? (`@PostConstruct`, `@PreDestroy` 어노테이션에 대해 알아보세요.)

---

### 2장: Spring MVC와 웹 요청 처리

#### 1. 개념 정리
웹 애플리케이션의 핵심인 HTTP 요청을 받고 응답하는 방법을 배웁니다. 사용자의 URL 요청을 어떤 컨트롤러의 어떤 메소드가 처리할지 '매핑'하고, 클라이언트로부터 데이터를 어떤 형식으로 받아 어떻게 응답할지 결정하는 방법을 복습합니다.

#### 2. 용어 설명
- **MVC**: Model-View-Controller의 약자로, 애플리케이션을 세 가지 역할로 구분하는 디자인 패턴입니다.
  - **Model**: 데이터와 비즈니스 로직 (Service, Repository/DAO, DTO)
  - **View**: 사용자에게 보여지는 UI (JSP, Thymeleaf, React)
  - **Controller**: 사용자의 요청을 받아 Model과 View를 중개하는 역할
- **@RestController**: `@Controller`와 `@ResponseBody`가 합쳐진 어노테이션으로, 주로 JSON 형태의 데이터를 반환하는 RESTful API를 만들 때 사용됩니다.
- **@RequestMapping**: 클래스나 메소드에 공통 URL 경로를 지정합니다.
- **@GetMapping, @PostMapping, @PutMapping, @DeleteMapping**: HTTP Method(GET, POST, PUT, DELETE)에 따라 URL을 매핑하는 어노테이션입니다.
- **@RequestParam**: URL의 쿼리 스트링(`?key=value`) 값을 메소드 파라미터로 받을 때 사용합니다.
- **@RequestBody**: HTTP 요청의 본문(Body)에 담겨 온 JSON, XML 등의 데이터를 자바 객체(DTO)로 변환하여 받을 때 사용합니다.
- **@PathVariable**: URL 경로 자체에 포함된 값(예: `/posts/{id}`)을 파라미터로 받을 때 사용합니다.
- **ResponseEntity**: HTTP 응답의 상태 코드, 헤더, 본문을 모두 포함하여 세밀하게 제어할 수 있는 객체입니다.

#### 3. 예제를 통한 복습
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
        // 유효성 검사 실패 시 400 에러와 함께 0을 반환
        return ResponseEntity.status(400).body(0);
    }
    int result = boardService.boardWrite(boardDto);
    return ResponseEntity.ok(result); // 성공 시 200 OK와 함께 결과 반환
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

#### 4. 실습 문제
1. `BoardController`에 `@PathVariable`을 사용하여 특정 게시글을 조회하는 API를 추가해보세요. (예: `GET /board/{bno}`) 기존의 `?bno=1` 방식과 어떤 차이가 있는지 비교해보세요.
2. `boardWrite` 메소드에서 유효성 검사에 실패했을 때, 단순히 `0`을 반환하는 대신 어떤 필드에서 어떤 오류가 발생했는지 구체적인 에러 메시지를 `List<String>` 형태로 반환하도록 수정해보세요.

#### 5. 더 생각해보기
- `@ModelAttribute`는 언제 사용될까요? `@RequestParam`, `@RequestBody`와 비교하여 각각의 사용 사례를 정리해보세요.
- HTTP 응답 상태 코드(200, 201, 400, 404, 500 등)는 각각 어떤 의미를 가지며, `ResponseEntity`를 통해 이를 어떻게 효과적으로 클라이언트에게 전달할 수 있을까요?

---

### 3장: MyBatis를 이용한 데이터베이스 연동

#### 1. 개념 정리
JDBC를 직접 사용하는 방식에서 한 단계 나아가, SQL 매퍼(Mapper) 프레임워크인 MyBatis를 사용하는 방법을 복습합니다. 반복적인 JDBC 코드를 제거하고, SQL 쿼리를 XML이나 어노테이션에 분리하여 관리함으로써 생산성과 유지보수성을 높이는 방법을 익힙니다.

#### 2. 용어 설명
- **MyBatis**: SQL 쿼리를 자바 객체와 매핑해주는 퍼시스턴스 프레임워크입니다. 개발자는 SQL 쿼리만 작성하면, MyBatis가 JDBC의 복잡한 처리 과정을 대신 수행해줍니다.
- **Mapper Interface**: SQL 쿼리에 해당하는 자바 메소드를 선언하는 인터페이스입니다. `@Mapper` 어노테이션을 붙여 사용합니다.
- **SQL 어노테이션**: `@Select`, `@Insert`, `@Update`, `@Delete` 등의 어노테이션을 사용하여 인터페이스 메소드에 직접 SQL 쿼리를 작성할 수 있습니다.
- **`#{}`**: MyBatis에서 파라미터를 SQL 쿼리에 안전하게 바인딩하는 데 사용되는 문법입니다. 내부적으로 `PreparedStatement`를 사용하여 SQL 인젝션 공격을 방지합니다.

#### 3. 예제를 통한 복습
`dongjinWeb2/src/main/java/example/day06/BatisMapper.java` 파일은 어노테이션 기반 MyBatis의 핵심을 잘 보여줍니다.

```java
@Mapper // 해당 인터페이스를 MyBatis 매퍼로 등록
public interface BatisMapper {

    // 1. 학생 등록
    @Insert("insert into student (name, kor, math) values (#{name}, #{kor}, #{math})")
    int save(StudentDto studentDto); // studentDto 객체의 필드들이 #{...}에 매핑됨

    // 2. 전체 학생 조회
    @Select("select * from student")
    List<StudentDto> findAll(); // 조회 결과를 StudentDto 리스트에 자동으로 매핑

    // 3. 개별 학생 조회
    @Select("select * from student where sno = #{sno}")
    Map<String, Object> find(int sno); // 기본 타입 파라미터는 이름으로 바로 매핑

    // 4. 개별 학생 삭제
    @Delete("delete from student where sno = #{sno}")
    int delete(int sno);

    // 5. 개별 학생 수정
    @Update("update student set name = #{name}, kor = #{kor}, math = #{math} where sno = #{sno}")
    int update(StudentDto studentDto);
}
```
이처럼 DAO 클래스와 복잡한 JDBC 코드가 사라지고, 어떤 SQL이 실행되는지 인터페이스만 봐도 명확하게 알 수 있습니다.

#### 4. 실습 문제
1. `BatisMapper` 인터페이스에, 국어 점수가 특정 점수 이상인 모든 학생을 조회하는 `findByKorGreaterThan` 메소드를 추가해보세요.
2. XML 매퍼 파일을 사용하는 방법을 학습해보세요. `BatisMapper.java`에 작성했던 SQL 쿼리들을 `resources/mappers/batisMapper.xml` 파일로 옮겨보고, 어노테이션 방식과 XML 방식의 장단점을 비교해보세요.

#### 5. 더 생각해보기
- 동적 SQL(`<if>`, `<foreach>` 등)은 어노테이션 방식에서 어떻게 사용할 수 있을까요? XML 방식과 비교했을 때의 한계는 무엇일까요?
- MyBatis의 `#`와 `$`의 차이점은 무엇이며, 왜 `#` 사용이 권장될까요?

---

## Part 2: Spring 심화 과정

실무에서 필수적으로 사용되는 핵심 기술들을 깊이 있게 학습하는 파트입니다.

### 4장: JPA와 Spring Data JPA로의 도약

#### 1. 개념 정리
MyBatis가 SQL 중심의 개발 방식이라면, JPA는 객체(Object) 중심의 개발 방식입니다. SQL 쿼리를 직접 작성하는 대신, 자바 객체를 조작하면 JPA가 알아서 적절한 SQL을 생성하여 데이터베이스와 통신합니다. 이를 통해 개발자는 비즈니스 로직에 더 집중할 수 있습니다.

#### 2. 용어 설명
- **JPA (Java Persistence API)**: 자바 진영의 ORM(Object-Relational Mapping) 기술 표준입니다. 인터페이스의 모음이며, 실제 구현체로는 Hibernate, EclipseLink 등이 있습니다.
- **ORM (Object-Relational Mapping)**: 객체와 관계형 데이터베이스의 데이터를 자동으로 매핑(연결)해주는 기술입니다.
- **Entity**: 데이터베이스 테이블과 매핑되는 자바 클래스입니다. `@Entity` 어노테이션을 붙여 표시합니다.
- **Repository**: Entity를 위한 기본적인 CRUD 메소드를 제공하는 인터페이스입니다. `JpaRepository`를 상속받아 만듭니다.
- **Spring Data JPA**: JPA를 더 쉽고 편하게 사용할 수 있도록 스프링에서 제공하는 모듈입니다. `JpaRepository` 인터페이스만 상속받으면 CRUD 메소드를 자동으로 구현해줍니다.

#### 3. 예제 코드 (가상)
MyBatis에서 JPA로 전환하면 코드가 어떻게 바뀌는지 비교해봅시다.

**JPA Entity**
```java
@Entity // 이 클래스가 DB 테이블과 매핑됨을 선언
@Data // Lombok
public class Student {
    @Id // Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PK 자동 생성 전략
    private int sno;
    
    private String name;
    private int kor;
    private int math;
}
```

**JPA Repository**
```java
// JpaRepository<Entity 클래스, PK 타입>을 상속받기만 하면 됨
public interface StudentRepository extends JpaRepository<Student, Integer> {
    // 메소드 이름만 규칙에 맞게 작성하면, Spring Data JPA가 알아서 쿼리를 생성
    // 예: 국어 점수로 학생 찾기
    List<Student> findByKor(int kor);
    
    // 예: 이름에 특정 문자열을 포함하는 학생 찾기
    List<Student> findByNameContaining(String keyword);
}
```

**Service에서 사용**
```java
@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;

    public Student save(Student student) {
        return studentRepository.save(student); // INSERT, UPDATE 둘 다 처리
    }

    public List<Student> findAll() {
        return studentRepository.findAll(); // SELECT *
    }

    public Optional<Student> findById(int sno) {
        return studentRepository.findById(sno); // SELECT WHERE id = ?
    }

    public void deleteById(int sno) {
        studentRepository.deleteById(sno); // DELETE WHERE id = ?
    }
}
```
MyBatis 매퍼에 SQL을 일일이 작성했던 것과 달리, `JpaRepository`가 제공하는 기본 메소드와 쿼리 메소드(메소드 이름으로 쿼리 생성)만으로 대부분의 CRUD 작업이 가능해집니다.

#### 4. 실습 문제
1. 기존의 `student` 테이블을 제어하는 `Student` Entity와 `StudentRepository`를 직접 만들어보세요.
2. `StudentRepository`에, 국어 점수와 수학 점수가 모두 80점 이상인 학생을 찾는 쿼리 메소드를 추가해보세요. (메소드 이름: `findByKorGreaterThanEqualAndMathGreaterThanEqual`)

#### 5. 더 생각해보기
- JPA의 영속성 컨텍스트(Persistence Context)란 무엇이며, 왜 중요한 개념일까요?
- JPA는 만능일까요? 복잡한 통계 쿼리나 성능 최적화가 필요할 때, MyBatis와 JPA를 함께 사용하는 방법(JPA QueryDSL 등)에 대해 알아보세요.

---

### 5장: Spring Security를 이용한 인증과 인가

#### 1. 개념 정리
대부분의 웹 서비스는 '로그인' 기능을 필요로 합니다. Spring Security는 인증(Authentication)과 인가(Authorization)에 대한 강력하고 포괄적인 기능을 제공하는 프레임워크입니다. 필터 체인 기반으로 동작하며, 폼 로그인, 소셜 로그인(OAuth2), JWT(JSON Web Token) 등 다양한 인증 방식을 지원합니다.

#### 2. 용어 설명
- **인증 (Authentication)**: 당신이 누구인지 증명하는 과정입니다. (예: 아이디와 비밀번호로 로그인)
- **인가 (Authorization)**: 당신이 특정 리소스에 접근할 권한이 있는지 확인하는 과정입니다. (예: 'ADMIN' 역할을 가진 사용자만 관리자 페이지에 접근 가능)
- **Principal**: 현재 인증된 사용자의 정보를 담고 있는 객체. 주로 `UserDetails` 인터페이스의 구현체를 사용합니다.
- **Filter Chain**: Spring Security는 여러 보안 필터들이 체인처럼 연결되어 순서대로 요청을 검사하고 처리하는 구조로 동작합니다.
- **JWT (JSON Web Token)**: 인증 정보를 담은 암호화된 토큰입니다. 서버는 세션 대신 이 토큰의 유효성을 검증하여 사용자를 인증하므로, 상태 없이(stateless) 확장 가능한 API 서버를 만드는 데 적합합니다.

#### 3. 예제 코드 (가상)
가장 기본적인 폼 로그인 설정을 살펴봅시다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/admin/**").hasRole("ADMIN") // /admin/** 경로는 ADMIN 역할 필요
                .requestMatchers("/my-page").hasAnyRole("USER", "ADMIN") // /my-page는 USER 또는 ADMIN 역할 필요
                .requestMatchers("/", "/login", "/signup").permitAll() // /, /login, /signup은 누구나 접근 가능
                .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요
            )
            .formLogin(form -> form
                .loginPage("/login") // 커스텀 로그인 페이지 경로
                .defaultSuccessUrl("/") // 로그인 성공 시 이동할 경로
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout") // 로그아웃 처리 URL
                .logoutSuccessUrl("/") // 로그아웃 성공 시 이동할 경로
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 비밀번호를 안전하게 저장하기 위한 암호화 인코더
        return new BCryptPasswordEncoder();
    }
}
```

#### 4. 실습 문제
1. `dongjinWeb1`의 `MemberController`에 구현된 세션 기반 로그인 로직을 Spring Security의 폼 로그인 방식으로 전환해보세요.
2. JWT를 발급하고 검증하는 로직을 구현해보세요. 로그인 성공 시 JWT를 클라이언트에게 반환하고, 이후의 요청에서는 헤더에 담긴 JWT를 검증하여 사용자를 인증하는 필터를 만들어보세요.

#### 5. 더 생각해보기
- 세션 기반 인증과 토큰 기반(JWT) 인증의 차이점은 무엇이며, 각각 어떤 상황에 더 유리할까요?
- 소셜 로그인(OAuth2)은 어떤 원리로 동작하며, Spring Security를 통해 어떻게 구현할 수 있을까요?

---

## Part 3: 실무 역량 강화

백엔드 개발자로서 협업하고, 안정적인 서비스를 운영하기 위해 필요한 기술들을 학습합니다.

### 6장: RESTful API 심화와 예외 처리

- **개념**: RESTful API를 설계하는 원칙(Richardson 성숙도 모델 등)을 배우고, 애플리케이션 전역에서 발생하는 예외를 일관되게 처리하는 방법을 익힙니다.
- **주요 기술**: `@RestControllerAdvice`, `@ExceptionHandler`, 커스텀 예외 클래스 정의

### 7장: Spring에서의 테스트

- **개념**: 내가 만든 코드가 올바르게 동작하는지 검증하는 것은 매우 중요합니다. 단위 테스트(Unit Test), 통합 테스트(Integration Test)의 개념을 이해하고, Spring Boot 환경에서 테스트 코드를 작성하는 방법을 배웁니다.
- **주요 기술**: JUnit5, Mockito, `@SpringBootTest`, `@WebMvcTest`

### 8장: Spring과 WebSocket

- **개념**: `dongjinWeb2`에서 경험했던 WebSocket을 더 깊이 이해합니다. 실시간 채팅, 알림 등 양방향 통신이 필요한 기능을 구현하는 방법을 복습하고, Stomp 프로토콜을 사용하여 더 구조화된 메시징을 구현해봅니다.
- **주요 기술**: `TextWebSocketHandler`, Stomp, `@MessageMapping`

### 9장: Docker를 이용한 컨테이너화

- **개념**: 내가 만든 Spring Boot 애플리케이션을 어떤 환경에서든 동일하게 실행할 수 있도록 Docker 컨테이너 이미지로 만드는 방법을 배웁니다.
- **주요 기술**: `Dockerfile` 작성, Docker Compose를 이용한 DB와 애플리케이션 동시 실행

### 10장: 더 넓은 세상으로
- **AOP (Aspect-Oriented Programming)**: 로깅, 트랜잭션 등 여러 비즈니스 로직에 공통으로 적용되는 '부가 기능'을 모듈화하는 방법을 배웁니다.
- **메시지 큐 (Kafka, RabbitMQ)**: 대용량 트래픽을 안정적으로 처리하기 위한 비동기 메시징 시스템의 원리를 이해합니다.
- **클라우드 배포 (AWS, GCP)**: 만든 애플리케이션을 실제 클라우드 서버에 배포하고 운영하는 기초를 다집니다.
