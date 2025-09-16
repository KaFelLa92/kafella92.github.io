# Chapter 7: 실전 예제 - 나만의 블로그 만들기

지금까지 배운 개념(SSG, 동적 라우팅, 컴포넌트 등)을 총동원하여 간단한 마크다운 기반 블로그를 만들어 봅시다. 이 예제는 Next.js의 핵심 기능을 실제로 어떻게 활용하는지 보여주는 좋은 사례입니다.

---

### **요구사항**

1.  `posts` 폴더에 있는 마크다운(`*.md`) 파일들을 읽어와 블로그 게시물로 사용한다.
2.  메인 페이지(`/`)에는 모든 포스트의 제목과 날짜 목록이 보인다. (SSG)
3.  목록의 제목을 클릭하면 해당 포스트의 상세 페이지(`/blog/[slug]`)로 이동한다. (동적 라우팅)
4.  상세 페이지에서는 마크다운으로 작성된 본문 내용이 HTML로 렌더링되어 보인다. (SSG)

---

### Step 1: 프로젝트 설정 및 포스트 데이터 준비

1.  `npx create-next-app my-blog --tailwind --eslint --src-dir --no-app` 명령어로 Tailwind CSS가 포함된 새 프로젝트를 시작합니다.
2.  프로젝트 루트(최상위 경로)에 `posts` 폴더를 만들고, 그 안에 아래 내용으로 마크다운 파일을 2~3개 만듭니다. 파일 상단의 `---`로 감싸인 부분은 **Frontmatter**라고 하며, 포스트의 메타데이터(제목, 날짜 등)를 담습니다.

    ```md
    // posts/first-post.md
    ---
    title: '첫 번째 포스트'
    date: '2024-01-15'
    ---

    여기는 **마크다운**으로 작성된 첫 번째 포스트의 본문입니다.
    - 리스트 아이템 1
    - 리스트 아이템 2
    ```

    ```md
    // posts/second-post.md
    ---
    title: 'Next.js 렌더링 전략'
    date: '2024-01-16'
    ---

    Next.js는 SSG, SSR, CSR 등 다양한 렌더링을 지원합니다.
    `getStaticProps`를 사용하면 빌드 시점에 페이지를 생성할 수 있습니다.
    ```

3.  마크다운 파일을 파싱하기 위한 라이브러리를 설치합니다.
    *   `gray-matter`: Frontmatter와 본문(content)을 분리해줍니다.
    *   `marked`: 마크다운 텍스트를 HTML로 변환해줍니다.

    ```bash
    npm install gray-matter marked
    ```

---

### Step 2: (SSG) 포스트 목록 페이지 만들기 (`src/pages/index.js`)

```jsx
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function Home({ posts }) {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">My Markdown Blog</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="p-4 border rounded-lg hover:shadow-md">
            <Link href={`/blog/${post.slug}`}>
              <a className="text-2xl font-semibold text-blue-600 hover:underline">
                {post.frontmatter.title}
              </a>
            </Link>
            <p className="text-gray-500 mt-1">{post.frontmatter.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  // 1. posts 폴더의 파일 목록을 읽어옵니다.
  const files = fs.readdirSync(path.join('posts'));

  // 2. 각 파일의 frontmatter 정보를 파싱합니다.
  const posts = files.map((filename) => {
    const slug = filename.replace('.md', ''); // 파일명이 URL slug가 됩니다.
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

  // 3. 날짜순으로 정렬하여 props로 전달합니다.
  return {
    props: {
      posts: posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)),
    },
  };
}
```

---

### Step 3: (SSG) 포스트 상세 페이지 만들기 (`src/pages/blog/[slug].js`)

```jsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';

// Tailwind의 Typography 플러그인을 사용하면 마크다운 스타일링이 편해집니다.
// npm install -D @tailwindcss/typography
// tailwind.config.js의 plugins에 require('@tailwindcss/typography') 추가
export default function PostPage({ frontmatter: { title, date }, slug, content }) {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Link href="/">
        <a className="text-blue-600 hover:underline">&larr; Go Back</a>
      </Link>
      <div className="p-4 mt-4 border rounded-lg">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-gray-500 mb-4">Posted on {date}</p>
        {/* 'prose' 클래스가 마크다운 콘텐츠에 기본 스타일을 적용해줍니다. */}
        <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
      </div>
    </div>
  );
}

// 1. 빌드 시점에 어떤 slug 파라미터 값으로 페이지들을 미리 생성할지 알려줍니다.
export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'));
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }));

  return {
    paths, // [{ params: { slug: 'first-post' } }, { params: { slug: 'second-post' } }]
    fallback: false, // paths에 없는 경로는 404 처리
  };
}

// 2. 각 slug 파라미터에 대해 페이지를 생성할 때 필요한 데이터를 가져옵니다.
export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(
    path.join('posts', slug + '.md'),
    'utf-8'
  );

  const { data: frontmatter, content } = matter(markdownWithMeta);

  return {
    props: {
      frontmatter,
      slug,
      content,
    },
  };
}
```

### ✏️ 문제

**문제 1:** 마크다운 파일의 frontmatter에 `author: 'Your Name'` 과 같이 작성자 정보를 추가해보세요.

**문제 2:** `index.js` (목록 페이지)와 `[slug].js` (상세 페이지)를 수정하여, 위에서 추가한 `author` 정보가 제목 아래에 표시되도록 만들어보세요.
