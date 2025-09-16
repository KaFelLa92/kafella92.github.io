# 8장: Hooks 심화 - React 능력 끌어올리기

`useState`와 `useEffect` 외에, React는 더 다양하고 강력한 Hook들을 제공합니다. 복잡한 상태 로직을 관리하거나, 불필요한 렌더링을 방지하여 성능을 최적화하는 등 고급 기능을 다루는 Hook들을 배웁니다.

---

## 1. 핵심 개념

- **`useContext`**: "Props drilling" 문제를 해결하기 위한 Hook입니다. Props drilling이란, 여러 단계의 중첩된 컴포넌트를 거쳐 데이터를 전달하는 것을 말합니다. `useContext`를 사용하면, 상위 컴포넌트에서 제공한 데이터를 트리 깊숙한 곳의 하위 컴포넌트에서 props 없이 직접 가져다 쓸 수 있습니다. (예: 테마, 언어 설정, 사용자 인증 정보 등 전역적인 데이터)

- **`useReducer`**: `useState`의 대안으로, 더 복잡한 상태 로직을 관리할 때 유용합니다. 특히, 여러 하위 값을 포함하는 객체 형태의 state를 다루거나, 다음 state가 이전 state에 의존적인 경우에 효과적입니다. `(state, action) => newState` 형태의 리듀서(reducer) 함수를 사용합니다.

- **`useCallback`**: **함수를 메모리제이션(memoization)**하는 Hook입니다. 의존성 배열의 값이 변경되었을 때만 함수를 새로 생성하고, 그렇지 않으면 이전에 생성한 함수를 재사용합니다. 자식 컴포넌트에 콜백 함수를 prop으로 전달할 때, 부모 컴포넌트의 불필요한 리렌더링으로 인해 자식 컴포넌트까지 리렌더링되는 것을 방지하여 성능을 최적화할 수 있습니다.

- **`useMemo`**: **연산된 값을 메모리제이션**하는 Hook입니다. 비용이 큰(오래 걸리는) 연산의 결과를 기억해두고, 의존성 배열의 값이 변경되었을 때만 연산을 다시 수행합니다. 렌더링 과정에서 복잡한 계산이 반복되는 것을 막아 성능을 향상시킵니다.

---

## 2. 예제 코드

### 예제 1: `useContext`로 테마 적용하기

Props drilling 없이 모든 하위 컴포넌트에서 테마 정보에 접근하는 예제입니다.

```javascript
// src/contexts/ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

// 1. Context 생성
const ThemeContext = createContext();

// 2. Context를 사용하는 커스텀 훅 (편의를 위해)
export function useTheme() {
  return useContext(ThemeContext);
}

// 3. Context Provider 컴포넌트: 하위 컴포넌트에 값을 제공
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// src/App.js
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function ThemedButton() {
  // 4. 하위 컴포넌트에서 useContext (또는 커스텀 훅)로 값 사용
  const { theme, toggleTheme } = useTheme();
  
  const style = {
    backgroundColor: theme === 'light' ? '#fff' : '#333',
    color: theme === 'light' ? '#000' : '#fff',
  };

  return <button style={style} onClick={toggleTheme}>테마 전환</button>;
}

function App() {
  return (
    // 5. 최상위에서 Provider로 감싸기
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```

### 예제 2: `useReducer`로 복잡한 카운터 만들기

`useState` 대신 `useReducer`를 사용하여 여러 종류의 상태 변경을 관리합니다.

```javascript
import React, { useReducer } from 'react';

// 리듀서 함수: 현재 state와 action 객체를 받아 새로운 state를 반환
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'add':
      return { count: state.count + action.payload };
    default:
      throw new Error();
  }
}

function ComplexCounter() {
  // useReducer(리듀서 함수, 초기 state)
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      Count: {state.count}
      {/* dispatch 함수에 action 객체를 전달하여 상태 변경을 요청 */}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'add', payload: 5 })}>+5</button>
    </>
  );
}
```

---

## 3. 연습 문제

### 문제 1: `useCallback`으로 리렌더링 최적화하기
- **요구사항**: `Search` 컴포넌트와 `SearchResult` 컴포넌트를 만드세요. `Search` 컴포넌트의 `input`에 텍스트를 입력해도, 검색 결과(`SearchResult`)와 관련 없는 `Title` 컴포넌트는 리렌더링되지 않도록 최적화하세요.
- **세부사항**:
    1. `Title` 컴포넌트는 `React.memo`로 감싸서 props가 변경되지 않으면 리렌더링되지 않게 합니다.
    2. `Search` 컴포넌트에서 `Title` 컴포넌트에 전달하는 `handleSearch` 함수를 `useCallback`으로 메모리제이션합니다.
    3. `Search` 컴포넌트의 `input` state가 변경될 때, 콘솔에 "Title rendered"가 찍히지 않아야 성공입니다.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
import React, { useState, useCallback } from 'react';

// React.memo: props가 같으면 리렌더링을 스킵
const Title = React.memo(({ text, onSearch }) => {
  console.log(`${text} rendered`);
  return <h1 onClick={onSearch}>{text}</h1>;
});

function Search() {
  const [query, setQuery] = useState('');

  // query state가 변경되어도 이 함수는 재생성되지 않음
  const handleSearch = useCallback(() => {
    alert('검색을 시작합니다!');
  }, []); // 의존성 배열이 비어있으므로, 최초 렌더링 시에만 생성

  return (
    <div>
      <Title text="검색 페이지" onSearch={handleSearch} />
      <input 
        type="text" 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="검색어 입력..."
      />
      <p>현재 검색어: {query}</p>
    </div>
  );
}
```
</details>

### 문제 2: `useMemo`로 복잡한 계산 최적화하기
- **요구사항**: 숫자 배열과 필터링 키워드를 받아, 키워드가 포함된 숫자만 필터링하고 합산하는 컴포넌트를 만드세요.
- **세부사항**:
    1. `numbers` 배열(예: `[10, 21, 32, 41, 53]`)과 `keyword` state(초기값: `'1'`)를 가집니다.
    2. `useMemo`를 사용하여, `numbers` 배열이나 `keyword`가 변경될 때만 필터링 및 합산 연산을 수행하도록 합니다.
    3. `keyword`와 관련 없는 다른 state(예: 카운터)를 추가하고, 해당 state가 변경될 때는 `useMemo`의 콜백 함수가 다시 실행되지 않음을 콘솔 로그로 확인합니다.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
import React, { useState, useMemo } from 'react';

const numbers = Array.from({ length: 100 }, (_, i) => i + 1); // 1부터 100까지 배열

function ExpensiveCalculationComponent() {
  const [keyword, setKeyword] = useState('1');
  const [count, setCount] = useState(0); // 관련 없는 state

  const filteredSum = useMemo(() => {
    console.log('복잡한 계산 수행 중...');
    return numbers
      .filter(num => num.toString().includes(keyword))
      .reduce((acc, cur) => acc + cur, 0);
  }, [keyword]); // keyword가 바뀔 때만 재계산

  return (
    <div>
      <input 
        type="text" 
        value={keyword} 
        onChange={e => setKeyword(e.target.value)}
        placeholder="필터링할 숫자"
      />
      <p>'{keyword}' 포함된 숫자의 합: {filteredSum}</p>
      <hr />
      <p>관련 없는 카운터: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>카운터 증가</button>
    </div>
  );
}
```
</details>
