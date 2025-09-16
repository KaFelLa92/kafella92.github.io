# Chapter 4: 핵심 개념 (3) - 데이터 렌더링 전략

Next.js의 가장 강력하고 핵심적인 기능입니다. "언제, 어디서 HTML 페이지를 그릴 것인가?"에 대한 다양한 선택지를 제공합니다. 페이지의 성격에 따라 최적의 렌더링 방식을 선택하여 성능을 극대화할 수 있습니다.

---

## 1. SSG (Static Site Generation): `getStaticProps`

*   **개념**: `npm run build` 시점에, 즉 **빌드 타임에** 데이터를 미리 가져와서 HTML 페이지를 생성해두는 방식입니다.
*   **동작**: 사용자가 요청하면 이미 만들어진 HTML 파일을 즉시 제공합니다. CDN에 캐시되기 때문에 속도가 매우 빠릅니다.
*   **Spring 비교**: Spring 프로젝트를 빌드할 때, 특정 데이터를 DB에서 조회하여 완성된 HTML 파일(`post-1.html`, `post-2.html` 등)을 미리 만들어 `resources/static` 폴더에 저장해두는 것과 같습니다.
*   **언제 사용하는가?**: 내용이 자주 바뀌지 않는 페이지. (예: 블로그 게시물, 제품 소개, 마케팅 페이지, 문서)

## 2. SSR (Server-Side Rendering): `getServerSideProps`

*   **개념**: 사용자가 페이지를 **요청할 때마다** 서버에서 데이터를 가져와 HTML을 동적으로 생성해서 보여주는 방식입니다.
*   **동작**: 요청 시 서버에서 API 호출이나 DB 조회가 실행되고, 그 결과를 바탕으로 HTML이 완성되어 클라이언트에게 전달됩니다.
*   **Spring 비교**: Spring Boot + Thymeleaf의 동작 방식과 **거의 동일합니다.** 컨트롤러가 요청을 받아 서비스-리포지토리를 거쳐 데이터를 조회한 뒤, `Model`에 담아 `View` (Thymeleaf)로 보내 렌더링하는 과정과 같습니다.
*   **언제 사용하는가?**: 항상 최신 데이터를 보여줘야 하거나, 사용자별로 다른 내용을 보여줘야 하는 페이지. (예: 사용자 대시보드, 주문 내역, 실시간 주식 정보)

## 3. CSR (Client-Side Rendering)

*   **개념**: 일단 최소한의 빈 HTML과 JavaScript 파일을 브라우저에 보낸 뒤, 브라우저에서 JavaScript가 API를 호출해 데이터를 가져와 화면을 그리는 방식입니다. 전통적인 React(SPA)의 작동 방식입니다.
*   **동작**: `useEffect` 훅을 사용하여 컴포넌트가 렌더링된 후, 클라이언트 측에서 `fetch`로 API를 호출합니다.
*   **언제 사용하는가?**: 페이지 전체가 아닌, 페이지의 일부 영역에서 동적으로 변하는 데이터를 보여줄 때. (예: 댓글 목록, 좋아요 버튼, 사용자 검색창)

---

### 💡 예제 1: SSG로 블로그 포스트 목록 페이지 만들기

```jsx
// src/pages/posts.js

// 3. getStaticProps가 반환한 posts 데이터를 props로 받아 화면을 그립니다.
export default function Posts({ posts }) {
  return (
    <div>
      <h1>블로그 포스트 (SSG)</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

// 1. 'npm run build' 시점에 이 함수가 딱 한 번 실행됩니다.
export async function getStaticProps() {
  console.log("빌드 시점에 한 번만 실행됨!");
  // 2. 외부 API(JSONPlaceholder)에서 데이터를 미리 가져옵니다.
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const posts = await res.json();

  // 이 return 객체는 반드시 props 키를 가져야 합니다.
  return {
    props: {
      posts, // 이 posts 값이 위 Posts 컴포넌트의 props로 전달됩니다.
    },
  };
}
```

### 💡 예제 2: SSR로 현재 서버 시간 보여주기

```jsx
// src/pages/time.js

// 2. getServerSideProps가 반환한 timeString 데이터를 props로 받아 화면을 그립니다.
export default function Time({ timeString }) {
  return (
    <div>
      <h1>서버 시간 (SSR)</h1>
      <p>매번 새로고침할 때마다 서버 시간이 업데이트됩니다.</p>
      <h2>{timeString}</h2>
    </div>
  );
}

// 1. 페이지를 요청할 때마다 이 함수가 '서버에서' 실행됩니다.
export async function getServerSideProps() {
  console.log("페이지 요청 시마다 서버에서 실행됨!");
  // 2. 서버에서만 실행되는 로직 (예: 현재 시간 가져오기)
  const timeString = new Date().toISOString();

  return {
    props: {
      timeString,
    },
  };
}
```

### ✏️ 문제

**문제 1 (SSG):** `src/pages/users.js` 파일을 만들고, `getStaticProps`를 사용해 외부 API `https://jsonplaceholder.typicode.com/users` 에서 사용자 목록을 **빌드 타임에** 가져와 화면에 이름과 이메일을 목록으로 표시해보세요.

**문제 2 (SSR):** `src/pages/random-number.js` 파일을 만들고, `getServerSideProps`를 사용해 페이지를 **요청할 때마다** `Math.random()`을 이용해 새로운 난수를 생성하고, 그 숫자를 화면에 보여주세요.
