# 1장: JSX와 컴포넌트 - React의 첫인상

React 개발의 가장 기본이 되는 두 가지 개념, JSX와 컴포넌트에 대해 배웁니다. UI를 레고 블록처럼 조립 가능한 부품으로 만드는 방법을 이해합니다.

---

## 1. 핵심 개념

- **컴포넌트(Component)**: React는 UI를 "컴포넌트"라는 독립적이고 재사용 가능한 조각으로 나누어 관리합니다. 각 컴포넌트는 자신만의 로직(JavaScript)과 모양(JSX)을 가집니다. 현대 React에서는 JavaScript 함수로 컴포넌트를 만드는 **함수형 컴포넌트**가 표준입니다.

- **JSX (JavaScript XML)**: JavaScript를 확장한 문법으로, UI가 어떻게 생겨야 하는지 설명하기 위해 사용됩니다. HTML과 매우 비슷해 보이지만 실제로는 JavaScript입니다. 브라우저가 직접 읽을 수 없기 때문에, 빌드 과정에서 `React.createElement()`와 같은 순수 JavaScript 코드로 변환됩니다.

## 2. JSX의 주요 규칙

1.  **하나의 부모 요소로 감싸야 합니다**: 컴포넌트는 반드시 하나의 최상위 태그로 시작해야 합니다. 여러 요소를 반환하려면 `<div>`나 `<>` (Fragment)로 감싸야 합니다.
2.  **JavaScript 표현식은 `{}` 안에 작성합니다**: 변수나 간단한 계산 결과를 JSX에 포함시킬 수 있습니다.
3.  **HTML과 다른 속성 이름**: `class` 대신 `className`을, `for` 대신 `htmlFor`를 사용합니다. 이벤트 핸들러는 `onclick` 대신 `onClick`처럼 카멜 케이스(camelCase)를 사용합니다.
4.  **태그는 항상 닫아야 합니다**: 내용이 없는 태그라도 `<img>`가 아닌 `<img />`처럼 항상 닫아주어야 합니다.

---

## 3. 예제 코드

### 예제 1: 기본 컴포넌트 만들기

가장 기본적인 형태의 함수형 컴포넌트입니다.

```javascript
// src/components/Welcome.js

// 함수 이름은 대문자로 시작하는 것이 규칙입니다.
function Welcome() {
  // return 키워드 뒤에 UI를 정의하는 JSX를 작성합니다.
  return <h1>Hello, React World!</h1>;
}

// 다른 파일에서 이 컴포넌트를 사용할 수 있도록 export 합니다.
export default Welcome;
```

### 예제 2: 여러 컴포넌트 조립하기

작은 컴포넌트들을 조립하여 더 큰 컴포넌트나 페이지를 만듭니다.

```javascript
// src/App.js
import Welcome from './components/Welcome';
import MyProfile from './components/MyProfile'; // 추가

function App() {  
  return (
    // 여러 요소를 반환하기 위해 <div>로 감쌌습니다.
    <div>
      <Welcome />
      <MyProfile />
    </div>
  );
}

export default App;
```

---

## 4. 연습 문제

### 문제 1: `Header` 컴포넌트 만들기
- **요구사항**: 웹사이트의 헤더 부분을 담당하는 `Header` 컴포넌트를 만드세요.
- **세부사항**:
    1. `<h1>` 태그로 사이트 로고(예: "My Awesome Site")를 표시합니다.
    2. `<nav>` 태그 안에 `<ul>`과 `<li>`를 사용하여 "Home", "About", "Contact" 라는 세 개의 메뉴 항목을 만듭니다.
- **도전과제**: `App.js`에서 이 `Header` 컴포넌트를 화면에 렌더링해보세요.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// src/components/Header.js
function Header() {
  return (
    <header>
      <h1>My Awesome Site</h1>
      <nav>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

// src/App.js
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header />
      {/* 다른 컨텐츠 */}
    </div>
  );
}
```
</details>

### 문제 2: `Footer` 컴포넌트 만들기
- **요구사항**: 웹사이트의 푸터 부분을 담당하는 `Footer` 컴포넌트를 만드세요.
- **세부사항**:
    1. `<p>` 태그를 사용하여 저작권 정보를 표시합니다. (예: "© 2024 My Awesome Site. All rights reserved.")
    2. 소셜 미디어 링크를 담을 `div`를 만들고, 그 안에 "Facebook", "Twitter", "Instagram" 텍스트를 넣습니다.
- **도전과제**: `App.js`에서 `Header` 컴포넌트 아래에 `Footer` 컴포넌트를 렌더링해보세요.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
// src/components/Footer.js
function Footer() {
  return (
    <footer>
      <p>© 2024 My Awesome Site. All rights reserved.</p>
      <div>
        <span>Facebook</span> | 
        <span>Twitter</span> | 
        <span>Instagram</span>
      </div>
    </footer>
  );
}

export default Footer;

// src/App.js
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header />
      <main>
        <p>여기는 메인 컨텐츠입니다.</p>
      </main>
      <Footer />
    </div>
  );
}
```
</details>
