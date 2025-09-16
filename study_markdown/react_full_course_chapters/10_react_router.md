# 10장: React Router - 페이지 이동과 목차 만들기

React는 기본적으로 단일 페이지 애플리케이션(SPA)이므로, 여러 페이지를 가진 것처럼 보이게 하려면 "라우팅" 라이브러리가 필요합니다. 가장 널리 사용되는 `react-router-dom`을 사용하여 페이지 간 이동을 구현하는 방법을 배웁니다.

---

## 1. 핵심 개념

- **SPA (Single Page Application)**: 최초에 하나의 HTML 페이지만 불러오고, 이후에는 서버와 데이터를 교환하며 동적으로 페이지 내용을 갱신하는 방식의 웹 애플리케이션입니다. 페이지를 이동할 때 전체 페이지를 새로고침하지 않아 사용자 경험이 부드럽습니다.

- **`react-router-dom`**: React 기반 SPA를 위한 클라이언트 사이드 라우팅 라이브러리입니다. (`npm install react-router-dom` 으로 설치)

- **주요 컴포넌트 및 Hooks**:
    - **`<BrowserRouter>`**: HTML5의 History API를 사용하여 UI를 URL과 동기화합니다. 애플리케이션의 최상단에서 다른 모든 라우팅 관련 컴포넌트를 감싸야 합니다.
    - **`<Routes>`**: 여러 개의 `<Route>`를 감싸는 컨테이너입니다. URL과 매칭되는 첫 번째 `<Route>`를 렌더링합니다.
    - **`<Route>`**: 특정 경로(`path`)와 렌더링할 컴포넌트(`element`)를 연결하는 역할을 합니다.
    - **`<Link>`**: 페이지를 새로고침하지 않고 다른 경로로 이동할 수 있는 네비게이션 링크를 만듭니다. HTML의 `<a>` 태그와 비슷하지만, `href` 대신 `to` prop을 사용합니다.
    - **`useParams`**: 동적 라우트(예: `/users/:id`)의 파라미터 값을 가져오는 Hook입니다.
    - **`useNavigate`**: 특정 이벤트가 발생했을 때(예: 폼 제출 후) 프로그래밍 방식으로 다른 페이지로 이동시키는 Hook입니다.

---

## 2. 예제 코드

### 예제 1: 기본 라우팅 설정

홈, 소개, 대시보드 세 개의 페이지를 가진 기본적인 라우팅 구조입니다.

```javascript
// src/App.js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// 각 페이지에 해당하는 컴포넌트들
function HomePage() { return <h2>홈 페이지</h2>; }
function AboutPage() { return <h2>소개 페이지</h2>; }
function DashboardPage() { return <h2>대시보드</h2>; }

function App() {
  return (
    // 1. BrowserRouter로 전체를 감싼다.
    <BrowserRouter>
      <div>
        {/* 2. Link 컴포넌트로 네비게이션 메뉴를 만든다. */}
        <nav>
          <ul>
            <li><Link to="/">홈</Link></li>
            <li><Link to="/about">소개</Link></li>
            <li><Link to="/dashboard">대시보드</Link></li>
          </ul>
        </nav>

        <hr />

        {/* 3. Routes 안에서 Route들을 정의한다. */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

### 예제 2: 동적 라우트와 `useParams`

사용자 ID에 따라 다른 프로필 페이지를 보여주는 동적 라우트 예제입니다.

```javascript
// ... App.js 상단에 추가
import { useParams } from 'react-router-dom';

function UserProfilePage() {
  // URL의 :userId 부분의 값을 가져온다.
  const { userId } = useParams();
  return <h2>사용자 프로필: {userId}</h2>;
}

// ... App.js의 Routes 안에 추가
<Routes>
  {/* ... 기존 Route들 ... */}
  {/* :userId는 동적인 값을 의미하는 파라미터 */}
  <Route path="/users/:userId" element={<UserProfilePage />} />
</Routes>

// ... 네비게이션에 Link 추가
// <Link to="/users/최동진">최동진 프로필</Link>
// <Link to="/users/gemini">Gemini 프로필</Link>
```

---

## 3. 연습 문제

### 문제 1: "Not Found" 페이지 만들기
- **요구사항**: 정의되지 않은 경로로 접근했을 때 "404 - 페이지를 찾을 수 없습니다." 메시지를 보여주는 페이지를 만드세요.
- **세부사항**:
    1. `NotFoundPage` 컴포넌트를 만듭니다.
    2. `<Routes>` 내의 모든 `<Route>` 맨 마지막에, `path`를 `*`로 설정한 `<Route>`를 추가합니다. `path="*"`는 위에서 매칭되지 않은 모든 경로를 의미합니다.
    3. 이 `<Route>`의 `element`로 `NotFoundPage` 컴포넌트를 연결합니다.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// ... App.js 상단에 추가
function NotFoundPage() {
  return <h2>404 - 페이지를 찾을 수 없습니다.</h2>;
}

// ... App.js의 Routes 안에 추가
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  {/* 다른 모든 라우트들... */}
  
  {/* 가장 마지막에 위치해야 함 */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```
</details>

### 문제 2: 프로그래밍 방식 네비게이션 구현하기
- **요구사항**: 로그인 버튼을 클릭하면 대시보드 페이지로 이동하는 `LoginPage` 컴포넌트를 만드세요.
- **세부사항**:
    1. `LoginPage` 컴포넌트를 만듭니다. 이 컴포넌트는 "로그인" 버튼을 가집니다.
    2. `useNavigate` 훅을 사용하여 `navigate` 함수를 가져옵니다.
    3. "로그인" 버튼의 `onClick` 핸들러에서 `navigate('/dashboard')`를 호출하여 대시보드 페이지로 이동시킵니다.
    4. `App.js`에 `/login` 경로와 `LoginPage` 컴포넌트를 연결하는 `<Route>`를 추가합니다.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
// src/pages/LoginPage.js
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 실제로는 로그인 API 호출 후 성공 시 이동
    alert('로그인 성공! 대시보드로 이동합니다.');
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>로그인 페이지</h2>
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default LoginPage;

// App.js의 Routes에 추가
// import LoginPage from './pages/LoginPage';
// <Route path="/login" element={<LoginPage />} />
```
</details>
