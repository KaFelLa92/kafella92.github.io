# 4장: JPA와 Spring Data JPA로의 도약

MyBatis가 SQL 중심의 개발 방식이라면, JPA는 객체(Object) 중심의 개발 방식입니다. SQL 쿼리를 직접 작성하는 대신, 자바 객체를 조작하면 JPA가 알아서 적절한 SQL을 생성하여 데이터베이스와 통신합니다. 이를 통해 개발자는 비즈니스 로직에 더 집중할 수 있습니다.

---

## 1. 핵심 개념

- **JPA (Java Persistence API)**: 자바 진영의 ORM(Object-Relational Mapping) 기술 표준입니다.
- **ORM (Object-Relational Mapping)**: 객체와 관계형 데이터베이스의 데이터를 자동으로 매핑(연결)해주는 기술입니다.
- **Entity**: 데이터베이스 테이블과 매핑되는 자바 클래스입니다. `@Entity` 어노테이션을 붙여 표시합니다.
- **Repository**: Entity를 위한 기본적인 CRUD 메소드를 제공하는 인터페이스입니다. `JpaRepository`를 상속받아 만듭니다.
- **Spring Data JPA**: JPA를 더 쉽고 편하게 사용할 수 있도록 스프링에서 제공하는 모듈입니다. `JpaRepository` 인터페이스만 상속받으면 CRUD 메소드를 자동으로 구현해줍니다.

---

## 2. 예제 코드 (가상)

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
}
```
MyBatis 매퍼에 SQL을 일일이 작성했던 것과 달리, `JpaRepository`가 제공하는 기본 메소드와 쿼리 메소드만으로 대부분의 CRUD 작업이 가능해집니다.

---

## 3. 직접 풀 문제

1. `dongjinWeb2` 프로젝트의 `build.gradle`에 `spring-boot-starter-data-jpa` 의존성을 추가하세요.
2. 기존의 `student` 테이블을 제어하는 `Student` Entity와 `StudentRepository`를 직접 만들어보세요.
3. `StudentRepository`에, 국어 점수와 수학 점수가 모두 80점 이상인 학생을 찾는 쿼리 메소드를 추가해보세요. (메소드 이름: `findByKorGreaterThanEqualAndMathGreaterThanEqual`)
