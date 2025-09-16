
# React 전체 교육 과정 종합 가이드

이 문서는 React 학습 여정을 위한 종합적인 가이드입니다. 각 장은 핵심 개념, 코드 예제, 그리고 연습 문제로 구성되어 있어, 학습한 내용을 확실히 다지고 넘어갈 수 있도록 돕습니다.

---

## 1장: JSX와 컴포넌트

### 핵심 개념
- **컴포넌트(Component)**: React는 UI를 "컴포넌트"라는 독립적이고 재사용 가능한 조각으로 나누어 관리합니다. 각 컴포넌트는 자신만의 로직과 모양을 가집니다. 함수형 컴포넌트가 현대 React의 표준입니다.
- **JSX (JavaScript XML)**: JavaScript를 확장한 문법으로, UI가 어떻게 생겨야 하는지 설명하기 위해 사용됩니다. HTML과 비슷해 보이지만 실제로는 JavaScript이며, React 요소를 생성하는 `React.createElement()` 함수의 축약형입니다.

### 예제 코드: 기본 컴포넌트 만들기

```javascript
// src/components/Welcome.js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

export default Welcome;

// src/App.js
import Welcome from './components/Welcome';

function App() {  
  return (
    <div>
      <Welcome name="최동진" />
      <Welcome name="Gemini" />
    </div>
  );
}

export default App;
```

### 연습 문제
- **문제**: `MyProfile`이라는 이름의 컴포넌트를 만드세요. 이 컴포넌트는 당신의 이름과 간단한 자기소개를 `<h2>`와 `<p>` 태그를 사용하여 화면에 표시해야 합니다.
- **정답 예시**:
  ```javascript
  // src/components/MyProfile.js
  function MyProfile() {
    return (
      <div>
        <h2>최동진</h2>
        <p>리액트를 배우고 있는 개발자입니다. 반갑습니다!</p>
      </div>
    );
  }

  export default MyProfile;
  ```

---

## 2장: Props

### 핵심 개념
- **Props (Properties)**: 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 데 사용되는 읽기 전용(read-only) 객체입니다. Props를 통해 컴포넌트를 동적으로 만들고 재사용성을 높일 수 있습니다.

### 예제 코드: Props로 데이터 전달하기

```javascript
// src/components/Book.js
function Book(props) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>저자: {props.author}</p>
    </div>
  );
}

export default Book;

// src/App.js
import Book from './components/Book';

function App() {
  return (
    <div>
      <Book title="리액트 마스터하기" author="최동진" />
      <Book title="AI와 함께 코딩하기" author="Gemini" />
    </div>
  );
}

export default App;
```

### 연습 문제
- **문제**: `Product` 컴포넌트를 만드세요. 이 컴포넌트는 `name`(상품명)과 `price`(가격)를 props로 받아 화면에 "상품명: [이름], 가격: [가격]원" 형식으로 표시해야 합니다.
- **정답 예시**:
  ```javascript
  // src/components/Product.js
  function Product(props) {
    return (
      <p>상품명: {props.name}, 가격: {props.price}원</p>
    );
  }
  
  export default Product;
  ```

---

## 3장: State와 생명주기

### 핵심 개념
- **State**: 컴포넌트가 내부적으로 관리하는 데이터입니다. State가 변경되면 컴포넌트는 다시 렌더링되어 UI를 업데이트합니다.
- **`useState` Hook**: 함수형 컴포넌트에서 state를 사용할 수 있게 해주는 Hook입니다. `const [state, setState] = useState(initialValue);` 형태로 사용합니다.
- **`useEffect` Hook**: 컴포넌트의 생명주기(Life-cycle)와 관련된 부수 효과(side effects)를 처리하는 Hook입니다. 데이터 가져오기, 구독 설정, 수동 DOM 조작 등의 작업을 수행합니다.

### 예제 코드: State와 Effect 사용하기

```javascript
// src/components/Counter.js
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // useEffect는 count 값이 변경될 때마다 실행됩니다.
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // 의존성 배열에 'count'를 전달

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;
```

### 연습 문제
- **문제**: 1초마다 1씩 증가하는 타이머를 만드세요. `useEffect`를 사용하여 컴포넌트가 마운트될 때 `setInterval`을 설정하고, 언마운트될 때 `clearInterval`로 정리해야 합니다.
- **정답 예시**:
  ```javascript
  import React, { useState, useEffect } from 'react';

  function Timer() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
      const intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);

      // 클린업(cleanup) 함수: 컴포넌트가 언마운트될 때 실행
      return () => clearInterval(intervalId);
    }, []); // 의존성 배열이 비어있으므로, 마운트 시 한 번만 실행

    return <p>타이머: {seconds}초</p>;
  }

  export default Timer;
  ```

---

## 4장: 이벤트 핸들링

### 핵심 개념
- React의 이벤트는 HTML과 유사하지만, 카멜 케이스(camelCase)를 사용하고, 함수를 직접 전달합니다. (예: `onclick` 대신 `onClick`)
- 이벤트 핸들러 함수를 정의하여 사용자의 클릭, 입력, 마우스 오버 등 다양한 상호작용에 반응할 수 있습니다.

### 예제 코드: 버튼 클릭 이벤트 처리

```javascript
function AlertButton() {
  const handleClick = () => {
    alert('버튼이 클릭되었습니다!');
  };

  return (
    <button onClick={handleClick}>
      클릭하세요
    </button>
  );
}
```

### 연습 문제
- **문제**: 버튼을 클릭하면 "ON"과 "OFF" 텍스트가 번갈아 나타나는 토글 버튼을 만드세요. `useState`를 사용하여 버튼의 상태를 관리해야 합니다.
- **정답 예시**:
  ```javascript
  import React, { useState } from 'react';

  function ToggleButton() {
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
      setIsOn(!isOn);
    };

    return (
      <button onClick={handleToggle}>
        {isOn ? 'ON' : 'OFF'}
      </button>
    );
  }
  ```

---

## 5장: 조건부 렌더링

### 핵심 개념
- 특정 조건에 따라 다른 컴포넌트나 엘리먼트를 렌더링하는 기법입니다.
- `if` 문, 논리 연산자 `&&`, 삼항 연산자 `(condition ? true : false)` 등을 사용하여 구현할 수 있습니다.

### 예제 코드: 로그인 상태에 따라 다른 UI 보여주기

```javascript
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>환영합니다!</h1>;
  }
  return <h1>로그인 해주세요.</h1>;
}

function LoginButton({ onClick }) {
  return <button onClick={onClick}>로그인</button>;
}

function LogoutButton({ onClick }) {
  return <button onClick={onClick}>로그아웃</button>;
}

// ... 컴포넌트 내부에서 ...
// {isLoggedIn ? <LogoutButton /> : <LoginButton />}
```

### 연습 문제
- **문제**: `isLoading`이라는 state가 `true`이면 "로딩 중..."이라는 메시지를, `false`이면 "데이터 로딩 완료!"라는 메시지를 보여주는 컴포넌트를 만드세요.
- **정답 예시**:
  ```javascript
  import React, { useState, useEffect } from 'react';

  function DataLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // 2초 후에 로딩 상태를 false로 변경
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div>
        {isLoading ? <p>로딩 중...</p> : <p>데이터 로딩 완료!</p>}
      </div>
    );
  }
  ```

---

## 6장: 리스트와 Key

### 핵심 개념
- 배열의 각 항목을 동적으로 렌더링하기 위해 `map()` 함수를 사용합니다.
- **Key**: 리스트의 각 엘리먼트에 부여해야 하는 고유한 문자열 속성입니다. React는 `key`를 사용하여 변경, 추가, 또는 제거된 항목을 식별하고 효율적으로 UI를 업데이트합니다. `key`는 형제 엘리먼트 사이에서만 고유하면 됩니다.

### 예제 코드: 배열을 리스트로 렌더링하기

```javascript
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);

// JSX 안에서
// <ul>{listItems}</ul>
```

### 연습 문제
- **문제**: `const fruits = ['사과', '바나나', '오렌지'];` 배열을 사용하여, 각 과일의 이름을 `<li>` 태그로 감싼 정돈되지 않은 리스트(`<ul>`)를 렌더링하는 `FruitList` 컴포넌트를 만드세요.
- **정답 예시**:
  ```javascript
  function FruitList() {
    const fruits = ['사과', '바나나', '오렌지'];
    return (
      <ul>
        {fruits.map((fruit, index) => (
          <li key={index}>{fruit}</li>
        ))}
      </ul>
    );
  }
  ```

---

## 7장: 폼 다루기

### 핵심 개념
- **제어 컴포넌트(Controlled Component)**: React에서는 폼 엘리먼트(input, textarea, select 등)의 값을 컴포넌트의 state로 관리하는 것을 권장합니다. `value`는 state와 연결하고, `onChange` 이벤트 핸들러로 state를 업데이트합니다.

### 예제 코드: 이름 입력 폼

```javascript
import React, { useState } from 'react';

function NameForm() {
  const [name, setName] = useState('');

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    alert('제출된 이름: ' + name);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        이름:
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <button type="submit">제출</button>
    </form>
  );
}
```

### 연습 문제
- **문제**: `textarea`를 사용하여 사용자가 의견을 남길 수 있는 피드백 폼을 만드세요. 제출 버튼을 누르면 `alert`로 피드백 내용이 표시되어야 합니다.
- **정답 예시**:
  ```javascript
  import React, { useState } from 'react';

  function FeedbackForm() {
    const [feedback, setFeedback] = useState('');

    const handleChange = (e) => setFeedback(e.target.value);

    const handleSubmit = (e) => {
      e.preventDefault();
      alert('피드백: ' + feedback);
    };

    return (
      <form onSubmit={handleSubmit}>
        <textarea value={feedback} onChange={handleChange} />
        <button type="submit">피드백 제출</button>
      </form>
    );
  }
  ```

---

## 8장: Hooks 심화

### 핵심 개념
- **`useContext`**: Props drilling 없이 컴포넌트 트리 전체에 데이터를 전달할 수 있게 해줍니다. (테마, 언어 설정 등)
- **`useReducer`**: `useState`의 대안으로, 복잡한 state 로직을 관리할 때 유용합니다.
- **`useCallback`**: 특정 함수를 메모리제이션(기억)하여, 의존성이 변경되었을 때만 함수가 재생성되도록 합니다. 자식 컴포넌트에 콜백을 전달할 때 불필요한 리렌더링을 방지합니다.
- **`useMemo`**: 값비싼 연산의 결과를 메모리제이션하여, 의존성이 변경되었을 때만 다시 계산합니다.

### 예제 코드: `useCallback`으로 함수 최적화

```javascript
import React, { useState, useCallback } from 'react';

// MemoizedButton은 props가 변경되지 않으면 리렌더링되지 않습니다.
const MemoizedButton = React.memo(({ onClick }) => {
  console.log("Button rendered");
  return <button onClick={onClick}>Click me</button>;
});

function App() {
  const [count, setCount] = useState(0);

  // useCallback을 사용하여 handleClick 함수가 재생성되는 것을 방지
  const handleClick = useCallback(() => {
    console.log("Button clicked!");
  }, []); // 의존성 배열이 비어있으므로, 함수는 절대 변하지 않음

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <MemoizedButton onClick={handleClick} />
    </div>
  );
}
```

### 연습 문제
- **문제**: `useMemo`를 사용하여, 입력된 숫자의 팩토리얼을 계산하는 컴포넌트를 만드세요. 팩토리얼 계산은 비용이 큰 작업이라고 가정합니다. 입력 숫자가 변경될 때만 팩토리얼이 다시 계산되어야 합니다.
- **정답 예시**:
  ```javascript
  import React, { useState, useMemo } from 'react';

  function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  }

  function FactorialCalculator() {
    const [number, setNumber] = useState(5);

    const result = useMemo(() => {
      console.log('Calculating factorial...');
      return factorial(number);
    }, [number]);

    return (
      <div>
        <input 
          type="number" 
          value={number} 
          onChange={e => setNumber(Number(e.target.value))} 
        />
        <p>{number}의 팩토리얼: {result}</p>
      </div>
    );
  }
  ```

---

## 9장: 스타일링

### 핵심 개념
- **CSS 파일 임포트**: `import './App.css';` 와 같이 CSS 파일을 직접 임포트하여 사용합니다.
- **CSS Modules**: CSS 클래스 이름을 고유하게 만들어 충돌을 방지합니다. `[filename].module.css` 형식으로 파일을 만듭니다.
- **CSS-in-JS**: JavaScript 코드 내에서 CSS를 작성하는 방식입니다. (예: `styled-components`, `Emotion`)

### 예제 코드: CSS Modules 사용하기

```css
/* styles.module.css */
.title {
  color: blue;
  font-size: 24px;
}
```

```javascript
// MyComponent.js
import styles from './styles.module.css';

function MyComponent() {
  return <h1 className={styles.title}>Hello, CSS Modules!</h1>;
}
```

### 연습 문제
- **문제**: `Button` 컴포넌트를 만드세요. 이 컴포넌트는 `primary`라는 prop을 받습니다. `primary`가 `true`이면 파란색 배경에 흰색 글씨, `false`이면 회색 배경에 검은색 글씨를 갖도록 인라인 스타일을 적용해보세요.
- **정답 예시**:
  ```javascript
  function Button({ primary, children }) {
    const style = {
      backgroundColor: primary ? 'blue' : 'grey',
      color: primary ? 'white' : 'black',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
    };

    return <button style={style}>{children}</button>;
  }
  ```

---

## 10장: React Router

### 핵심 개념
- **SPA (Single Page Application)**: 단일 HTML 페이지에서 동적으로 컨텐츠를 변경하여 여러 페이지처럼 보이게 하는 웹 애플리케이션입니다.
- **`react-router-dom`**: React 기반 SPA를 위한 라우팅 라이브러리입니다.
- **주요 컴포넌트**:
  - `BrowserRouter`: HTML5 History API를 사용하여 UI를 URL과 동기화합니다.
  - `Routes`: 여러 `Route`를 감싸는 컨테이너입니다.
  - `Route`: 특정 경로(`path`)와 렌더링할 컴포넌트(`element`)를 연결합니다.
  - `Link`: 페이지를 새로고침하지 않고 다른 경로로 이동할 수 있는 네비게이션 링크를 만듭니다.

### 예제 코드: 기본 라우팅 설정

```javascript
// src/App.js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() { return <h2>홈</h2>; }
function About() { return <h2>소개</h2>; }

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">홈</Link> | <Link to="/about">소개</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 연습 문제
- **문제**: 위 예제에 `/contact` 경로로 이동하는 `Contact` 페이지를 추가하세요. 네비게이션 바에도 "연락처" 링크를 추가해야 합니다.
- **정답 예시**:
  ```javascript
  // ... App.js 상단 ...
  function Contact() { return <h2>연락처</h2>; }

  function App() {
    return (
      <BrowserRouter>
        <nav>
          <Link to="/">홈</Link> | <Link to="/about">소개</Link> | <Link to="/contact">연락처</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    );
  }
  ```

---

## 11장: 전역 상태 관리 (Zustand)

### 핵심 개념
- **전역 상태**: 여러 컴포넌트가 공유하고 접근해야 하는 상태입니다.
- **Zustand**: 간단하고 강력한 React용 상태 관리 라이브러리입니다. `create` 함수로 스토어(store)를 만들고, 컴포넌트에서 훅처럼 사용하여 상태와 액션을 가져옵니다.

### 예제 코드: Zustand로 카운터 만들기

```javascript
// src/stores/countStore.js
import { create } from 'zustand';

const useCountStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));

export default useCountStore;

// src/components/CounterDisplay.js
import useCountStore from '../stores/countStore';

function CounterDisplay() {
  const count = useCountStore((state) => state.count);
  return <h1>Count: {count}</h1>;
}

// src/components/CounterControls.js
import useCountStore from '../stores/countStore';

function CounterControls() {
  const { increase, decrease } = useCountStore();
  return (
    <div>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
    </div>
  );
}
```

### 연습 문제
- **문제**: 사용자의 로그인 상태(`isLoggedIn`)와 이름(`username`)을 관리하는 `useAuthStore`를 만드세요. `login`과 `logout` 액션을 포함해야 합니다.
- **정답 예시**:
  ```javascript
  // src/stores/authStore.js
  import { create } from 'zustand';

  const useAuthStore = create((set) => ({
    isLoggedIn: false,
    username: null,
    login: (username) => set({ isLoggedIn: true, username: username }),
    logout: () => set({ isLoggedIn: false, username: null }),
  }));

  export default useAuthStore;
  ```

---

## 12장: 최종 프로젝트 - 미니 블로그

### 프로젝트 개요
지금까지 배운 모든 기술을 활용하여 간단한 블로그 애플리케이션을 만듭니다.

- **기능**: 글 목록 보기, 새 글 작성, 글 상세 보기, 글 수정, 글 삭제
- **사용 기술**: React, React Router, Zustand

### 1단계: 프로젝트 구조 설정 (완료)
- `src` 폴더 내에 `components`, `pages`, `stores` 폴더를 생성했습니다.

### 2단계: 라우터 설정 (완료)
- `App.js`에서 `react-router-dom`을 사용하여 홈, 글 목록, 새 글 작성 페이지의 경로를 설정했습니다.

### 3단계: 페이지 및 컴포넌트 구현 (진행 예정)

#### `stores/postStore.js` 완성하기
- 기존 스토어에 글 수정(`updatePost`)과 삭제(`deletePost`) 액션을 추가합니다.

```javascript
// src/stores/postStore.js
import { create } from 'zustand';

const usePostStore = create((set, get) => ({
  posts: [
    { id: 1, title: '리액트, 너는 대체...', content: '리액트를 처음 배우는데 생각보다 재미있네요.' },
    { id: 2, title: 'Zustand 사용법', content: '전역 상태 관리가 이렇게 쉬울 줄이야!' },
  ],
  nextPostId: 3,
  addPost: (post) => set((state) => ({
    posts: [...state.posts, { ...post, id: state.nextPostId }],
    nextPostId: state.nextPostId + 1,
  })),
  updatePost: (updatedPost) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ),
  })),
  deletePost: (id) => set((state) => ({
    posts: state.posts.filter(post => post.id !== id),
  })),
  getPostById: (id) => {
    // Zustand의 get() 함수를 사용하여 스토어의 최신 상태에 접근
    return get().posts.find((p) => p.id === id);
  }
}));

export default usePostStore;
```

#### `pages/PostListPage.js` 구현하기
- Zustand 스토어에서 게시글 목록을 가져와 화면에 렌더링합니다.
- 각 게시글 제목을 클릭하면 상세 페이지로 이동하도록 `Link`를 사용합니다.

```javascript
// src/pages/PostListPage.js
import { Link } from 'react-router-dom';
import usePostStore from '../stores/postStore';

function PostListPage() {
  const posts = usePostStore((state) => state.posts);

  return (
    <div>
      <h1>글 목록</h1>
      {posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <Link to={`/post/${post.id}`}>
                <h2 style={{ margin: 0 }}>{post.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostListPage;
```

#### `pages/PostDetailPage.js` 구현하기 (신규 생성)
- URL 파라미터(`id`)를 받아와 해당 게시글의 상세 내용을 보여줍니다.
- 수정 및 삭제 버튼을 포함합니다.

```javascript
// src/pages/PostDetailPage.js
import { useParams, useNavigate, Link } from 'react-router-dom';
import usePostStore from '../stores/postStore';

function PostDetailPage() {
  const { id } = useParams(); // URL에서 id 파라미터 추출
  const navigate = useNavigate();
  const { getPostById, deletePost } = usePostStore();
  
  const post = getPostById(Number(id));

  const handleDelete = () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      deletePost(Number(id));
      alert('삭제되었습니다.');
      navigate('/posts');
    }
  };

  if (!post) {
    return <h2>게시글을 찾을 수 없습니다.</h2>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p style={{ whiteSpace: 'pre-wrap', border: '1px solid #eee', padding: '10px' }}>{post.content}</p>
      <Link to={`/edit-post/${post.id}`}>
        <button>수정</button>
      </Link>
      <button onClick={handleDelete} style={{ marginLeft: '10px' }}>삭제</button>
    </div>
  );
}

export default PostDetailPage;
```

#### `pages/EditPostPage.js` 구현하기 (신규 생성)
- `NewPostPage`와 유사하지만, 기존 데이터를 불러와 폼을 채웁니다.
- 제출 시 `updatePost` 액션을 호출합니다.

```javascript
// src/pages/EditPostPage.js
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import usePostStore from '../stores/postStore';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPostById, updatePost } = usePostStore();
  
  const postToEdit = getPostById(Number(id));

  const handleSubmit = (postData) => {
    updatePost({ ...postData, id: Number(id) });
    alert('글이 수정되었습니다.');
    navigate(`/post/${id}`);
  };

  if (!postToEdit) {
    return <h2>수정할 게시글을 찾을 수 없습니다.</h2>;
  }

  return (
    <div>
      <h1>글 수정</h1>
      <PostForm onSubmit={handleSubmit} initialData={postToEdit} />
    </div>
  );
}

export default EditPostPage;
```

#### `App.js` 라우터 업데이트
- 상세 페이지와 수정 페이지를 위한 `Route`를 추가합니다.

```javascript
// src/App.js
// ... imports
import PostDetailPage from './pages/PostDetailPage';
import EditPostPage from './pages/EditPostPage';

function App() {
  return (
    <div>
      {/* ... nav ... */}
      <div style={{padding: '20px'}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/new-post" element={<NewPostPage />} />
          <Route path="/edit-post/:id" element={<EditPostPage />} />
        </Routes>
      </div>
    </div>
  );
}
```

### 4단계: 기능 완성 및 배포 (진행 예정)
- **기능 검토**: 모든 기능이 정상적으로 동작하는지 확인하고, 사용자 경험을 해치는 버그나 어색한 부분을 수정합니다.
- **빌드**: `npm run build` 명령어를 실행하여 배포용 정적 파일을 생성합니다. 이 파일들은 `build` 폴더에 저장됩니다.
- **배포**: `build` 폴더의 내용물을 Netlify, Vercel, GitHub Pages 등 정적 호스팅 서비스에 업로드하여 웹에 배포합니다.
