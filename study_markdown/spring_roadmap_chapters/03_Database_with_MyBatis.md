# 3장: MyBatis를 이용한 데이터베이스 연동

JDBC를 직접 사용하는 방식에서 한 단계 나아가, SQL 매퍼(Mapper) 프레임워크인 MyBatis를 사용하는 방법을 복습합니다. 반복적인 JDBC 코드를 제거하고, SQL 쿼리를 XML이나 어노테이션에 분리하여 관리함으로써 생산성과 유지보수성을 높이는 방법을 익힙니다.

---

## 1. 핵심 개념

- **MyBatis**: SQL 쿼리를 자바 객체와 매핑해주는 퍼시스턴스 프레임워크입니다. 개발자는 SQL 쿼리만 작성하면, MyBatis가 JDBC의 복잡한 처리 과정을 대신 수행해줍니다.
- **Mapper Interface**: SQL 쿼리에 해당하는 자바 메소드를 선언하는 인터페이스입니다. `@Mapper` 어노테이션을 붙여 사용합니다.
- **SQL 어노테이션**: `@Select`, `@Insert`, `@Update`, `@Delete` 등의 어노테이션을 사용하여 인터페이스 메소드에 직접 SQL 쿼리를 작성할 수 있습니다.
- **`#{}`**: MyBatis에서 파라미터를 SQL 쿼리에 안전하게 바인딩하는 데 사용되는 문법입니다. 내부적으로 `PreparedStatement`를 사용하여 SQL 인젝션 공격을 방지합니다.

---

## 2. 예제를 통한 복습

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

    // 3. 개별 학생 삭제
    @Delete("delete from student where sno = #{sno}")
    int delete(int sno);
}
```
이처럼 DAO 클래스와 복잡한 JDBC 코드가 사라지고, 어떤 SQL이 실행되는지 인터페이스만 봐도 명확하게 알 수 있습니다.

---

## 3. 직접 풀 문제

1. `BatisMapper` 인터페이스에, 국어 점수가 90점 이상인 모든 학생을 조회하는 `findByKorGreaterThan` 메소드를 추가해보세요. (`WHERE` 절을 사용해야 합니다.)

2. XML 매퍼 파일을 사용하는 방법을 학습해보세요. `BatisMapper.java`에 작성했던 SQL 쿼리들을 `resources/mappers/batisMapper.xml` 파일로 옮겨보고, 어노테이션 방식과 XML 방식의 장단점을 비교해보세요.

<details>
<summary>문제 1 정답 예시</summary>

```java
@Select("SELECT * FROM student WHERE kor >= #{score}")
List<StudentDto> findByKorGreaterThan(int score);
```
</details>
