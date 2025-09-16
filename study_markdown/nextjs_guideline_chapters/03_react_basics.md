# Chapter 3: 핵심 개념 (2) - React 기초 다지기

Next.js는 React라는 도서관 위에 지어진 집과 같습니다. 집의 구조를 이해하려면 먼저 도서관(React)의 핵심 개념을 알아야 합니다. 여기서는 Spring 개발자에게 생소할 수 있는 React의 기본 문법 4가지를 소개합니다.

---

## 1. 컴포넌트(Component): UI를 조립하는 부품

컴포넌트는 UI를 구성하는 독립적이고 재사용 가능한 부품입니다. JavaScript 함수 형태로 만들며, HTML처럼 보이는 JSX를 반환합니다. 잘게 쪼개진 여러 개의 컴포넌트를 조립하여 하나의 완전한 페이지를 만듭니다.

## 2. JSX: JavaScript와 HTML의 만남

JavaScript 파일 안에서 HTML과 유사한 문법을 사용할 수 있게 해주는 확장 문법입니다. JSX를 사용하면 UI 로직과 렌더링 코드를 한곳에서 관리하기 용이합니다.

```jsx
const userName = "World";
// JSX 안에서 JavaScript 변수/표현식을 사용하려면 중괄호 {}를 씁니다.
const element = <h1>Hello, {userName}!</h1>;
```

## 3. Props: 컴포넌트에 데이터 전달하기

`Props` (properties의 줄임말)는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방법입니다. 마치 메소드를 호출할 때 파라미터를 넘겨주는 것과 같습니다. Props는 자식 컴포넌트 내에서 변경할 수 없는 **읽기 전용(read-only)** 데이터입니다.

## 4. State (`useState`): 컴포넌트의 상태 관리

`State`는 컴포넌트가 자체적으로 가지는, 시간이 지나면서 변할 수 있는 '상태' 데이터입니다. 사용자의 클릭, 입력 등 상호작용에 따라 변하는 값들을 State로 관리합니다.

`useState`는 React에서 State를 사용하기 위한 **훅(Hook)**입니다. `useState`를 통해 State를 만들고, 이 State를 변경하는 함수를 함께 제공받습니다. **중요한 점은, 이 함수로 State를 변경해야만 React가 변화를 감지하고 화면을 자동으로 다시 렌더링(re-rendering)한다는 것입니다.**

---

### 💡 예제: 카운터와 사용자 인사 컴포넌트 만들기

1.  **Props를 사용하는 `Greeting` 컴포넌트**

    ```jsx
    // src/components/Greeting.js
    // (src 폴더 아래에 components 폴더를 새로 만드세요)

    // props 객체를 통해 name과 age 값을 전달받습니다.
    export default function Greeting({ name, age }) {
      return (
        <p>
          안녕하세요, {age}세 {name}님!
        </p>
      );
    }
    ```

2.  **State를 사용하는 `Counter` 컴포넌트**

    ```jsx
    // src/components/Counter.js
    import { useState } from 'react';

    export default function Counter() {
      // count라는 state 변수와, 이 변수를 변경할 setCount 함수를 선언합니다.
      // useState(0)은 count의 초기값을 0으로 설정합니다.
      const [count, setCount] = useState(0);

      return (
        <div>
          <p>You clicked {count} times</p>
          {/* 버튼 클릭 시 setCount 함수를 호출하여 count 값을 1 증가시킵니다. */}
          <button onClick={() => setCount(count + 1)}>
            Click me
          </button>
        </div>
      );
    }
    ```

3.  **페이지에서 컴포넌트 조립하기**

    ```jsx
    // src/pages/index.js
    import Greeting from '../components/Greeting';
    import Counter from '../components/Counter';

    export default function Home() {
      return (
        <div>
          <h1>React 기초</h1>
          {/* Greeting 컴포넌트에 name과 age라는 props를 전달합니다. */}
          <Greeting name="김진숙" age={30} />
          <hr />
          <h2>카운터 예제</h2>
          <Counter />
        </div>
      );
    }
    ```

### ✏️ 문제

**문제 1:** 상품 정보를 표시하는 `ProductCard` 컴포넌트를 만들어보세요.
*   `src/components/ProductCard.js` 파일을 생성합니다.
*   이 컴포넌트는 `productName`과 `price`를 props로 받습니다.
*   화면에는 "상품명: [productName], 가격: [price]원" 형식으로 표시합니다.

**문제 2:** `index.js` 페이지에서 방금 만든 `ProductCard` 컴포넌트를 3번 사용해, 3개의 다른 상품 정보를 화면에 표시해보세요.
