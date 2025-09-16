# 4장: 이벤트 핸들링 - 사용자와의 상호작용

사용자의 클릭, 입력, 마우스 움직임 등 다양한 행동에 반응하는 방법을 배웁니다. React의 이벤트 시스템은 웹 표준과 유사하지만 몇 가지 차이점이 있습니다.

---

## 1. 핵심 개념

- **이벤트 핸들러(Event Handler)**: 특정 이벤트가 발생했을 때 실행되는 함수입니다.
- **이벤트 바인딩**: JSX 엘리먼트에 이벤트 핸들러 함수를 연결하는 과정입니다.
- **React 이벤트 시스템의 특징**:
    1.  **카멜 케이스(camelCase)**: 이벤트 이름은 `onclick`, `onmouseover` 대신 `onClick`, `onMouseOver`와 같이 카멜 케이스를 사용합니다.
    2.  **함수 전달**: HTML에서는 문자열 형태로 코드를 전달하지만(`onclick="alert('hello')"`), React에서는 함수 자체를 전달합니다 (`onClick={handleClick}`).
    3.  **기본 동작 방지**: HTML에서 `return false;`로 기본 동작을 막는 것과 달리, React에서는 `event.preventDefault()`를 명시적으로 호출해야 합니다.

- **이벤트 객체(Event Object)**: React는 웹 표준과 동일한 이벤트 객체를 감싼 **합성 이벤트(SyntheticEvent)** 객체를 핸들러에 전달합니다. 이를 통해 모든 브라우저에서 이벤트가 동일하게 동작하도록 보장합니다.

---

## 2. 예제 코드

### 예제 1: 다양한 이벤트 핸들링

클릭, 마우스 오버, 입력 변경 등 다양한 이벤트를 처리하는 방법을 보여줍니다.

```javascript
import React, { useState } from 'react';

function EventExamples() {
  const [message, setMessage] = useState('여기에 메시지가 표시됩니다.');

  // 버튼 클릭 이벤트 핸들러
  const handleClick = () => {
    setMessage('버튼이 클릭되었습니다!');
  };

  // div에 마우스가 들어왔을 때의 이벤트 핸들러
  const handleMouseOver = () => {
    setMessage('마우스가 위에 있습니다.');
  };

  // div에서 마우스가 나갔을 때의 이벤트 핸들러
  const handleMouseOut = () => {
    setMessage('마우스가 벗어났습니다.');
  };
  
  // form 제출 이벤트 핸들러
  const handleSubmit = (event) => {
    event.preventDefault(); // form의 기본 제출 동작(페이지 새로고침)을 막음
    alert('폼이 제출되었습니다.');
  };

  return (
    <div>
      <p>{message}</p>
      <button onClick={handleClick}>클릭하세요</button>
      
      <div 
        onMouseOver={handleMouseOver} 
        onMouseOut={handleMouseOut}
        style={{ width: '200px', height: '100px', backgroundColor: 'lightblue', marginTop: '10px' }}
      >
        이곳에 마우스를 올려보세요.
      </div>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <button type="submit">폼 제출</button>
      </form>
    </div>
  );
}

export default EventExamples;
```

### 예제 2: 이벤트 핸들러에 인자 전달하기

`map` 안에서 특정 항목에 대한 이벤트를 처리할 때처럼, 이벤트 핸들러에 추가적인 정보를 전달해야 할 때가 있습니다.

```javascript
function ItemList() {
  const items = [
    { id: 1, name: '사과' },
    { id: 2, name: '바나나' },
    { id: 3, name: '오렌지' },
  ];

  // item.name을 인자로 받는 이벤트 핸들러
  const handleItemClick = (itemName) => {
    alert(`${itemName}을(를) 선택했습니다.`);
  };

  return (
    <ul>
      {items.map((item) => (
        <li 
          key={item.id} 
          // onClick에 화살표 함수를 전달하여, 클릭 시 handleItemClick을 호출하도록 함
          onClick={() => handleItemClick(item.name)}
          style={{ cursor: 'pointer' }}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}

export default ItemList;
```
**주의**: `onClick={handleItemClick(item.name)}` 과 같이 직접 함수를 호출하면, 렌더링 시점에 함수가 실행되어 버립니다. 반드시 `() => handleItemClick(item.name)` 처럼 함수를 반환하는 형태로 작성해야 합니다.

---

## 3. 연습 문제

### 문제 1: 간단한 계산기 만들기
- **요구사항**: 두 개의 `input`과 "더하기", "빼기" 버튼을 가진 간단한 계산기 컴포넌트를 만드세요.
- **세부사항**:
    1. `useState`를 사용하여 두 개의 숫자 입력값(`num1`, `num2`)과 결과(`result`)를 관리합니다.
    2. "더하기" 버튼을 클릭하면 `num1`과 `num2`를 더한 결과가 `result`에 표시됩니다.
    3. "빼기" 버튼을 클릭하면 `num1`에서 `num2`를 뺀 결과가 `result`에 표시됩니다.
- **힌트**: `input`의 `value`는 문자열이므로, 계산 전에 `Number()` 함수로 숫자로 변환해야 합니다.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
import React, { useState } from 'react';

function SimpleCalculator() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState(0);

  const handleAdd = () => {
    setResult(Number(num1) + Number(num2));
  };

  const handleSubtract = () => {
    setResult(Number(num1) - Number(num2));
  };

  return (
    <div>
      <input 
        type="number" 
        value={num1} 
        onChange={(e) => setNum1(e.target.value)} 
      />
      <input 
        type="number" 
        value={num2} 
        onChange={(e) => setNum2(e.target.value)} 
      />
      <br />
      <button onClick={handleAdd}>더하기</button>
      <button onClick={handleSubtract}>빼기</button>
      <h2>결과: {result}</h2>
    </div>
  );
}

export default SimpleCalculator;
```
</details>

### 문제 2: 배경색 변경기 만들기
- **요구사항**: `div`를 클릭하면 배경색이 랜덤한 색상으로 바뀌는 컴포넌트를 만드세요.
- **세부사항**:
    1. `useState`로 배경색(`backgroundColor`)을 관리합니다.
    2. `div`에 `onClick` 이벤트 핸들러를 추가합니다.
    3. 클릭 시, 랜덤한 색상 코드를 생성하여 `backgroundColor` state를 업데이트합니다.
- **힌트**: 랜덤 색상 코드는 `Math.random()`과 `toString(16)`을 조합하여 만들 수 있습니다. (예: `'#' + Math.floor(Math.random()*16777215).toString(16)`)

<details>
<summary>문제 2 정답 예시</summary>

```javascript
import React, { useState } from 'react';

function RandomColorBox() {
  const [color, setColor] = useState('#ffffff');

  const changeColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColor(randomColor);
  };

  return (
    <div 
      onClick={changeColor}
      style={{
        width: '200px',
        height: '200px',
        backgroundColor: color,
        cursor: 'pointer',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      Click me to change color!
    </div>
  );
}

export default RandomColorBox;
```
</details>
