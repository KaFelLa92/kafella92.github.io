# Chapter 2: 핵심 개념 (1) - 페이지와 라우팅

Next.js의 가장 큰 특징 중 하나는 파일 시스템 기반 라우팅입니다. Spring에서 `@Controller`와 `@GetMapping` 어노테이션으로 URL을 매핑하던 방식과는 완전히 다른, 직관적인 접근법을 배웁니다.

---

## 1. 파일 시스템 기반 라우팅: Controller가 사라졌다!

`src/pages` 폴더 안에 파일을 만들면 그 파일의 경로가 그대로 URL 주소가 됩니다.

*   `src/pages/index.js` → `/`
*   `src/pages/about.js` → `/about`
*   `src/pages/posts/first-post.js` → `/posts/first-post`

Spring에서 URL 매핑을 위해 컨트롤러 클래스와 메소드를 만들던 과정이, Next.js에서는 파일을 생성하는 것으로 단순화됩니다.

## 2. 동적(Dynamic) 라우팅: `[id].js`의 마법

게시글 상세 페이지처럼 ID 값에 따라 다른 내용을 보여줘야 할 때는 어떻게 할까요? Spring의 `@GetMapping("/posts/{id}")`와 같이, Next.js에서는 파일 이름을 대괄호(`[]`)로 감싸 동적 라우팅을 구현합니다.

*   `src/pages/posts/[id].js` → `/posts/1`, `/posts/abc`, `/posts/anything` 등 `/posts/` 다음에 오는 모든 경로를 처리합니다.

## 3. 페이지 간 이동: `<Link>` 컴포넌트

HTML의 `<a>` 태그를 직접 사용하면 페이지 전체가 새로고침(Full Reload)되어 버립니다. 이는 서버로부터 새로운 HTML을 통째로 다시 받아오는 전통적인 방식입니다.

Next.js에서는 `<Link>` 컴포넌트를 사용해야 합니다. `<Link>`는 페이지 전환에 필요한 부분만 다시 그려(Client-Side Navigation), 빠르고 부드러운 사용자 경험을 제공합니다.

## 4. `useRouter`로 라우팅 정보 가져오기

동적 라우팅 경로의 `id` 값이나 쿼리 스트링(`?key=value`) 값을 가져오려면 `useRouter` 훅(Hook)을 사용합니다.

---

### 💡 예제: About 페이지 및 동적 Post 페이지 만들기

1.  **About 페이지 만들기 (`/about`)**

    ```jsx
    // src/pages/about.js
    import Link from 'next/link';

    export default function About() {
      return (
        <div>
          <h1>About Us</h1>
          <p>이곳은 Next.js를 배우는 개발자들을 위한 페이지입니다.</p>
          <Link href="/">
            <a>홈으로 돌아가기</a>
          </Link>
        </div>
      );
    }
    ```

2.  **동적 Post 페이지 만들기 (`/posts/[id]`)**

    ```jsx
    // src/pages/posts/[id].js
    import { useRouter } from 'next/router';
    import Link from 'next/link';

    export default function Post() {
      const router = useRouter();
      const { id } = router.query; // URL의 [id] 부분이 여기에 들어옵니다.

      return (
        <div>
          <h1>Post ID: {id}</h1>
          <p>이 페이지는 동적 라우팅으로 생성되었습니다.</p>
          <Link href="/">
            <a>홈으로 돌아가기</a>
          </Link>
        </div>
      );
    }
    ```

3.  **홈페이지에서 링크 걸기**

    ```jsx
    // src/pages/index.js
    import Link from 'next/link';

    export default function Home() {
      return (
        <div>
          <h1>Home Page</h1>
          <nav>
            <ul>
              <li>
                <Link href="/about">
                  <a>About 페이지로 가기</a>
                </Link>
              </li>
              <li>
                <Link href="/posts/first">
                  <a>첫 번째 포스트로 가기</a>
                </Link>
              </li>
              <li>
                <Link href="/posts/hello-nextjs">
                  <a>두 번째 포스트로 가기</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      );
    }
    ```

### ✏️ 문제

**문제 1:** `src/pages` 폴더 아래에 `products` 라는 폴더를 만들고, 그 안에 `index.js` 파일을 생성하여 `/products` 경로로 접속했을 때 "상품 목록 페이지"가 나타나도록 만들어보세요.

**문제 2:** `products` 폴더 안에 `[productId].js` 라는 동적 라우팅 파일을 만드세요. `/products/100` 으로 접속했을 때, 화면에 "상품 ID: 100" 이라고 표시되도록 `useRouter` 훅을 사용해 구현해보세요.
