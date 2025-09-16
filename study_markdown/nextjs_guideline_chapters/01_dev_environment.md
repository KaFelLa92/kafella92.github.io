# Chapter 1: 개발 환경 설정 및 첫 프로젝트

Spring 개발자가 Next.js의 세계로 첫발을 내딛는 단계입니다. Java의 JDK를 설치하듯 Node.js를 설정하고, 첫 프로젝트를 생성하며 구조를 살펴보겠습니다.

---

## 1. 필수 도구 설치

1.  **Node.js**: JavaScript 런타임입니다. Java의 JDK와 같습니다. [nodejs.org](https://nodejs.org/)에서 **LTS 버전**을 설치하세요. 설치 후 터미널(cmd 또는 PowerShell)에서 `node -v` 와 `npm -v` 명령어로 설치를 확인합니다.
2.  **VS Code**: 추천하는 코드 에디터입니다. [code.visualstudio.com](https://code.visualstudio.com/)에서 다운로드할 수 있습니다.

## 2. `create-next-app`으로 프로젝트 시작하기

터미널을 열고 원하는 경로로 이동한 뒤, 다음 명령어를 실행하세요.

```bash
npx create-next-app@latest my-next-app
```

몇 가지 질문이 나옵니다. Spring Initializr처럼 프로젝트 설정을 하는 과정입니다.

*   `Would you like to use TypeScript?` **(No)** - 우선 JavaScript에 집중합니다.
*   `Would you like to use ESLint?` **(Yes)** - 코드 품질을 위한 필수 도구입니다.
*   `Would you like to use Tailwind CSS?` **(No)** - 나중에 직접 설치하며 배울 것입니다.
*   `Would you like to use `src/` directory?` **(Yes)** - `src` 폴더에 소스를 모아 관리하는 것이 Spring 프로젝트 구조와 유사하여 깔끔합니다.
*   `Would you like to use App Router?` **(No)** - 우선 더 직관적인 Pages Router로 시작하겠습니다.

## 3. 프로젝트 구조 훑어보기

Spring Boot 프로젝트와 비교하며 구조를 이해해 보세요.

```
my-next-app/
├── node_modules/   # 의존성 라이브러리 (Maven/Gradle의 의존성과 비슷)
├── public/         # 이미지, 폰트 등 정적 파일 (`src/main/resources/static`과 유사)
├── src/
│   └── pages/      # Next.js의 핵심! 이 안의 파일들이 URL 주소가 됨 (`@Controller` 역할)
│       ├── _app.js     # 모든 페이지의 공통 레이아웃/설정
│       ├── api/        # API 서버 역할을 하는 파일들 (`@RestController` 역할)
│       └── index.js    # 루트 URL ('/')에 해당하는 페이지
├── .eslintrc.json  # 코드 스타일 규칙 (Checkstyle, PMD 설정과 유사)
├── .gitignore      # Git에 올리지 않을 파일 목록
└── package.json    # 프로젝트 정보 및 의존성 목록 (pom.xml, build.gradle과 유사)
```

## 4. 개발 서버 실행과 "Hello World"

프로젝트 폴더로 이동하여 개발 서버를 실행합니다.

```bash
cd my-next-app
npm run dev
```

이제 브라우저에서 `http://localhost:3000`으로 접속해보세요. Next.js 시작 페이지가 보일 겁니다.

---

### 💡 예제: 첫 페이지 수정하기

`src/pages/index.js` 파일을 열고 기존 내용을 모두 지운 뒤, 아래 코드로 수정해보세요. 저장하는 즉시 브라우저 화면이 자동으로 바뀝니다.

```jsx
// src/pages/index.js

// React 컴포넌트는 기본적으로 함수 형태입니다.
// 이 함수가 반환하는 JSX가 화면에 렌더링됩니다.
export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <h1 style={{ color: '#333', fontSize: '48px' }}>
        Hello, Spring Developers!
      </h1>
      <p style={{ color: '#555', fontSize: '24px' }}>
        Welcome to the Next.js world.
      </p>
    </div>
  );
}
```

### ✏️ 문제

**문제 1:** 위 예제 코드에 이어서, `index.js` 페이지에 본인의 이름과 현재 공부하고 있는 기술 스택(예: Spring Boot, JPA, Next.js)을 목록(`<ul>`, `<li>` 태그 사용)으로 표시하는 자기소개 섹션을 추가해보세요.
