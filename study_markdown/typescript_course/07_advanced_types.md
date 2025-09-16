# 7장: 고급 타입 - 타입스크립트의 힘 제대로 활용하기

TypeScript는 기본 타입을 넘어, 기존 타입을 변환하거나 조합하여 더 정교하고 유연한 타입을 만들 수 있는 다양한 고급 타입 기능들을 제공합니다. 이를 통해 반복적인 타입 정의를 줄이고, 코드의 표현력을 극대화할 수 있습니다.

---

## 1. 유틸리티 타입 (Utility Types)

유틸리티 타입은 기존 타입을 바탕으로 새로운 타입을 만들어내는, TypeScript에 내장된 특별한 제네릭 타입입니다. 매우 유용하고 자주 사용됩니다.

- **`Partial<T>`**: 타입 `T`의 모든 속성을 선택적(optional, `?`)으로 만듭니다. 객체의 일부만 업데이트할 때 유용합니다.
  ```typescript
  interface User { id: number; name: string; email: string; }
  type PartialUser = Partial<User>; // { id?: number; name?: string; email?: string; }
  ```

- **`Readonly<T>`**: 타입 `T`의 모든 속성을 읽기 전용(`readonly`)으로 만듭니다. 불변 객체를 만들 때 사용합니다.
  ```typescript
  type ReadonlyUser = Readonly<User>;
  ```

- **`Pick<T, K>`**: 타입 `T`에서 `K` 속성들만 골라 새로운 타입을 만듭니다.
  ```typescript
  type UserPreview = Pick<User, 'id' | 'name'>; // { id: number; name: string; }
  ```

- **`Omit<T, K>`**: 타입 `T`에서 `K` 속성들만 제외하고 새로운 타입을 만듭니다.
  ```typescript
  type UserWithoutEmail = Omit<User, 'email'>; // { id: number; name: string; }
  ```

- **`Record<K, T>`**: 키(key)가 `K` 타입이고 값(value)이 `T` 타입인 객체 타입을 만듭니다.
  ```typescript
  type UserRoles = 'admin' | 'editor' | 'guest';
  const rolePermissions: Record<UserRoles, boolean> = {
    admin: true,
    editor: true,
    guest: false,
  };
  ```

## 2. 타입 가드 (Type Guards)

타입 가드는 특정 스코프(scope) 내에서 변수의 타입을 더 구체적인 타입으로 좁혀주는(narrowing) 표현식입니다. `unknown`이나 유니언 타입을 다룰 때 필수적입니다.

- **`typeof` 타입 가드**:
  ```typescript
  function printValue(value: string | number) {
    if (typeof value === 'string') {
      console.log(value.toUpperCase()); // 이 블록 안에서 value는 string 타입
    } else {
      console.log(value.toFixed(2)); // 이 블록 안에서 value는 number 타입
    }
  }
  ```

- **`instanceof` 타입 가드**:
  ```typescript
  class Fish { swim() {} }
  class Bird { fly() {} }

  function move(animal: Fish | Bird) {
    if (animal instanceof Fish) {
      animal.swim(); // animal은 Fish 타입
    } else {
      animal.fly(); // animal은 Bird 타입
    }
  }
  ```

- **사용자 정의 타입 가드 (User-Defined Type Guards)**: `is` 키워드를 사용하여 타입을 판별하는 함수를 직접 만들 수 있습니다.
  ```typescript
  interface Cat { meow(): void; }
  interface Dog { bark(): void; }

  // 이 함수는 boolean을 반환하며, true일 경우 pet이 Cat 타입임을 보장
  function isCat(pet: Cat | Dog): pet is Cat {
    return (pet as Cat).meow !== undefined;
  }

  function makeSound(pet: Cat | Dog) {
    if (isCat(pet)) {
      pet.meow(); // pet은 Cat 타입으로 좁혀짐
    } else {
      pet.bark(); // pet은 Dog 타입으로 좁혀짐
    }
  }
  ```

## 3. 그 외 고급 타입

- **인덱스 시그니처 (Index Signatures)**: 객체가 임의의 키를 가질 수 있을 때 사용합니다.
  ```typescript
  interface StringArray {
    [index: number]: string; // 키는 number, 값은 string
  }
  const arr: StringArray = ['a', 'b', 'c'];
  ```

- **매핑된 타입 (Mapped Types)**: 기존 타입을 기반으로, 각 속성을 변환하여 새로운 타입을 만듭니다. 유틸리티 타입들은 대부분 매핑된 타입을 사용하여 구현됩니다.
  ```typescript
  type Flags = { [K in keyof User]: boolean }; // User의 모든 속성을 boolean 타입으로 변환
  // { id: boolean; name: boolean; email: boolean; }
  ```

- **조건부 타입 (Conditional Types)**: 삼항 연산자처럼, 타입에 조건을 적용하여 다른 타입을 반환합니다.
  ```typescript
  type IsString<T> = T extends string ? true : false;
  type A = IsString<string>; // true
  type B = IsString<number>; // false
  ```

---

## 4. 연습 문제

### 문제 1: 유틸리티 타입 활용하기
- **요구사항**: 아래 `Book` 인터페이스를 바탕으로, 유틸리티 타입을 사용하여 다음 타입들을 만들어보세요.
  ```typescript
  interface Book {
    id: number;
    title: string;
    author: string;
    publishedYear: number;
    isbn: string;
  }
  ```
  1.  `BookToCreate`: `id` 속성이 제외된 타입 (새 책을 만들 때 사용)
  2.  `BookToUpdate`: 모든 속성이 선택적인 타입 (책 정보를 부분적으로 수정할 때 사용)
  3.  `BookSummary`: `title`과 `author` 속성만 가진 타입

<details>
<summary>문제 1 정답 예시</summary>

```typescript
// 1. Omit 사용
type BookToCreate = Omit<Book, 'id'>;

// 2. Partial 사용
type BookToUpdate = Partial<Book>;

// 3. Pick 사용
type BookSummary = Pick<Book, 'title' | 'author'>;
```
</details>

### 문제 2: 사용자 정의 타입 가드 만들기
- **요구사항**: API 응답 객체를 나타내는 `SuccessResponse`와 `ErrorResponse` 인터페이스가 있습니다. 이 두 타입을 구분하는 사용자 정의 타입 가드 함수 `isSuccess`를 만드세요.
  ```typescript
  interface SuccessResponse {
    status: 'success';
    data: any;
  }
  interface ErrorResponse {
    status: 'error';
    errorCode: number;
    errorMessage: string;
  }
  type ApiResponse = SuccessResponse | ErrorResponse;
  ```
- **힌트**: `response.status === 'success'` 조건을 확인하여 `response is SuccessResponse`를 반환하도록 함수를 작성하세요.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
function isSuccess(response: ApiResponse): response is SuccessResponse {
  return response.status === 'success';
}

function handleApiResponse(response: ApiResponse) {
  if (isSuccess(response)) {
    // 이 블록에서 response는 SuccessResponse 타입
    console.log('Data:', response.data);
  } else {
    // 이 블록에서 response는 ErrorResponse 타입
    console.error(`Error ${response.errorCode}: ${response.errorMessage}`);
  }
}
```
</details>
