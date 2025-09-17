# 1장: Spring Boot와 제어의 역전(IoC) / 의존성 주입(DI)

Spring의 가장 핵심적인 사상인 IoC와 DI를 다시 한번 확실히 이해하는 챕터입니다. 왜 우리가 `new` 키워드로 객체를 직접 생성하지 않고, 스프링에게 객체 관리를 맡기는지에 대한 '철학'을 다집니다. 이것이 바로 클래스 간의 결합도를 낮추고 유연하고 확장 가능한 설계를 만드는 첫걸음입니다.

---

## 1. 핵심 개념

- **Bean**: Spring IoC 컨테이너가 관리하는 자바 객체입니다. `@Component`, `@Service`, `@Repository`, `@Controller` 등의 어노테이션이 붙은 클래스들이 스캔되어 Bean으로 등록됩니다.
- **IoC (Inversion of Control, 제어의 역전)**: 객체의 생성, 생명주기 관리 등을 개발자가 아닌 프레임워크(스프링 컨테이너)가 대신 해주는 것을 의미합니다. 제어권이 개발자에서 프레임워크로 넘어갔기 때문에 '제어의 역전'이라고 부릅니다.
- **DI (Dependency Injection, 의존성 주입)**: 어떤 객체가 사용하는 다른 객체(의존성)를 외부(스프링 컨테이너)에서 직접 주입해주는 방식입니다. `new` 키워드를 사용하지 않고 필요한 객체를 얻을 수 있어 클래스 간의 결합도(coupling)를 낮춥니다.

---

## 2. 예제를 통한 복습

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

---

## 3. 직접 풀 문제

1. `@Autowired`를 사용한 필드 주입 방식 대신, **생성자 주입** 방식을 사용하도록 `MvcController`와 `MvcService` 코드를 수정해보세요. (힌트: `final` 키워드와 클래스 생성자를 사용합니다.)

2. 간단한 `MessageService` 클래스를 만들고 `@Component` 어노테이션을 붙여 Bean으로 등록한 뒤, `MvcController`에서 주입받아 "Hello, Spring!"을 출력하는 메소드를 호출해보세요.

<details>
<summary>문제 1 정답 예시</summary>

```java
// MvcController.java 수정 예시
@RestController
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 만들어주는 Lombok 어노테이션
public class MvcController {
    private final MvcService mvcService;
    
    @GetMapping("/day08/mvc")
    public void method(){
        mvcService.method();
    }
}
```
</details>
