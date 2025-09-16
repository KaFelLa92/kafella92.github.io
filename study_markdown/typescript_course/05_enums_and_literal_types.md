# 5장: 열거형과 리터럴 타입 - 정해진 값만 허용하기

변수가 특정 값들의 집합 중 하나만 갖도록 강제하여 코드의 의도를 명확히 하고 실수를 줄이는 방법을 배웁니다. Java 개발자에게 익숙한 **열거형(Enum)**과, TypeScript의 강력한 기능인 **리터럴 타입(Literal Types)**을 알아봅니다.

---

## 1. 열거형 (Enum)

- **개념**: 이름이 있는 상수들의 집합을 정의하는 방법입니다. 특정 상태나 옵션을 나타낼 때, 숫자나 문자열을 직접 사용하는 것보다 코드의 가독성과 유지보수성을 높여줍니다. Java의 `enum`과 매우 유사합니다.

- **숫자 열거형 (Numeric Enums)**: 기본적으로 0부터 시작하여 1씩 증가하는 숫자 값을 가집니다. 시작 값을 직접 지정할 수도 있습니다.

- **문자열 열거형 (String Enums)**: 각 멤버에 명시적으로 문자열 값을 할당합니다. 디버깅 시 숫자보다 의미를 파악하기 쉬워 더 자주 사용됩니다.

### 예제: Enum 사용하기

```typescript
// 숫자 열거형
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

let move: Direction = Direction.Up;
console.log(move); // 0

// 문자열 열거형
enum UserRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Guest = 'GUEST',
}

function checkPermission(role: UserRole) {
  if (role === UserRole.Admin) {
    console.log('모든 권한을 가집니다.');
  } else if (role === UserRole.Editor) {
    console.log('쓰기 권한을 가집니다.');
  } else {
    console.log('읽기 권한만 가집니다.');
  }
}

checkPermission(UserRole.Admin); // "모든 권한을 가집니다."
```

## 2. 리터럴 타입 (Literal Types)

- **개념**: 특정 원시 값(문자열, 숫자, 불리언) 자체를 타입으로 사용하는 것입니다. 유니언 타입(`|`)과 함께 사용하면, 변수나 매개변수가 정해진 몇 개의 값 중 하나만 갖도록 완벽하게 제한할 수 있습니다.

- **장점**: `enum`보다 더 가볍고 직관적입니다. JavaScript로 컴파일될 때 `enum`처럼 별도의 객체를 생성하지 않고 값 자체가 남기 때문에 더 효율적입니다.

### 예제: 리터럴 타입 사용하기

```typescript
// 리터럴 타입과 유니언 타입을 결합하여 별칭 생성
type Alignment = 'left' | 'center' | 'right';

function setAlignment(align: Alignment): void {
  console.log(`정렬을 ${align}로 설정합니다.`);
}

setAlignment('center'); // 정상
// setAlignment('middle'); // 에러! 'middle'은 Alignment 타입에 속하지 않음

// 객체 속성에도 사용 가능
interface ApiResponse {
  status: 'success' | 'error';
  data: any;
  errorMessage?: string;
}

const successResponse: ApiResponse = {
  status: 'success',
  data: { id: 1, name: '최동진' }
};

const errorResponse: ApiResponse = {
  status: 'error',
  data: null,
  errorMessage: '사용자를 찾을 수 없습니다.'
};
```

> **Best Practice**: 간단한 상태나 옵션을 나타낼 때는 `enum`보다 **리터럴 유니언 타입**을 사용하는 것이 현대 TypeScript 개발에서 더 선호되는 방식입니다. 코드가 더 간결하고 JavaScript 변환 결과물이 깔끔하기 때문입니다.

---

## 3. 연습 문제

### 문제 1: 요일(Weekday) Enum 만들기
- **요구사항**: 월요일부터 일요일까지를 나타내는 `Weekday`라는 이름의 숫자 열거형을 만드세요.
- **세부사항**:
    1. `Weekday` enum을 정의합니다.
    2. 월요일(`Monday`)의 값을 `1`로 시작하도록 설정하세요. (그러면 화요일은 자동으로 2가 됩니다.)
    3. `isWeekend`라는 함수를 만드세요. 이 함수는 `Weekday` 타입의 요일을 받아, 토요일(`Saturday`)이나 일요일(`Sunday`)이면 `true`를, 그렇지 않으면 `false`를 반환해야 합니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
enum Weekday {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

function isWeekend(day: Weekday): boolean {
  return day === Weekday.Saturday || day === Weekday.Sunday;
}

console.log(isWeekend(Weekday.Monday));   // false
console.log(isWeekend(Weekday.Saturday)); // true
```
</details>

### 문제 2: 버튼 타입 리터럴 타입 만들기
- **요구사항**: 버튼의 스타일을 결정하는 `ButtonType`이라는 리터럴 타입을 만드세요.
- **세부사항**:
    1. `ButtonType`은 `'primary'`, `'secondary'`, `'danger'` 세 가지 문자열 값 중 하나를 가질 수 있도록 `type` 별칭으로 정의합니다.
    2. `createButton` 함수를 만드세요. 이 함수는 `label`(`string`)과 `type`(`ButtonType`)을 매개변수로 받아, 타입에 따라 다른 스타일 정보를 담은 객체를 반환합니다.
    - `primary`: `{ backgroundColor: 'blue', color: 'white' }`
    - `secondary`: `{ backgroundColor: 'gray', color: 'black' }`
    - `danger`: `{ backgroundColor: 'red', color: 'white' }`

<details>
<summary>문제 2 정답 예시</summary>

```typescript
type ButtonType = 'primary' | 'secondary' | 'danger';

interface ButtonStyle {
  backgroundColor: string;
  color: string;
}

function createButton(label: string, type: ButtonType): ButtonStyle {
  switch (type) {
    case 'primary':
      return { backgroundColor: 'blue', color: 'white' };
    case 'secondary':
      return { backgroundColor: 'gray', color: 'black' };
    case 'danger':
      return { backgroundColor: 'red', color: 'white' };
  }
}

console.log('로그인 버튼 스타일:', createButton('Login', 'primary'));
console.log('취소 버튼 스타일:', createButton('Cancel', 'secondary'));
```
</details>
