# TypeScript 시작하기: Spring 개발자를 위한 가이드

안녕하세요! 이 가이드는 HTML, CSS, JavaScript, 그리고 Spring(Java) 경험이 있는 분을 위해 만들어진 타입스크립트 입문서입니다. 자바의 문법적 특성과 비교하며 설명하여 타입스크립트의 개념을 더 쉽게 이해하실 수 있도록 돕겠습니다.

---

### 1단계: 타입스크립트(TypeScript), 왜 필요한가요?

JavaScript는 매우 유연한 언어지만, 큰 프로젝트에서는 그 유연함이 단점이 되기도 합니다.

**JavaScript의 문제점 (Java와 비교)**
```javascript
// 숫자를 더하는 함수를 만들었습니다.
function add(a, b) {
    return a + b;
}

add(10, 20); // 30 (정상)
add('10', '20'); // '1020' (의도와 다른 결과, 문자열이 합쳐짐)
```
Java였다면 `add(String a, String b)`와 `add(int a, int b)`는 다른 메소드로 인식되거나, 애초에 타입이 맞지 않아 컴파일 에러가 발생했을 겁니다. JavaScript는 에러 없이 그냥 실행해버리죠. 이런 문제는 프로젝트가 커질수록 찾기 어려운 버그를 만듭니다.

**타입스크립트의 해결책**
타입스크립트는 JavaScript에 **타입(Type) 시스템**을 추가한 언어입니다. 코드를 실행하기 전(컴파일 단계)에 타입 관련 에러를 미리 잡아낼 수 있게 해줍니다.

```typescript
// 매개변수 a와 b는 숫자(number)만 가능하다고 명시합니다.
function add(a: number, b: number) {
    return a + b;
}

add(10, 20); // 30 (정상)
add('10', '20'); // 에러! 컴파일 단계에서 "string 타입은 number 타입에 할당할 수 없습니다." 라는 오류를 보여줍니다.
```
> **핵심:** 타입스크립트는 코드가 실행되기 전에 버그를 찾을 수 있도록 도와주는 **안전장치**입니다.

---

### 2단계: 개발 환경 설정

타입스크립트 파일(`.ts`)은 브라우저나 Node.js가 직접 실행할 수 없습니다. `.ts` 파일을 `.js` 파일로 **컴파일(변환)**하는 과정이 필요합니다.

1.  **Node.js 설치**: [nodejs.org](https://nodejs.org/)에서 LTS 버전을 설치합니다. (npm이 함께 설치됩니다)
2.  **타입스크립트 설치**: 터미널(cmd 또는 PowerShell)을 열고 다음 명령어를 입력하세요.
    ```bash
    npm install -g typescript
    ```
3.  **컴파일 해보기**:
    *   `hello.ts` 라는 파일을 만들고 아래 코드를 작성하세요.
      ```typescript
      const message: string = 'Hello, TypeScript!';
      console.log(message);
      ```
    *   터미널에서 `tsc hello.ts` 명령어를 실행하세요.
    *   `hello.js` 파일이 생성된 것을 볼 수 있습니다. 이 변환된 js 파일을 기존처럼 HTML에서 `<script>` 태그로 불러와 사용하는 것입니다.

---

### 3단계: 핵심 개념과 예제 (Java/Spring과 비교)

#### 3.1. 기본 타입 (Basic Types)

Java에서 `String`, `int`, `boolean`을 사용하듯, 타입스크립트도 기본 타입을 명시할 수 있습니다.

-   **JavaScript (타입 없음)**
    ```javascript
    let name = '김진숙';
    let age = 20;
    let isStudent = true;
    ```
-   **TypeScript (타입 명시)**
    ```typescript
    let name: string = '김진숙';
    let age: number = 20; // int, double 구분 없이 number 사용
    let isStudent: boolean = true;
    ```
-   **Java (비교)**
    ```java
    String name = "김진숙";
    int age = 20;
    boolean isStudent = true;
    ```

#### 3.2. 배열 (Arrays)

-   **TypeScript**
    ```typescript
    let numbers: number[] = [1, 2, 3];
    let names: string[] = ['kim', 'lee', 'park'];
    ```
-   **Java (비교)**
    ```java
    int[] numbers = {1, 2, 3};
    // 또는 List<String> names = new ArrayList<>();
    ```

#### 3.3. 함수 (Functions)

함수의 매개변수와 반환 값의 타입을 지정할 수 있습니다.

-   **TypeScript**
    ```typescript
    // 매개변수는 number, 반환값도 number임을 명시
    function multiply(a: number, b: number): number {
        return a * b;
    }

    // 반환값이 없는 함수는 void 타입을 사용 (Java와 동일)
    function printName(name: string): void {
        console.log(`Hello, ${name}`);
    }
    ```
-   **Java (비교)**
    ```java
    public int multiply(int a, int b) {
        return a * b;
    }

    public void printName(String name) {
        System.out.println("Hello, " + name);
    }
    ```

#### 3.4. 객체와 인터페이스 (Objects & Interfaces)

**가장 중요한 개념입니다.** Spring에서 `PostDTO.java` 같은 DTO를 만들어 데이터 구조를 정의하는 것과 매우 유사합니다.

-   **Spring (DTO 예시)**
    ```java
    public class PostDTO {
        private int pno;
        private String title;
        private String content;
        private String author;
    }
    ```
-   **TypeScript (Interface 예시)**
    `interface`는 객체의 **"모양"** 또는 **"설계도"**를 정의합니다.
    ```typescript
    interface Post {
        pno: number;
        title: string;
        content: string;
        author: string;
    }

    // Post 인터페이스 규칙을 따르는 객체 생성
    const myPost: Post = {
        pno: 1,
        title: '타입스크립트란?',
        content: '타입을 지정하는 자바스크립트입니다.',
        author: '김진숙'
    };

    // 만약 규칙을 어기면?
    const wrongPost: Post = {
        pno: 2,
        title: '잘못된 객체',
        // content 속성이 없으므로 에러 발생!
        author: '박오류'
    };
    ```
> **핵심:** Spring에서 DTO로 데이터의 규격을 정하는 것처럼, TypeScript에서는 `interface`로 객체의 규격을 정합니다. API 응답 데이터를 다룰 때 매우 유용합니다.

---

### 4단계: 직접 해보기 (문제 및 해설)

아래 요구사항에 맞춰 타입스크립트 코드를 작성해보세요.

#### **문제**

1.  `User`라는 `interface`를 만드세요.
    *   `id`: `number` 타입
    *   `username`: `string` 타입
    *   `email`: `string` 타입
    *   `isVip`: `boolean` 타입. 단, 이 속성은 있어도 되고 없어도 되는 **선택적 속성**입니다. (속성 이름 뒤에 `?`를 붙이면 됩니다. 예: `isVip?: boolean`)

2.  `User` 타입의 객체를 2개 포함하는 배열 `users`를 만드세요. 한 명은 `isVip`를 `true`로, 다른 한 명은 `isVip` 속성 없이 만드세요.

3.  `users` 배열을 받아 VIP 유저의 이름만 출력하는 함수 `printVipUsers`를 작성하세요.

#### **해설**

```typescript
// 1. User 인터페이스 정의
interface User {
    id: number;
    username: string;
    email: string;
    isVip?: boolean; // '?'는 선택적 속성을 의미
}

// 2. User 타입의 배열 생성
const users: User[] = [
    {
        id: 1,
        username: '김철수',
        email: 'chulsoo@example.com',
        isVip: true
    },
    {
        id: 2,
        username: '이영희',
        email: 'younghee@example.com'
        // isVip 속성이 없지만, 선택적 속성이므로 에러가 발생하지 않음
    }
];

// 3. VIP 유저 이름 출력 함수
function printVipUsers(userArray: User[]): void {
    console.log('VIP 사용자 목록:');
    userArray.forEach(user => {
        // user.isVip가 true인 경우에만 이름을 출력
        if (user.isVip) {
            console.log(`- ${user.username}`);
        }
    });
}

// 함수 실행
printVipUsers(users); // 결과: VIP 사용자 목록: - 김철수
```

---

### 5단계: 다음 학습 로드맵

이 가이드에서는 타입스크립트의 가장 기본적인 내용을 다뤘습니다. 더 깊이 학습하고 싶다면 아래 키워드를 순서대로 공부해보세요.

1.  **Union Types (`|`)**: 한 변수가 여러 타입을 가질 수 있게 합니다. (예: `string | number`)
2.  **Type Aliases (`type`)**: `interface`와 비슷하지만, 더 다양한 커스텀 타입을 만들 수 있습니다.
3.  **Generics (`<T>`)**: Java의 제네릭과 거의 동일합니다. 재사용 가능한 컴포넌트를 만들 때 사용합니다.
4.  **Enum**: 특정 값들의 집합을 정의합니다. (Java의 `enum`과 동일)

이제 여러분은 JavaScript 코드에 타입을 지정하여 더 안정적이고 예측 가능한 코드를 작성할 준비가 되었습니다. 즐거운 코딩 하세요!
