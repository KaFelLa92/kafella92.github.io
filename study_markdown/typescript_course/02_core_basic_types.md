# 2장: 핵심 기본 타입 - 데이터의 종류 정의하기

TypeScript의 가장 기본적인 기능은 변수나 함수에 타입을 지정하는 것입니다. Java와 유사하지만 미묘하게 다른 TypeScript의 기본 타입들을 알아보고, 타입 추론의 개념을 이해합니다.

---

## 1. 기본 타입 (Primitive Types)

- **`string`**: 문자열. Java의 `String`과 같습니다.
  ```typescript
  let myName: string = "최동진";
  ```
- **`number`**: 모든 숫자. Java의 `int`, `double`, `float` 등을 구분하지 않고 모두 `number` 타입을 사용합니다.
  ```typescript
  let age: number = 30;
  let score: number = 99.5;
  ```
- **`boolean`**: `true` 또는 `false`. Java의 `boolean`과 같습니다.
  ```typescript
  let isStudent: boolean = true;
  ```
- **`null` & `undefined`**: 각각 `null`과 `undefined` 값을 가집니다. 이들은 모든 다른 타입의 하위 타입으로도 사용될 수 있습니다. (`tsconfig.json`의 `strictNullChecks` 옵션에 따라 동작이 달라집니다.)
  ```typescript
  let nothing: null = null;
  let notAssigned: undefined = undefined;
  ```
- **`any`**: **어떤 타입이든** 될 수 있음을 의미합니다. `any`를 사용하면 TypeScript의 타입 검사를 비활성화하는 것과 같으므로, 꼭 필요한 경우가 아니면 사용을 피해야 합니다. JavaScript와의 점진적인 통합을 위해 존재합니다.
  ```typescript
  let anything: any = 4;
  anything = 'hello'; // 에러 없음
  anything = true;    // 에러 없음
  ```
- **`unknown`**: `any`와 비슷하게 모든 값을 할당할 수 있지만, 더 안전합니다. `unknown` 타입의 변수는 다른 타입의 변수에 직접 할당할 수 없으며, 사용하기 전에 반드시 타입을 확인(Type Guard)해야 합니다.
  ```typescript
  let maybe: unknown = 10;
  let aNumber: number;

  // aNumber = maybe; // 에러! unknown은 바로 할당 불가
  if (typeof maybe === 'number') {
    aNumber = maybe; // 타입 확인 후에는 할당 가능
  }
  ```

## 2. 배열과 튜플

- **배열 (Array)**: 두 가지 방식으로 선언할 수 있습니다.
  ```typescript
  // 방식 1: 타입[]
  let list1: number[] = [1, 2, 3];

  // 방식 2: Array<타입>
  let list2: Array<string> = ['a', 'b', 'c'];
  ```
- **튜플 (Tuple)**: 고정된 개수의 요소를 가지며, 각 요소의 타입이 정해진 배열입니다.
  ```typescript
  // [string, number] 타입의 튜플 선언
  let user: [string, number];
  user = ['최동진', 30]; // 정상
  // user = [30, '최동진']; // 에러! 순서가 맞지 않음
  // user = ['최동진', 30, true]; // 에러! 개수가 맞지 않음
  ```

## 3. 타입 추론 (Type Inference)

TypeScript는 변수를 선언할 때 초기값을 바탕으로 **타입을 자동으로 추론**합니다. 따라서 명백한 경우에는 타입을 굳이 명시하지 않아도 됩니다.

```typescript
let name = "최동진"; // TypeScript는 name을 string 타입으로 추론
let age = 30;       // age를 number 타입으로 추론

// name = 123; // 에러! string 타입 변수에 number를 할당할 수 없음
```
> **Best Practice**: 타입을 명확하게 알 수 있는 경우에는 타입 추론에 맡기고, 함수의 매개변수나 반환 값처럼 타입을 명시해야 코드가 명확해지는 경우에만 타입을 직접 작성하는 것이 좋습니다.

---

## 4. 연습 문제

### 문제 1: 변수 타입 지정하기
- **요구사항**: 다음 변수들에 알맞은 타입을 명시적으로 지정하세요.
  ```typescript
  let product_name = '노트북';
  let product_price = 1500000;
  let in_stock = true;
  let options = ['black', 'white', 128, 256];
  ```

<details>
<summary>문제 1 정답 예시</summary>

```typescript
let product_name: string = '노트북';
let product_price: number = 1500000;
let in_stock: boolean = true;
// string과 number가 함께 있으므로 (string | number)[] 또는 any[] 사용
let options: (string | number)[] = ['black', 'white', 128, 256];
// 또는 let options: any[] = ['black', 'white', 128, 256];
```
</details>

### 문제 2: 튜플을 사용한 데이터 모델링
- **요구사항**: 학생의 [학번, 이름, 학점] 정보를 담는 튜플 타입을 정의하고, 이 타입의 변수를 만들어 값을 할당해보세요.
- **세부사항**:
    1. 학번은 `number` 타입입니다.
    2. 이름은 `string` 타입입니다.
    3. 학점은 `number` 타입입니다.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
// 학생 정보를 위한 튜플 타입 정의
let student: [number, string, number];

// 변수에 값 할당
student = [2024001, '홍길동', 4.5];

console.log(`학번: ${student[0]}, 이름: ${student[1]}, 학점: ${student[2]}`);
```
</details>

### 문제 3: `unknown` 타입 안전하게 사용하기
- **요구사항**: 외부 API로부터 어떤 값이 올지 모르는 상황을 가정하여, `unknown` 타입의 변수를 안전하게 처리하는 코드를 작성하세요.
- **세부사항**:
    1. `data`라는 `unknown` 타입의 변수를 선언합니다.
    2. `data`에 문자열을 할당해봅니다.
    3. `typeof`를 사용하여 `data`가 `string` 타입인지 확인하고, 맞다면 `toUpperCase()` 메소드를 호출하여 출력합니다.
    4. `data`에 숫자를 할당해봅니다.
    5. `typeof`를 사용하여 `data`가 `number` 타입인지 확인하고, 맞다면 `toFixed(2)` 메소드를 호출하여 출력합니다.

<details>
<summary>문제 3 정답 예시</summary>

```typescript
let data: unknown;

data = 'this is a string';
if (typeof data === 'string') {
  console.log(data.toUpperCase()); // THIS IS A STRING
}

data = 3.141592;
if (typeof data === 'number') {
  console.log(data.toFixed(2)); // 3.14
}
```
</details>
