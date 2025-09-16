# 3장: State와 생명주기 - 살아 움직이는 컴포넌트

State는 컴포넌트가 스스로 관리하는 내부 데이터입니다. 사용자의 상호작용 등으로 State가 변경되면, React는 컴포넌트를 다시 렌더링하여 화면을 업데이트합니다. 컴포넌트의 '생명'과도 같은 State와 생명주기를 다루는 방법을 배웁니다.

---

## 1. 핵심 개념

- **State**: 컴포넌트의 "상태"를 나타내는 데이터입니다. Props가 부모로부터 받은 '외적인' 데이터라면, State는 컴포넌트가 자체적으로 생성하고 관리하는 '내적인' 데이터입니다.

- **`useState` Hook**: 함수형 컴포넌트에서 State를 사용할 수 있게 해주는 Hook(훅)입니다.
    - `const [state, setState] = useState(initialValue);` 형태로 사용합니다.
    - `state`: 현재 상태 값.
    - `setState`: 상태를 업데이트하는 함수. 이 함수를 통해서만 상태를 변경해야 React가 변화를 감지하고 리렌더링을 수행합니다.
    - `initialValue`: 상태의 초기값.

- **컴포넌트 생명주기(Life-cycle)**: 컴포넌트가 생성되고(mount), 업데이트되고(update), 사라지는(unmount) 과정을 의미합니다.

- **`useEffect` Hook**: 컴포넌트의 생명주기 시점에 맞추어 특정 작업(부수 효과, Side Effect)을 수행하게 해주는 Hook입니다.
    - **Side Effects**: 데이터 가져오기(fetching), 구독(subscription) 설정, 수동 DOM 조작 등 React의 주된 렌더링 흐름과 관계없는 작업을 의미합니다.
    - `useEffect(callback, dependencyArray);` 형태로 사용합니다.
    - `callback`: 수행할 작업(함수).
    - `dependencyArray` (의존성 배열): 이 배열 안의 값이 변경될 때만 `callback` 함수가 실행됩니다.
        - **`[]` (빈 배열)**: 컴포넌트가 처음 마운트될 때 **한 번만** 실행됩니다.
        - **생략**: 리렌더링될 때마다 실행됩니다. (주의해서 사용해야 함)
        - **`[state, props]`**: 배열 안의 `state`나 `props`가 변경될 때마다 실행됩니다.

---

## 2. 예제 코드

### 예제 1: `useState`로 입력값 관리하기

사용자가 입력하는 텍스트를 실시간으로 State에 저장하고 화면에 보여주는 예제입니다.

```javascript
// src/components/EchoInput.js
import React, { useState } from 'react';

function EchoInput() {
  // 'text'라는 이름의 state를 만들고, 초기값은 빈 문자열로 설정
  const [text, setText] = useState('');

  // input의 내용이 변경될 때마다 호출되는 함수
  const handleChange = (event) => {
    // event.target.value로 input의 현재 값을 가져와 state를 업데이트
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={handleChange} placeholder="여기에 입력하세요..." />
      <p>입력된 내용: {text}</p>
    </div>
  );
}

export default EchoInput;
```

### 예제 2: `useEffect`로 데이터 가져오기

컴포넌트가 처음 렌더링될 때 외부 API에서 데이터를 가져와 State에 저장하는 예제입니다.

```javascript
// src/components/PostViewer.js
import React, { useState, useEffect } from 'react';

function PostViewer() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect의 의존성 배열을 []로 설정하여,
  // 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 함
  useEffect(() => {
    // 외부 API에서 데이터 가져오기
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => response.json())
      .then(data => {
        setPost(data); // 가져온 데이터로 post state 업데이트
        setLoading(false); // 로딩 상태 종료
      });
  }, []); // 빈 배열!

  return (
    <div>
      <h1>게시글 뷰어</h1>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      )}
    </div>
  );
}

export default PostViewer;
```

---

## 3. 연습 문제

### 문제 1: 색상 변경기 만들기
- **요구사항**: `useState`를 사용하여 현재 색상 이름을 저장하는 `ColorPicker` 컴포넌트를 만드세요.
- **세부사항**:
    1. "Red", "Green", "Blue" 세 개의 버튼을 만듭니다.
    2. 현재 선택된 색상을 표시하는 `div`를 만듭니다. (예: `<div style={{ color: currentColor }}>현재 색상: {currentColor}</div>`)
    3. 각 버튼을 클릭하면 해당 색상 이름으로 state가 변경되고, `div`의 글자 색도 함께 바뀌어야 합니다.
- **도전과제**: `div`의 글자 색뿐만 아니라 배경색도 함께 변경해보세요.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
import React, { useState } from 'react';

function ColorPicker() {
  const [color, setColor] = useState('black');

  return (
    <div>
      <div style={{ 
        color: color, 
        backgroundColor: '#f0f0f0', 
        padding: '10px',
        fontSize: '20px'
      }}>
        현재 선택된 색상: {color}
      </div>
      <button onClick={() => setColor('red')}>Red</button>
      <button onClick={() => setColor('green')}>Green</button>
      <button onClick={() => setColor('blue')}>Blue</button>
    </div>
  );
}

export default ColorPicker;
```
</details>

### 문제 2: 마우스 좌표 추적기 만들기
- **요구사항**: `useEffect`를 사용하여 마우스의 현재 X, Y 좌표를 화면에 표시하는 `MouseTracker` 컴포넌트를 만드세요.
- **세부사항**:
    1. `useState`로 마우스 좌표를 저장할 `position` state를 만듭니다. (초기값: `{ x: 0, y: 0 }`)
    2. `useEffect`를 사용하여 컴포넌트가 마운트될 때 `window` 객체에 `mousemove` 이벤트 리스너를 추가합니다.
    3. 이벤트 리스너 콜백 함수에서는 `setPosition`을 호출하여 마우스 좌표 state를 업데이트합니다.
    4. **(중요)** `useEffect`의 클린업(cleanup) 함수에서 컴포넌트가 언마운트될 때 `removeEventListener`를 사용하여 이벤트 리스너를 제거해야 합니다. (메모리 누수 방지)
- **도전과제**: 마우스가 움직일 때만 좌표가 업데이트되도록 최적화해보세요.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
import React, { useState, useEffect } from 'react';

function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    // 이벤트 리스너 추가
    window.addEventListener('mousemove', handleMouseMove);
    console.log('이벤트 리스너가 추가되었습니다.');

    // 클린업 함수: 컴포넌트가 사라질 때 실행됨
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      console.log('이벤트 리스너가 제거되었습니다.');
    };
  }, []); // 의존성 배열이 비어있으므로, 마운트/언마운트 시 한 번씩만 실행

  return (
    <p>
      마우스 좌표: X: {position.x}, Y: {position.y}
    </p>
  );
}

export default MouseTracker;
```
</details>
