# 6장: 제네릭 - 재사용 가능한 타입 만들기

제네릭(Generics)은 다양한 타입에서 동작하면서도 타입 안정성을 잃지 않는, 재사용 가능한 컴포넌트(함수, 클래스, 인터페이스)를 만드는 데 사용되는 강력한 도구입니다. Java나 C#의 제네릭과 매우 유사한 개념으로, 타입을 마치 함수의 파라미터처럼 사용하는 것입니다.

---

## 1. 제네릭이 왜 필요한가?

제네릭이 없는 상황을 생각해봅시다. 숫자나 문자열을 받아 그대로 반환하는 `identity` 함수를 만들고 싶습니다.

- **`any` 사용의 문제점**:
  ```typescript
  function identity(arg: any): any {
    return arg;
  }

  let output = identity('myString'); // output의 타입은? any가 됨
  // output이 string이라는 정보를 잃어버려, string 관련 자동완성 등을 사용할 수 없음
  ```
  `any`를 사용하면 타입 정보를 잃어버려 TypeScript의 장점을 활용할 수 없습니다.

- **유니언 타입 사용의 한계**:
  ```typescript
  function identity(arg: string | number): string | number {
    return arg;
  }
  ```
  여러 타입을 지원할 수는 있지만, 입력 타입과 출력 타입의 관계가 명확하지 않고, 모든 가능한 타입을 유니언으로 나열하기는 어렵습니다.

## 2. 제네릭 기본 문법

제네릭은 타입 변수(일반적으로 `T`와 같은 대문자 사용)를 사용하여 이 문제를 해결합니다.

- **제네릭 함수 (Generic Functions)**: 함수 이름 뒤에 꺾쇠괄호(`<T>`)를 사용하여 타입 변수를 선언합니다. 이 `T`는 함수가 호출될 때 실제 타입으로 결정됩니다.

  ```typescript
  function identity<T>(arg: T): T {
    return arg;
  }

  // 사용 방법 1: 타입 명시적 전달
  let output1 = identity<string>('myString'); // T는 string이 됨

  // 사용 방법 2: 타입 추론 활용 (더 일반적)
  let output2 = identity('myString'); // TypeScript가 arg를 보고 T가 string임을 추론

  // 이제 output1과 output2는 모두 string 타입이므로, string 메소드 사용 가능
  console.log(output2.toUpperCase());
  ```
  이제 `identity` 함수는 어떤 타입이 들어오든 그 타입을 그대로 유지하여 반환하는, 타입-안전한 함수가 되었습니다.

- **제네릭 인터페이스 (Generic Interfaces)**: 인터페이스도 제네릭을 가질 수 있습니다.

  ```typescript
  // API 응답 구조를 위한 제네릭 인터페이스
  interface ApiResponse<T> {
    status: 'success' | 'error';
    data: T; // 데이터의 타입은 제네릭 T에 따라 결정됨
    errorMessage?: string;
  }

  interface User {
    id: number;
    name: string;
  }

  // User 데이터를 담는 API 응답
  const userResponse: ApiResponse<User> = {
    status: 'success',
    data: { id: 1, name: '최동진' }
  };

  // string 배열 데이터를 담는 API 응답
  const tagsResponse: ApiResponse<string[]> = {
    status: 'success',
    data: ['typescript', 'hono', 'react']
  };
  ```

- **제네릭 클래스 (Generic Classes)**: 클래스도 제네릭을 사용하여 다양한 타입의 데이터를 다룰 수 있습니다.

  ```typescript
  class DataStorage<T> {
    private data: T[] = [];

    addItem(item: T): void {
      this.data.push(item);
    }

    getItems(): T[] {
      return [...this.data];
    }
  }

  const stringStorage = new DataStorage<string>();
  stringStorage.addItem('A');
  // stringStorage.addItem(1); // 에러!

  const numberStorage = new DataStorage<number>();
  numberStorage.addItem(10);
  ```

## 3. 제네릭 제약 조건 (Generic Constraints)

때로는 제네릭 타입이 특정 속성이나 메소드를 가지고 있다고 보장해야 할 때가 있습니다. `extends` 키워드를 사용하여 제네릭 타입에 제약 조건을 추가할 수 있습니다.

```typescript
interface WithLength {
  length: number;
}

// T는 반드시 length 속성을 가진 타입이어야 함
function logLength<T extends WithLength>(arg: T): void {
  console.log(arg.length);
}

logLength('hello'); // string은 length 속성이 있으므로 정상
logLength([1, 2, 3]); // array는 length 속성이 있으므로 정상
// logLength(123); // 에러! number는 length 속성이 없음
```

---

## 4. 연습 문제

### 문제 1: 제네릭 배열 뒤집기 함수
- **요구사항**: 어떤 타입의 배열이든 인자로 받아, 그 배열의 복사본을 뒤집어서 반환하는 제네릭 함수 `reverseArray`를 작성하세요.
- **힌트**: 원본 배열을 수정하지 않도록, 먼저 배열을 복사(`[...arr]`)한 후 `reverse()` 메소드를 사용하세요.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
function reverseArray<T>(arr: T[]): T[] {
  return [...arr].reverse();
}

const numbers = [1, 2, 3, 4, 5];
const reversedNumbers = reverseArray(numbers);
console.log(reversedNumbers); // [5, 4, 3, 2, 1]

const strings = ['a', 'b', 'c'];
const reversedStrings = reverseArray(strings);
console.log(reversedStrings); // ['c', 'b', 'a']
```
</details>

### 문제 2: 제네릭 Key-Value 쌍 인터페이스
- **요구사항**: 키(key)와 값(value)의 타입을 제네릭으로 받는 `KeyValuePair` 인터페이스를 정의하고, 이를 사용하여 객체를 만들어보세요.
- **세부사항**:
    1. `KeyValuePair` 인터페이스는 `K`와 `V` 두 개의 타입 변수를 가집니다.
    2. `key` 속성은 `K` 타입을, `value` 속성은 `V` 타입을 가집니다.
    3. `KeyValuePair<string, number>` 타입과 `KeyValuePair<number, boolean>` 타입의 객체를 각각 만들어보세요.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

const setting1: KeyValuePair<string, number> = {
  key: 'fontSize',
  value: 16
};

const setting2: KeyValuePair<number, boolean> = {
  key: 101,
  value: true
};
```
</details>

### 문제 3: 제네릭 제약 조건 활용하기
- **요구사항**: `id` 속성을 가진 객체들로 이루어진 배열에서, 특정 `id`를 가진 객체를 찾는 제네릭 함수 `findById`를 작성하세요.
- **세부사항**:
    1. `T` 타입이 `{ id: number }` 구조를 만족하도록 제네릭 제약 조건을 추가합니다.
    2. 함수는 `items` (제약 조건을 만족하는 `T` 타입의 배열)와 `id` (`number` 타입) 두 개의 인자를 받습니다.
    3. 배열의 `find` 메소드를 사용하여 일치하는 객체를 찾아 반환합니다.

<details>
<summary>문제 3 정답 예시</summary>

```typescript
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

interface User { id: number; name: string; }
interface Product { id: number; price: number; }

const users: User[] = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
const products: Product[] = [{ id: 101, price: 100 }, { id: 102, price: 200 }];

console.log(findById(users, 2)); // { id: 2, name: 'B' }
console.log(findById(products, 101)); // { id: 101, price: 100 }
```
</details>
