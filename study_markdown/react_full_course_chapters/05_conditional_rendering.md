# 5장: 조건부 렌더링 - 상황에 맞는 UI 보여주기

조건부 렌더링은 특정 조건에 따라 다른 컴포넌트나 엘리먼트를 렌더링하는 기법입니다. 사용자의 로그인 상태, 데이터 로딩 여부, 권한 등 다양한 상황에 맞춰 동적인 UI를 만들 수 있습니다.

---

## 1. 핵심 개념 및 기법

1.  **`if` 문 사용하기**: 가장 기본적인 방법입니다. 컴포넌트의 렌더링 로직이 복잡할 때, `return` 문 이전에 `if` 문을 사용하여 조건에 따라 다른 JSX를 반환할 수 있습니다.

2.  **삼항 연산자 (Ternary Operator)**: `condition ? expressionIfTrue : expressionIfFalse`
    - JSX 내부에서 간단한 조건부 렌더링을 처리할 때 매우 유용합니다. 한 줄로 깔끔하게 표현할 수 있습니다.

3.  **논리 연산자 `&&` (AND)**: `condition && expression`
    - 조건(`condition`)이 `true`일 때만 뒤따르는 표현식(`expression`)을 렌더링하고 싶을 때 사용합니다. 조건이 `false`이면 아무것도 렌더링하지 않습니다.

4.  **`null` 반환으로 렌더링 막기**: 컴포넌트가 특정 조건에서 아무것도 렌더링하지 않게 하려면 `null`을 반환하면 됩니다.

---

## 2. 예제 코드

### 예제 1: 로그인 상태에 따른 UI 제어

사용자의 로그인 여부(`isLoggedIn`)에 따라 환영 메시지 또는 로그인 요청 메시지를 보여줍니다.

```javascript
import React, { useState } from 'react';

// 로그인 상태에 따라 다른 메시지를 보여주는 컴포넌트
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <p>환영합니다! 다시 오셨군요.</p>;
  }
  return <p>로그인이 필요합니다.</p>;
}

// 로그인/로그아웃 버튼을 제어하는 컴포넌트
function LoginControl() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => setIsLoggedIn(true);
  const handleLogoutClick = () => setIsLoggedIn(false);

  return (
    <div>
      <Greeting isLoggedIn={isLoggedIn} />
      {/* 삼항 연산자를 사용하여 조건에 맞는 버튼을 렌더링 */}
      {isLoggedIn 
        ? <button onClick={handleLogoutClick}>로그아웃</button>
        : <button onClick={handleLoginClick}>로그인</button>
      }
    </div>
  );
}

export default LoginControl;
```

### 예제 2: `&&` 연산자로 읽지 않은 메시지 표시하기

읽지 않은 메시지가 있을 때만 개수를 표시하는 예제입니다.

```javascript
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>안녕하세요!</h1>
      {/* unreadMessages 배열의 길이가 0보다 클 때만 && 뒤의 내용을 렌더링 */}
      {unreadMessages.length > 0 &&
        <h2>
          {unreadMessages.length}개의 읽지 않은 메시지가 있습니다.
        </h2>
      }
    </div>
  );
}

// 사용 예시
// <Mailbox unreadMessages={['React 공부하기', '저녁 메뉴 정하기']} /> 
// -> h2 렌더링됨
// <Mailbox unreadMessages={[]} /> 
// -> h2 렌더링되지 않음
```

---

## 3. 연습 문제

### 문제 1: 로딩 스피너 구현하기
- **요구사항**: 데이터 로딩 상태를 시뮬레이션하는 `DataLoader` 컴포넌트를 만드세요.
- **세부사항**:
    1. `isLoading` 이라는 state를 만들고 초기값은 `true`로 설정합니다.
    2. `useEffect`를 사용하여, 컴포넌트가 마운트되고 2초 후에 `isLoading` 상태를 `false`로 변경합니다.
    3. `isLoading`이 `true`이면 "로딩 중..." 이라는 텍스트나 간단한 스피너 UI를 보여줍니다.
    4. `isLoading`이 `false`이면 "데이터 로딩 완료!" 라는 텍스트와 함께 가상의 데이터 목록(예: `<ul><li>항목 1</li>...</ul>`)을 보여줍니다.
- **힌트**: `setTimeout`을 사용하고, 클린업 함수에서 `clearTimeout`을 호출하는 것을 잊지 마세요.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
import React, { useState, useEffect } from 'react';

function DataLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>데이터 로딩 완료!</h1>
      <ul>
        <li>항목 1</li>
        <li>항목 2</li>
        <li>항목 3</li>
      </ul>
    </div>
  );
}

export default DataLoader;
```
</details>

### 문제 2: 사용자 권한에 따른 버튼 표시하기
- **요구사항**: 사용자의 역할(`role`)에 따라 다른 버튼을 보여주는 `AdminPanel` 컴포넌트를 만드세요.
- **세부사항**:
    1. `user` 객체를 prop으로 받습니다. 이 객체는 `name`과 `role`(`'admin'` 또는 `'guest'`) 속성을 가집니다.
    2. 사용자 이름을 환영하는 메시지를 항상 표시합니다. (예: "환영합니다, [user.name]님")
    3. `user.role`이 `'admin'`일 경우에만 "관리자 대시보드" 버튼을 추가로 보여줍니다. (`&&` 연산자를 사용해보세요.)
- **도전과제**: `user` prop이 `null`이거나 `undefined`일 경우, "로그인되지 않았습니다." 라는 메시지를 표시하도록 예외 처리를 추가해보세요.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
function AdminPanel({ user }) {
  // 도전과제: user가 없는 경우 처리
  if (!user) {
    return <p>로그인되지 않았습니다.</p>;
  }

  return (
    <div>
      <p>환영합니다, {user.name}님</p>
      {/* user.role이 'admin'일 때만 버튼을 렌더링 */}
      {user.role === 'admin' && <button>관리자 대시보드</button>}
    </div>
  );
}

export default AdminPanel;

// 사용 예시
// const adminUser = { name: '최동진', role: 'admin' };
// const guestUser = { name: 'Gemini', role: 'guest' };
//
// <AdminPanel user={adminUser} />  // 버튼 보임
// <AdminPanel user={guestUser} />  // 버튼 안 보임
// <AdminPanel user={null} />      // "로그인되지 않았습니다." 보임
```
</details>
