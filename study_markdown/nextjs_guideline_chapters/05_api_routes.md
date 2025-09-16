# Chapter 5: API Routes - Next.js로 만드는 미니 백엔드

Next.js는 프론트엔드 프레임워크이지만, 간단한 백엔드 API 서버 기능도 내장하고 있습니다. Spring Boot 프로젝트를 따로 만들지 않고도, Next.js 프로젝트 내에서 직접 API를 만들고 호출할 수 있습니다.

---

## 1. `pages/api` 폴더의 역할

`src/pages/api` 폴더 안에 만드는 파일들은 페이지가 아니라 **API 엔드포인트**가 됩니다. Spring의 `@RestController`와 같은 역할을 합니다.

*   `src/pages/api/hello.js` → `/api/hello` 라는 API 엔드포인트가 생성됩니다.
*   `src/pages/api/posts/[id].js` → `/api/posts/1` 처럼 동적인 API 엔드포인트도 만들 수 있습니다.

이 API들은 서버에서만 실행되므로, DB 접속이나 외부 API 키 사용 등 민감한 작업을 안전하게 처리할 수 있습니다.

## 2. 간단한 API 엔드포인트 만들기

API 파일은 `req` (request)와 `res` (response) 객체를 인자로 받는 `handler` 함수를 `export default` 해야 합니다. Spring의 `HttpServletRequest`, `HttpServletResponse`와 유사한 역할을 합니다.

*   `req`: 요청에 대한 정보 (메서드, 헤더, 바디, 쿼리 등)
*   `res`: 응답을 보내기 위한 객체 (상태 코드, JSON 데이터 등)

```jsx
// src/pages/api/hello.js

export default function handler(req, res) {
  // 요청 메서드(GET, POST 등)에 따라 분기 처리
  if (req.method === 'POST') {
    // POST 요청 처리
    const { name } = req.body; // req.body로 요청 본문에 접근
    res.status(201).json({ message: `Hello, ${name}! Your request was received.` });
  } else {
    // GET 요청 및 그 외 모든 요청 처리
    res.status(200).json({ name: 'John Doe', message: 'This is a GET request.' });
  }
}
```

## 3. 프론트엔드에서 API Route 호출하기

프론트엔드 컴포넌트(페이지)에서는 일반적인 외부 API를 호출하듯이 `fetch` 함수를 사용해 우리가 만든 API Route를 호출할 수 있습니다.

---

### 💡 예제: 현재 시간을 반환하는 API와 이를 호출하는 프론트엔드

1.  **API Route 만들기 (`/api/time`)**

    ```jsx
    // src/pages/api/time.js

    export default function handler(req, res) {
      // 서버의 현재 시간을 ISO 문자열 형식으로 가져옵니다.
      const currentTime = new Date().toISOString();

      // JSON 형태로 현재 시간을 응답합니다.
      res.status(200).json({ time: currentTime });
    }
    ```

2.  **프론트엔드 페이지에서 API 호출하기 (CSR 방식)**

    이 예제는 클라이언트 사이드 렌더링(CSR)의 좋은 예시이기도 합니다.

    ```jsx
    // src/pages/show-time.js
    import { useState, useEffect } from 'react';

    export default function ShowTime() {
      const [serverTime, setServerTime] = useState(null);
      const [loading, setLoading] = useState(true);

      // 버튼 클릭 시 실행될 함수
      const fetchTime = async () => {
        setLoading(true);
        const response = await fetch('/api/time'); // 우리가 만든 API 호출
        const data = await response.json();
        setServerTime(data.time);
        setLoading(false);
      };

      // 컴포넌트가 처음 렌더링될 때 한 번만 시간을 가져옵니다.
      useEffect(() => {
        fetchTime();
      }, []);

      return (
        <div>
          <h1>API Route 예제</h1>
          <p>
            서버 시간: {loading ? '로딩 중...' : serverTime}
          </p>
          {/* 버튼을 누를 때마다 다시 서버 시간을 가져옵니다. */}
          <button onClick={fetchTime} disabled={loading}>
            시간 새로고침
          </button>
        </div>
      );
    }
    ```

### ✏️ 문제

**문제 1:** `/api/greeting` 이라는 API 엔드포인트를 만드세요. 이 API는 쿼리 파라미터로 `name`을 받아서, `?name=Jin` 과 같이 요청하면 `{"message": "Welcome, Jin!"}` 이라는 JSON을 응답해야 합니다. `req.query` 객체를 사용하면 쿼리 파라미터에 접근할 수 있습니다.

**문제 2:** `src/pages/greeting.js` 페이지를 만들고, input 창과 버튼을 하나씩 두세요. 사용자가 input 창에 이름을 입력하고 버튼을 누르면, 문제 1에서 만든 `/api/greeting` API를 호출하여 응답받은 환영 메시지를 화면에 표시하도록 구현해보세요.
