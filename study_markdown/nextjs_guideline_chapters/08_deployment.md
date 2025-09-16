# Chapter 8: 배포와 그 너머

열심히 만든 애플리케이션을 세상에 공개할 시간입니다. Next.js는 개발사인 Vercel을 통해 매우 쉽고 빠른 배포를 지원합니다. 또한, 코드에 하드코딩하면 안 되는 민감한 정보를 관리하는 방법도 알아봅니다.

---

## 1. Vercel을 이용한 원클릭 배포

Vercel은 Git 리포지토리를 연결하여, `main` 브랜치에 코드를 `push` 할 때마다 자동으로 빌드 및 배포를 수행해주는 플랫폼입니다.

**배포 과정:**

1.  **GitHub에 프로젝트 Push**: 지금까지 만든 Next.js 프로젝트를 GitHub 리포지토리에 push합니다.
2.  **Vercel 가입 및 연동**: [Vercel](https://vercel.com/)에 GitHub 계정으로 가입하고 로그인합니다.
3.  **프로젝트 Import**: Vercel 대시보드에서 'Add New... -> Project'를 선택하고, 방금 push한 GitHub 리포지토리를 `Import` 합니다.
4.  **배포(Deploy)**: 프로젝트 이름이나 프레임워크 설정 등은 Vercel이 자동으로 감지합니다. 특별히 수정할 내용이 없다면 `Deploy` 버튼을 누르기만 하면 됩니다.
5.  **완료!**: 몇 분 안에 빌드와 배포가 완료되고, `xxx.vercel.app` 형태의 고유한 URL이 발급됩니다. 이제 누구나 이 주소로 여러분의 프로젝트에 접속할 수 있습니다.

이후로는 로컬에서 작업한 내용을 GitHub `main` 브랜치로 push하기만 하면, Vercel이 변경 사항을 감지하여 자동으로 업데이트된 버전을 배포해줍니다. (이를 CI/CD - 지속적 통합/지속적 배포라고 합니다.)

## 2. 환경 변수 관리 (`.env.local`)

DB 접속 정보, 외부 API 키 등 민감하거나, 개발/운영 환경에 따라 달라져야 하는 값들은 코드에 직접 작성하면 안 됩니다. 이런 값들은 **환경 변수**로 관리해야 합니다.

Next.js 프로젝트 루트에 `.env.local` 파일을 만들고, `KEY=VALUE` 형식으로 변수를 저장합니다. 이 파일은 `.gitignore`에 기본적으로 등록되어 있어 Git에 올라가지 않으므로 안전합니다.

```
# .env.local

# 서버 사이드에서만 사용 가능한 변수
DATABASE_URL="mysql://user:password@host:port/database"
MY_API_KEY="abcdefg12345"

# 브라우저에 노출되어도 되는 변수 (NEXT_PUBLIC_ 접두사 필수)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_API_ENDPOINT="https://api.my-service.com"
```

**중요한 규칙:**

*   `NEXT_PUBLIC_` 접두사가 붙은 변수는 브라우저(클라이언트)에서도 접근 가능합니다. 즉, **HTML/JavaScript 코드에 포함되어 누구나 볼 수 있습니다.** 따라서 API 키 등 민감 정보에는 절대 사용하면 안 됩니다.
*   접두사가 없는 변수는 **서버 사이드(Node.js 환경)에서만** 접근 가능합니다. (`getStaticProps`, `getServerSideProps`, `API Routes` 내부)

**코드에서 접근하기:**

```jsx
// 1. 서버 사이드 (예: getServerSideProps)
export async function getServerSideProps() {
  // 'NEXT_PUBLIC_' 접두사가 없어도 접근 가능
  const apiKey = process.env.MY_API_KEY;
  // ... apiKey를 사용하여 서버에서 데이터 fetching ...

  return { props: { ... } };
}

// 2. 클라이언트 사이드 (예: 일반 컴포넌트)
export default function MyComponent() {
  // 'NEXT_PUBLIC_' 접두사가 반드시 있어야 접근 가능
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return <div>Google Analytics ID: {gaId}</div>;
}
```

**Vercel에 환경 변수 등록:**
Vercel 대시보드의 프로젝트 설정(Settings -> Environment Variables)에서 `.env.local`에 정의한 변수들을 똑같이 등록해주어야 배포된 환경에서도 정상적으로 동작합니다.

---

### 💡 예제: 환경 변수를 사용하여 블로그 제목 표시하기

1.  `.env.local` 파일 생성 및 변수 추가

    ```
    # .env.local
    NEXT_PUBLIC_BLOG_TITLE="나의 개발 블로그"
    ```

2.  `_app.js` 또는 레이아웃 컴포넌트에서 변수 사용하기

    ```jsx
    // src/pages/_app.js
    import '../styles/globals.css';

    function MyApp({ Component, pageProps }) {
      return (
        <div className="bg-gray-50 min-h-screen">
          <header className="bg-white shadow">
            <div className="container mx-auto p-4">
              {/* process.env로 환경 변수에 접근 */}
              <h1 className="text-3xl font-bold">
                {process.env.NEXT_PUBLIC_BLOG_TITLE}
              </h1>
            </div>
          </header>
          <main>
            <Component {...pageProps} />
          </main>
        </div>
      );
    }

    export default MyApp;
    ```
    *   개발 서버를 재시작해야 `.env.local` 파일의 변경사항이 적용됩니다.

### ✏️ 문제

**문제 1:** `.env.local` 파일에 `COPYRIGHT_HOLDER="Your Name"` 이라는 변수를 추가하세요. (접두사 없음)

**문제 2:** 모든 페이지 하단에 푸터(footer)를 추가하고, `getServerSideProps` 또는 `getStaticProps`를 사용하여 문제 1에서 만든 `COPYRIGHT_HOLDER` 변수를 읽어와 "© 2024 [Your Name]. All rights reserved." 와 같은 저작권 문구를 표시해보세요. (어떤 렌더링 전략을 사용해야 할지, 그리고 왜 그래야 하는지 생각해보세요!)
