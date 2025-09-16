# 3장: 함수와 객체 - 코드의 기본 단위 타입 정의하기

대부분의 애플리케이션 로직은 함수와 객체로 구성됩니다. TypeScript에서 함수의 매개변수와 반환 값, 그리고 객체의 구조에 타입을 지정하여 코드의 예측 가능성과 안정성을 높이는 방법을 배웁니다.

---

## 1. 함수 타입 정의 (Function Types)

- **매개변수(Parameter) 타입**: 함수의 각 매개변수 뒤에 콜론(`:`)을 붙여 타입을 지정합니다.
- **반환(Return) 타입**: 함수 선언부의 괄호(`()`) 뒤에 콜론(`:`)을 붙여 함수가 반환할 값의 타입을 지정합니다. 반환 값이 없는 함수는 `void` 타입을 사용합니다.

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

- **선택적 매개변수 (Optional Parameters)**: 매개변수 이름 뒤에 물음표(`?`)를 붙이면, 해당 매개변수는 선택적으로 전달할 수 있습니다. 전달되지 않으면 `undefined` 값을 가집니다. 선택적 매개변수는 항상 필수 매개변수 뒤에 와야 합니다.

```typescript
function greet(name: string, greeting?: string): void {
  if (greeting) {
    console.log(`${greeting}, ${name}!`);
  } else {
    console.log(`Hello, ${name}!`);
  }
}

greet('최동진'); // "Hello, 최동진!"
greet('최동진', 'Welcome'); // "Welcome, 최동진!"
```

- **기본값 매개변수 (Default Parameters)**: 매개변수에 기본값을 지정할 수 있습니다. 값이 전달되지 않으면 기본값이 사용됩니다.

```typescript
function calculate(price: number, tax: number = 0.1): number {
  return price * (1 + tax);
}

calculate(1000);      // 1100 (tax는 0.1로 계산)
calculate(1000, 0.05); // 1050 (tax는 0.05로 계산)
```

## 2. 객체 타입 정의 (Object Types)

객체의 "모양"을 정의하는 가장 간단한 방법은 객체 리터럴 구문을 사용하는 것입니다.

```typescript
// 객체의 각 속성(property)에 타입을 지정
function printUser(user: { id: number; name: string; email?: string }): void {
  console.log(`ID: ${user.id}, Name: ${user.name}`);
  if (user.email) {
    console.log(`Email: ${user.email}`);
  }
}

const myUser = { id: 1, name: '최동진', email: 'cdj@example.com' };
printUser(myUser);

const anotherUser = { id: 2, name: 'Gemini' };
printUser(anotherUser);
```
- 위 방식은 간단하지만, 동일한 객체 타입을 여러 곳에서 사용해야 할 경우 불편합니다. 이럴 때 **인터페이스(Interface)**나 **타입 별칭(Type Alias)**을 사용합니다. (4장에서 자세히 다룸)

---

## 3. 연습 문제

### 문제 1: 사용자 정보 포맷팅 함수 만들기
- **요구사항**: 사용자 객체를 받아 "이름 (나이)" 형식의 문자열을 반환하는 `formatUserInfo` 함수를 작성하세요.
- **세부사항**:
    1. 함수는 하나의 매개변수를 받습니다.
    2. 매개변수는 `name` (`string` 타입)과 `age` (`number` 타입) 속성을 가진 객체여야 합니다.
    3. 함수는 `string` 타입을 반환해야 합니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
function formatUserInfo(user: { name: string; age: number }): string {
  return `${user.name} (${user.age})`;
}

const user1 = { name: '김코딩', age: 25 };
console.log(formatUserInfo(user1)); // "김코딩 (25)"

const user2 = { name: '박해커', age: 32 };
console.log(formatUserInfo(user2)); // "박해커 (32)"
```
</details>

### 문제 2: 선택적 매개변수를 가진 함수 만들기
- **요구사항**: 상품 정보를 받아, 할인이 적용된 최종 가격을 계산하는 `calculateDiscountedPrice` 함수를 작성하세요.
- **세부사항**:
    1. `price` (`number` 타입)는 필수 매개변수입니다.
    2. `discountRate` (`number` 타입, 0과 1 사이의 값)는 선택적 매개변수입니다.
    3. `discountRate`가 주어지면 `price * (1 - discountRate)`를 반환합니다.
    4. `discountRate`가 주어지지 않으면 원래 `price`를 그대로 반환합니다.

<details>
<summary>문제 2 정답 예시</summary>

```typescript
function calculateDiscountedPrice(price: number, discountRate?: number): number {
  if (discountRate) {
    return price * (1 - discountRate);
  }
  return price;
}

console.log(calculateDiscountedPrice(10000));       // 10000
console.log(calculateDiscountedPrice(10000, 0.2));  // 8000
```
</details>

### 문제 3: 기본값 매개변수를 가진 함수 만들기
- **요구사항**: 메시지와 반복 횟수를 받아, 메시지를 여러 번 출력하는 `repeatMessage` 함수를 작성하세요.
- **세부사항**:
    1. `message` (`string` 타입)는 필수 매개변수입니다.
    2. `times` (`number` 타입)는 기본값이 `3`인 매개변수입니다.
    3. 함수는 반환 값이 없어야 합니다 (`void`).
    4. `for` 반복문을 사용하여 `times` 횟수만큼 `message`를 `console.log`로 출력합니다.

<details>
<summary>문제 3 정답 예시</summary>

```typescript
function repeatMessage(message: string, times: number = 3): void {
  for (let i = 0; i < times; i++) {
    console.log(message);
  }
}

repeatMessage('Hello!'); // "Hello!"가 3번 출력됨
console.log('---');
repeatMessage('TypeScript', 5); // "TypeScript"가 5번 출력됨
```
</details>
