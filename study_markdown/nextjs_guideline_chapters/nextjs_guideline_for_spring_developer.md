# Next.js A to Z: Spring 개발자를 위한 완벽 가이드

안녕하세요! Spring으로 백엔드 개발에 입문하신 것을 축하드립니다. 이제 현대적인 프론트엔드 기술 스택의 핵심인 Next.js를 배우실 차례입니다. 이 가이드는 Spring 개발자의 관점에서 Next.js의 모든 것을 이해하기 쉽게 설명합니다.

---

## 목차

1.  **Intro: Next.js, 왜 필요한가?**
    *   React, 그리고 Next.js의 역할
    *   Spring Boot + Thymeleaf vs Next.js: 무엇이 다른가?
    *   Next.js의 핵심 철학: 렌더링의 모든 것

2.  **Chapter 1: 개발 환경 설정 및 첫 프로젝트**
    *   필수 도구 설치 (Node.js, VS Code)
    *   `create-next-app`으로 프로젝트 시작하기
    *   프로젝트 구조 훑어보기 (Spring Boot 프로젝트와 비교)
    *   개발 서버 실행과 "Hello World"

3.  **Chapter 2: 핵심 개념 (1) - 페이지와 라우팅**
    *   파일 시스템 기반 라우팅: Controller가 사라졌다!
    *   페이지(Page) 만들기: 정적 라우팅
    *   동적(Dynamic) 라우팅: `[id].js`의 마법
    *   페이지 간 이동: `<Link>` 컴포넌트
    *   `useRouter`로 라우팅 정보 가져오기

4.  **Chapter 3: 핵심 개념 (2) - React 기초 다지기**
    *   컴포넌트(Component): UI를 조립하는 부품
    *   JSX: JavaScript와 HTML의 만남
    *   Props: 컴포넌트에 데이터 전달하기
    *   State (`useState`): 컴포넌트의 상태 관리
    *   Effect (`useEffect`): 컴포넌트의 생명주기와 부수 효과

5.  **Chapter 4: 핵심 개념 (3) - 데이터 렌더링 전략**
    *   **SSG (Static Site Generation)**: `getStaticProps`
        *   언제 사용하는가? (블로그, 마케팅 페이지)
        *   `getStaticPaths`와 함께 동적 페이지 정적 생성하기
    *   **SSR (Server-Side Rendering)**: `getServerSideProps`
        *   Spring의 `Model`과 `View`가 합쳐진 느낌
        *   언제 사용하는가? (사용자 대시보드, 개인화된 정보)
    *   **CSR (Client-Side Rendering)**: `useEffect` + `fetch`
        *   전통적인 React 방식
        *   언제 사용하는가? (빠르게 변하는 데이터)
    *   **ISR (Incremental Static Regeneration)**: 정적 페이지를 주기적으로 업데이트

6.  **Chapter 5: API Routes - Next.js로 만드는 미니 백엔드**
    *   `pages/api` 폴더의 역할: Spring의 `@RestController`
    *   간단한 API 엔드포인트 만들기 (GET, POST)
    *   프론트엔드에서 API Route 호출하기

7.  **Chapter 6: 스타일링과 UI**
    *   전역(Global) CSS
    *   CSS Modules: 컴포넌트 스코프 스타일
    *   Tailwind CSS: 가장 인기 있는 선택지 (설치 및 사용법)
    *   UI 라이브러리 연동 (MUI, Chakra UI 등)

8.  **Chapter 7: 실전 예제 - 나만의 블로그 만들기**
    *   **요구사항 정의**: 포스트 목록, 상세 페이지, 댓글 기능
    *   **Step 1**: 프로젝트 설정 및 Tailwind CSS 적용
    *   **Step 2**: (SSG) `getStaticProps`로 포스트 목록 페이지 만들기
    *   **Step 3**: (SSG) `getStaticPaths`로 포스트 상세 페이지 만들기
    *   **Step 4**: (API Route + CSR) 댓글 API 및 프론트엔드 연동

9.  **Chapter 8: 배포와 그 너머**
    *   Vercel을 이용한 원클릭 배포
    *   환경 변수 관리 (`.env.local`)
    *   더 나아가기: TypeScript, Next.js App Router

---

## Intro: Next.js, 왜 필요한가?

### React, 그리고 Next.js의 역할

*   **React**: UI를 만들기 위한 JavaScript '라이브러리'입니다. 사용자의 인터랙션에 따라 화면이 어떻게 변할지 등을 관리합니다. 하지만 React 자체는 오직 'View'에만 집중합니다. 라우팅, 서버사이드 렌더링 같은 기능은 직접 구축해야 합니다.
*   **Next.js**: React 기반의 '프레임워크'입니다. React의 단점을 보완하고 웹 애플리케이션을 만드는 데 필요한 기능(라우팅, 렌더링 최적화, API 서버 등)을 미리 다 갖춰놓은 종합 선물 세트입니다. Spring이 Java 웹 개발을 위한 모든 것을 제공하는 것과 비슷합니다.

### Spring Boot + Thymeleaf vs Next.js: 무엇이 다른가?

| 구분 | Spring Boot + Thymeleaf | Next.js |
| --- | --- | --- |
| **언어** | Java, HTML | JavaScript/TypeScript, JSX |
| **구조** | 명확한 MVC 패턴 | 프론트엔드와 백엔드가 공존 |
| **렌더링** | 서버 사이드 렌더링 (SSR) | SSR, SSG, CSR 등 다양한 렌더링 전략 선택 가능 |
| **라우팅** | `@GetMapping`, `@PostMapping` 등 어노테이션 기반 | 파일 시스템 기반 (폴더/파일 구조가 URL이 됨) |
| **결과물** | 서버가 동적으로 생성하는 완전한 HTML | JavaScript가 포함된 HTML, 클라이언트에서 상호작용 |

가장 큰 차이는 **"어디서, 언제 페이지를 그리는가?"** 입니다. Spring+Thymeleaf는 모든 요청에 대해 서버가 HTML을 그려서 보내줍니다. Next.js는 페이지의 성격에 따라 미리 HTML을 만들어두거나(SSG), 요청 시 서버에서 만들거나(SSR), 혹은 뼈대만 보낸 뒤 클라이언트(브라우저)에서 그리게(CSR) 할 수 있습니다.

---

## Chapter 1: 개발 환경 설정 및 첫 프로젝트

### 필수 도구 설치

1.  **Node.js**: JavaScript 런타임입니다. Java의 JDK와 같습니다. [nodejs.org](https://nodejs.org/)에서 LTS 버전을 설치하세요.
2.  **VS Code**: 추천하는 코드 에디터입니다.

### `create-next-app`으로 프로젝트 시작하기

터미널을 열고 다음 명령어를 실행하세요.

```bash
npx create-next-app@latest my-next-app
```

몇 가지 질문이 나옵니다. 처음에는 대부분 기본값(Enter)으로 진행해도 좋습니다.

*   `Would you like to use TypeScript?` (No)
*   `Would you like to use ESLint?` (Yes)
*   `Would you like to use Tailwind CSS?` (No - 나중에 직접 설치해볼 것입니다)
*   `Would you like to use `src/` directory?` (Yes - `src` 폴더에 소스를 모아 관리하는 것이 깔끔합니다)
*   `Would you like to use App Router?` (No - 우선 더 배우기 쉬운 Pages Router로 시작하겠습니다)

### 프로젝트 구조 훑어보기

```
my-next-app/
├── node_modules/   # 의존성 라이브러리 (Maven/Gradle의 의존성과 비슷)
├── public/         # 이미지, 폰트 등 정적 파일
├── src/
│   └── pages/      # Next.js의 핵심! 이 안의 파일들이 URL 주소가 됨
│       ├── _app.js     # 모든 페이지의 공통 레이아웃
│       ├── api/        # API 서버 역할을 하는 파일들
│       └── index.js    # 루트 URL ('/')에 해당하는 페이지
├── .eslintrc.json  # 코드 스타일 규칙
├── .gitignore      # Git에 올리지 않을 파일 목록
└── package.json    # 프로젝트 정보 및 의존성 목록 (pom.xml, build.gradle과 유사)
```

### 개발 서버 실행과 "Hello World"

```bash
cd my-next-app
npm run dev
```

이제 브라우저에서 `http://localhost:3000`으로 접속해보세요. Next.js 시작 페이지가 보일 겁니다.

`src/pages/index.js` 파일을 열고 내용을 수정해보세요. 저장하는 즉시 브라우저 화면이 자동으로 새로고침됩니다.

---

## Chapter 2: 핵심 개념 (1) - 페이지와 라우팅

### 파일 시스템 기반 라우팅

Next.js의 가장 큰 특징입니다. `src/pages` 폴더 안에 파일을 만들면 그 파일 경로가 그대로 URL이 됩니다.

*   `src/pages/index.js` -> `/`
*   `src/pages/about.js` -> `/about`
*   `src/pages/posts/first-post.js` -> `/posts/first-post`

Spring에서 `@GetMapping("/posts/first-post")` 같은 어노테이션으로 URL을 지정하던 것과 매우 다른 방식이니 꼭 기억하세요.

### 동적(Dynamic) 라우팅

게시글처럼 ID에 따라 다른 내용을 보여줘야 할 때는 어떻게 할까요? Spring의 `@GetMapping("/posts/{id}")`와 비슷하게 동적 라우팅을 사용합니다.

파일 이름을 대괄호(`[]`)로 감싸면 됩니다.

*   `src/pages/posts/[id].js` -> `/posts/1`, `/posts/abc`, `/posts/anything` 등의 모든 주소를 처리합니다.

### 페이지 간 이동: `<Link>` 컴포넌트

HTML의 `<a>` 태그를 직접 사용하면 페이지 전체가 새로고침되어 버립니다. Next.js에서는 `<Link>` 컴포넌트를 사용해야 부드러운 클라이언트 사이드 네비게이션이 가능합니다.

```jsx
// src/pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link href="/about">
        About 페이지로 가기
      </Link>
    </div>
  );
}
```

### `useRouter`로 라우팅 정보 가져오기

동적 라우팅에서 `id` 값을 어떻게 가져올까요? `useRouter` 훅(Hook)을 사용합니다.

```jsx
// src/pages/posts/[id].js
import { useRouter } from 'next/router';

export default function Post() {
  const router = useRouter();
  const { id } = router.query; // URL의 [id] 부분이 여기에 들어옵니다.

  return <h1>Post ID: {id}</h1>;
}
```

---

## Chapter 3: 핵심 개념 (2) - React 기초 다지기

Next.js는 React를 기반으로 하므로, React의 기본 문법을 알아야 합니다.

### 컴포넌트(Component)

UI를 구성하는 독립적인 부품입니다. JavaScript 함수 형태로 만듭니다.

```jsx
// MyButton.js
export default function MyButton() {
  return <button>I'm a button</button>;
}

// index.js
import MyButton from './MyButton';

export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <MyButton />
    </div>
  );
}
```

### JSX

JavaScript 파일 안에서 HTML과 유사한 문법을 사용할 수 있게 해줍니다.

```jsx
const name = "World";
const element = <h1>Hello, {name}</h1>; // JavaScript 변수를 중괄호 안에 넣을 수 있음
```

### Props

부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방법입니다.

```jsx
// Greeting.js
export default function Greeting(props) {
  return <h1>Hello, {props.name}</h1>;
}

// index.js
import Greeting from './Greeting';

export default function Home() {
  return <Greeting name="Jin" />;
}
```

### State (`useState`)

컴포넌트가 자체적으로 가지는, 시간이 지나면서 변할 수 있는 데이터입니다. `useState`를 사용하면 state가 변경될 때 화면이 자동으로 다시 렌더링됩니다.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0); // 초기값 0

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### Effect (`useEffect`)

컴포넌트가 렌더링된 후에 특정 작업을 수행하고 싶을 때 사용합니다. (예: 외부에서 데이터 가져오기, DOM 직접 조작)

```jsx
import { useState, useEffect } from 'react';

export default function Timer() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    // 1초마다 시간을 업데이트
    const timerId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    // 컴포넌트가 사라질 때 타이머 정리
    return () => clearInterval(timerId);
  }, []); // []가 비어있으면 컴포넌트가 처음 마운트될 때 한 번만 실행

  return <div>Current time: {time}</div>;
}
```

---

## Chapter 4: 핵심 개념 (3) - 데이터 렌더링 전략

Next.js의 가장 강력한 기능입니다. 페이지마다 최적의 렌더링 방식을 선택할 수 있습니다.

### SSG (Static Site Generation): `getStaticProps`

**개념**: `npm run build` 시점에 페이지를 미리 HTML로 만들어 놓습니다. CDN에 캐시해두고 요청이 오면 즉시 제공하므로 속도가 매우 빠릅니다.

**Spring 비교**: Spring 프로젝트를 빌드할 때 특정 페이지들을 미리 HTML 파일로 만들어두는 것과 같습니다.

**사용법**: `pages` 파일 안에서 `getStaticProps` 함수를 `export` 합니다.

```jsx
// src/pages/posts.js
export default function Posts({ posts }) {
  // 3. posts 데이터를 props로 받아 화면을 그린다.
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// 1. 빌드 시점에 이 함수가 딱 한 번 실행된다.
export async function getStaticProps() {
  // 2. 외부 API나 DB에서 데이터를 가져온다.
  const res = await fetch('https://.../posts');
  const posts = await res.json();

  return {
    props: {
      posts, // props 객체 안의 값이 컴포넌트로 전달된다.
    },
  };
}
```

### SSR (Server-Side Rendering): `getServerSideProps`

**개념**: 사용자가 페이지를 요청할 때마다 서버에서 데이터를 가져와 HTML을 생성해서 보여줍니다. 항상 최신 데이터를 보여줘야 할 때 사용합니다.

**Spring 비교**: Spring Boot + Thymeleaf의 동작 방식과 거의 동일합니다. 컨트롤러가 DB에서 데이터를 조회해 `Model`에 담아 `View`로 보내는 과정과 같습니다.

**사용법**: `getStaticProps` 대신 `getServerSideProps`를 사용합니다.

```jsx
// src/pages/dashboard.js
export default function Dashboard({ user }) {
  return <h1>Welcome, {user.name}!</h1>;
}

// 페이지 요청이 올 때마다 이 함수가 실행된다.
export async function getServerSideProps(context) {
  // context.req.headers.cookie 등으로 인증 정보를 확인
  const user = await getUserFromSession(context.req);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}
```

### CSR (Client-Side Rendering)

**개념**: 일단 빈 HTML과 JavaScript를 브라우저에 보낸 뒤, 브라우저에서 JavaScript가 API를 호출해 데이터를 가져와 화면을 그립니다.

**사용법**: `useEffect`와 `useState`를 조합하여 사용합니다.

```jsx
// src/components/Comments.js
import { useState, useEffect } from 'react';

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments);
        setLoading(false);
      });
  }, [postId]);

  if (loading) return <div>Loading comments...</div>;

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </ul>
  );
}
```

---

## Chapter 5: API Routes - Next.js로 만드는 미니 백엔드

Next.js는 프론트엔드뿐만 아니라 간단한 백엔드 API 서버 기능도 내장하고 있습니다.

### `pages/api` 폴더의 역할

이 폴더 안의 파일들은 페이지가 아니라 API 엔드포인트가 됩니다. Spring의 `@RestController`와 같은 역할을 합니다.

*   `src/pages/api/hello.js` -> `/api/hello`
*   `src/pages/api/posts/[id].js` -> `/api/posts/1`

### 간단한 API 엔드포인트 만들기

`req` (request)와 `res` (response) 객체를 사용합니다. Spring의 `HttpServletRequest`, `HttpServletResponse`와 유사합니다.

```jsx
// src/pages/api/hello.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // POST 요청 처리
    const { name } = req.body;
    res.status(200).json({ message: `Hello, ${name}!` });
  } else {
    // GET 요청 처리
    res.status(200).json({ name: 'John Doe' });
  }
}
```

### 프론트엔드에서 API Route 호출하기

일반적인 API를 호출하듯이 `fetch`를 사용하면 됩니다.

```jsx
// 컴포넌트 안에서
async function sayHello() {
  const response = await fetch('/api/hello', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: 'Jin' }),
  });
  const data = await response.json();
  console.log(data.message); // "Hello, Jin!"
}
```

---

## Chapter 6: 스타일링과 UI

### CSS Modules

컴포넌트별로 CSS 파일을 만들어 스타일이 겹치는 것을 방지합니다. `[컴포넌트명].module.css` 형식으로 파일을 만듭니다.

```css
/* Button.module.css */
.button {
  background-color: blue;
  color: white;
  padding: 10px;
}
```

```jsx
// Button.js
import styles from './Button.module.css';

export default function Button() {
  return <button className={styles.button}>Click me</button>;
}
```

### Tailwind CSS

미리 정의된 클래스 이름을 조합하여 빠르게 스타일을 만드는 Utility-First CSS 프레임워크입니다. 현대적인 웹 개발에서 가장 인기 있는 방식 중 하나입니다.

**설치**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**설정** (`tailwind.config.js`, `postcss.config.js` 파일이 생성됩니다)

`tailwind.config.js` 파일을 열어 content 경로를 설정합니다.

```js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

`src/styles/globals.css` 파일에 다음 내용을 추가합니다.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**사용법**

```jsx
export default function Home() {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
      <h1 className="text-xl font-medium text-black">Hello Tailwind!</h1>
    </div>
  );
}
```

---

## Chapter 7: 실전 예제 - 나만의 블로그 만들기

지금까지 배운 내용을 총동원하여 간단한 마크다운 블로그를 만들어 봅시다.

### Step 1: 프로젝트 설정 및 포스트 데이터 준비

1.  `npx create-next-app blog --ts --eslint --tailwind --src-dir --no-app` 명령어로 Tailwind CSS가 포함된 새 프로젝트를 시작합니다.
2.  프로젝트 루트에 `posts` 폴더를 만들고, 그 안에 `hello-world.md`, `second-post.md` 같은 마크다운 파일을 몇 개 만듭니다.
3.  마크다운 파일을 읽기 위한 라이브러리를 설치합니다: `npm install gray-matter`

### Step 2: (SSG) 포스트 목록 페이지 만들기

`src/pages/index.js` 파일을 수정합니다.

```jsx
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function Home({ posts }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">My Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="mb-2">
            <Link href={`/blog/${post.slug}`}>
              <a className="text-xl text-blue-600 hover:underline">
                {post.frontmatter.title}
              </a>
            </Link>
            <p>{post.frontmatter.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(path.join('posts'));

  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    );
    const { data: frontmatter } = matter(markdownWithMeta);

    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      posts: posts.sort(/* 날짜순 정렬 로직 */),
    },
  };
}
```

### Step 3: (SSG) 포스트 상세 페이지 만들기

`src/pages/blog/[slug].js` 파일을 새로 만듭니다.

```jsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked'; // npm install marked

export default function PostPage({ frontmatter: { title, date }, content }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="text-gray-500 mb-4">{date}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
    </div>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'));
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }));

  return {
    paths,
    fallback: false, // paths에 없는 경로는 404 처리
  };
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(
    path.join('posts', slug + '.md'),
    'utf-8'
  );

  const { data: frontmatter, content } = matter(markdownWithMeta);

  return {
    props: {
      frontmatter,
      content,
    },
  };
}
```
*   `prose` 클래스는 Tailwind의 타이포그래피 플러그인(`@tailwindcss/typography`)이 필요합니다.

---

## Chapter 8: 배포와 그 너머

### Vercel을 이용한 원클릭 배포

Next.js의 개발사인 Vercel은 Git 리포지토리를 연결하여 매우 쉽게 배포할 수 있는 플랫폼을 제공합니다.

1.  프로젝트를 GitHub에 push 합니다.
2.  [Vercel](https://vercel.com/)에 가입하고 GitHub 계정을 연동합니다.
3.  'New Project'를 눌러 방금 push한 리포지토리를 선택합니다.
4.  'Deploy' 버튼을 누르면 끝! Git에 push할 때마다 자동으로 빌드 및 배포가 이루어집니다.

### 환경 변수 관리

DB 접속 정보나 API 키 등 민감한 정보는 코드에 직접 넣으면 안 됩니다. 프로젝트 루트에 `.env.local` 파일을 만들어 관리합니다.

```
# .env.local
DATABASE_URL=...
NEXT_PUBLIC_GOOGLE_ANALYTICS=...
```

*   `NEXT_PUBLIC_` 접두사가 붙은 변수는 브라우저에 노출됩니다. 그 외의 변수는 서버 사이드(getStaticProps, getServerSideProps, API routes)에서만 사용할 수 있습니다.
*   코드에서는 `process.env.DATABASE_URL` 과 같이 접근합니다.

---

이 가이드가 Spring 개발자로서 Next.js의 세계에 발을 들이는 데 훌륭한 첫걸음이 되기를 바랍니다. 처음에는 생소한 개념이 많겠지만, 직접 코드를 작성하고 작은 프로젝트를 만들어보면 금방 익숙해지실 겁니다. 행운을 빕니다!
