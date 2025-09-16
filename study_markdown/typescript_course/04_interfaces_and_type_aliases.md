# 4장: 인터페이스와 타입 별칭 - 타입에 이름 붙이기

복잡한 객체 타입을 여러 곳에서 재사용하기 위해 타입에 이름을 붙이는 방법을 배웁니다. TypeScript에서는 **인터페이스(Interface)**와 **타입 별칭(Type Alias)** 두 가지 주요 방법을 제공합니다. 이 둘의 차이점과 각각의 사용 사례를 이해하는 것이 중요합니다.

---

## 1. 인터페이스 (Interface)

- **개념**: 객체의 "모양" 또는 "설계도"를 정의하는 데 사용됩니다. 객체가 어떤 속성(property)과 메소드(method)를 가져야 하는지 규정합니다. Java의 `interface`와 매우 유사한 역할을 합니다.
- **주요 특징**:
    - `interface` 키워드로 선언합니다.
    - **선택적 속성(Optional Properties)**: 속성 이름 뒤에 `?`를 붙여 선택적으로 만들 수 있습니다.
    - **읽기 전용 속성(Readonly Properties)**: `readonly` 키워드를 속성 앞에 붙여, 객체가 처음 생성될 때만 값을 할당할 수 있도록 강제합니다.
    - **확장(Extending)**: `extends` 키워드를 사용하여 다른 인터페이스를 상속받아 확장할 수 있습니다. (Java의 클래스 상속과 유사)

### 예제: `User` 인터페이스 정의 및 사용

```typescript
// User 인터페이스 정의
interface User {
  readonly id: number; // 읽기 전용 속성
  name: string;
  email: string;
  isVip?: boolean; // 선택적 속성

  // 메소드 타입 정의
  greet(): string;
}

// User 인터페이스를 구현하는 객체
const user1: User = {
  id: 1,
  name: '최동진',
  email: 'cdj@example.com',
  isVip: true,
  greet() {
    return `Hello, my name is ${this.name}`;
  }
};

// user1.id = 2; // 에러! 읽기 전용 속성이므로 재할당 불가

// 인터페이스 확장
interface AdminUser extends User {
  role: 'admin' | 'super-admin'; // 리터럴 타입 (5장에서 자세히 다룸)
}

const admin1: AdminUser = {
  id: 2,
  name: '관리자',
  email: 'admin@example.com',
  role: 'admin',
  greet() {
    return `Hi, I am an admin named ${this.name}`;
  }
};
```

## 2. 타입 별칭 (Type Alias)

- **개념**: `type` 키워드를 사용하여 기존 타입이나 복잡한 타입에 새로운 이름을 부여하는 것입니다. 원시 타입, 유니언 타입, 튜플 등 어떤 타입이든 별칭을 만들 수 있습니다.

- **유니언 타입 (Union Types)**: 파이프(`|`) 기호를 사용하여 한 변수가 여러 타입 중 하나를 가질 수 있도록 허용합니다.

- **인터섹션 타입 (Intersection Types)**: 앰퍼샌드(`&`) 기호를 사용하여 여러 타입을 하나로 결합(merge)합니다.

### 예제: 타입 별칭과 유니언/인터섹션 타입

```typescript
// 1. 원시 타입에 별칭 부여
type ID = string;

// 2. 유니언 타입에 별칭 부여
type StringOrNumber = string | number;
let myValue: StringOrNumber = 'hello';
myValue = 123;

// 3. 객체 타입에 별칭 부여 (인터페이스와 유사)
type Point = {
  x: number;
  y: number;
};

// 4. 인터섹션 타입
type Person = {
  name: string;
};
type Employee = {
  employeeId: number;
};

type EmployedPerson = Person & Employee;

const person1: EmployedPerson = {
  name: '김근로',
  employeeId: 101
};
```

## 3. Interface vs Type Alias

대부분의 경우 서로 대체 가능하지만, 몇 가지 중요한 차이점이 있습니다.

| 특징 | `interface` | `type` |
| :--- | :--- | :--- |
| **목적** | 객체의 구조를 정의하는 데 특화 | 모든 종류의 타입에 별칭을 붙일 수 있음 |
| **확장** | `extends` 키워드로 확장 | 인터섹션 타입(`&`)으로 확장 |
| **선언 병합** | **가능 (Declaration Merging)** | **불가능** |

- **선언 병합(Declaration Merging)**: 동일한 이름의 `interface`를 여러 번 선언하면, TypeScript 컴파일러가 이들을 하나의 인터페이스로 자동 병합합니다. 라이브러리의 타입을 확장할 때 유용합니다.

```typescript
interface Box {
  width: number;
}
interface Box {
  height: number;
}

const box: Box = { width: 10, height: 20 }; // 정상
```

> **Best Practice**: 객체의 구조를 정의할 때는 `interface`를 우선적으로 사용하고, 유니언이나 튜플 등 다른 타입에 별칭을 붙일 때는 `type`을 사용하는 것이 일반적인 컨벤션입니다.

---

## 4. 연습 문제

### 문제 1: `Product` 인터페이스 만들기
- **요구사항**: 상품 정보를 나타내는 `Product` 인터페이스를 정의하고, 이를 사용하여 상품 객체를 만들어보세요.
- **세부사항**:
    - `id`: `number` 타입, 읽기 전용
    - `name`: `string` 타입
    - `price`: `number` 타입
    - `description`: `string` 타입, 선택적 속성
    - `display()`: 상품 정보를 문자열로 반환하는 메소드

<details>
<summary>문제 1 정답 예시</summary>

```typescript
interface Product {
  readonly id: number;
  name: string;
  price: number;
  description?: string;
  display(): string;
}

const laptop: Product = {
  id: 101,
  name: '노트북',
  price: 1500000,
  display() {
    return `${this.name} (가격: ${this.price}원)`;
  }
};

console.log(laptop.display()); // "노트북 (가격: 1500000원)"
```
</details>

### 문제 2: `StatusCode` 타입 별칭 만들기
- **요구사항**: API 응답 상태를 나타내는 `StatusCode`라는 이름의 유니언 타입을 `type` 별칭으로 만들어보세요.
- **세부사항**:
    1. `StatusCode` 타입은 `200`, `404`, `500` 세 가지 숫자 값 중 하나를 가질 수 있어야 합니다.
    2. `handleResponse`라는 함수를 만드세요. 이 함수는 `StatusCode` 타입의 `code`를 매개변수로 받아, 각 코드에 맞는 메시지를 출력해야 합니다.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
type StatusCode = 200 | 404 | 500;

function handleResponse(code: StatusCode): void {
  switch (code) {
    case 200:
      console.log('OK - 요청 성공');
      break;
    case 404:
      console.log('Not Found - 리소스를 찾을 수 없음');
      break;
    case 500:
      console.log('Internal Server Error - 서버 오류');
      break;
  }
}

handleResponse(200);
// handleResponse(400); // 에러! StatusCode 타입에 없는 값
```
</details>

### 문제 3: 인터페이스 확장하기
- **요구사항**: `Book` 인터페이스와 `Magazine` 인터페이스를 만들어보세요. 두 인터페이스는 공통 속성을 가져야 합니다.
- **세부사항**:
    1. 공통 속성(`title`: `string`, `pages`: `number`)을 가진 `Publication` 인터페이스를 만듭니다.
    2. `Book` 인터페이스는 `Publication`을 확장하고, `author` (`string` 타입) 속성을 추가로 가집니다.
    3. `Magazine` 인터페이스는 `Publication`을 확장하고, `issueDate` (`string` 타입) 속성을 추가로 가집니다.
    4. 각 인터페이스에 맞는 객체를 하나씩 만들어보세요.

<details>
<summary>문제 3 정답 예시</summary>

```typescript
interface Publication {
  title: string;
  pages: number;
}

interface Book extends Publication {
  author: string;
}

interface Magazine extends Publication {
  issueDate: string;
}

const myBook: Book = {
  title: 'Hono 입문',
  pages: 250,
  author: 'Hono Team'
};

const myMagazine: Magazine = {
  title: '월간 코딩',
  pages: 120,
  issueDate: '2024-05'
};
```
</details>
