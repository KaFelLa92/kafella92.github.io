# Chapter 6: 스타일링과 UI

애플리케이션의 기능만큼이나 중요한 것이 바로 디자인입니다. Next.js는 다양한 CSS 스타일링 방식을 지원합니다. 여기서는 가장 대표적인 두 가지 방식과, 현대 웹 개발의 대세인 Tailwind CSS에 대해 알아봅니다.

---

## 1. 전역(Global) CSS

애플리케이션 전체에 적용되는 CSS입니다. `src/pages/_app.js` 파일에서만 `import` 할 수 있습니다. 주로 폰트 설정, `body` 태그 스타일 초기화 등 전역적인 스타일을 정의할 때 사용합니다.

```css
/* src/styles/globals.css */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
```

```jsx
// src/pages/_app.js
import '../styles/globals.css'; // 전역 CSS는 여기서만 import

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

## 2. CSS Modules: 컴포넌트 스코프 스타일

CSS 클래스 이름이 다른 컴포넌트와 충돌하는 것을 방지하기 위한 기능입니다. 파일 이름을 `[컴포넌트명].module.css` 형식으로 만들면, Next.js가 빌드 시점에 고유한 클래스 이름을 자동으로 생성해줍니다.

이 방식을 사용하면 각 컴포넌트는 자신만의 독립된 스타일을 가지게 되어, 유지보수가 매우 용이해집니다.

## 3. Tailwind CSS: 가장 인기 있는 선택지

미리 정의된 수많은 클래스(Utility Class)를 조합하여 HTML 코드 내에서 직접 스타일을 적용하는 **Utility-First** CSS 프레임워크입니다. `padding: 1rem` 대신 `p-4`, `font-weight: bold` 대신 `font-bold` 와 같은 클래스를 사용합니다.

초기에는 HTML이 지저분해 보일 수 있지만, CSS 파일을 따로 열지 않고도 스타일을 빠르게 수정할 수 있고, 디자인 시스템을 일관되게 유지할 수 있어 생산성이 매우 높습니다.

---

### 💡 예제 1: CSS Modules로 버튼 스타일링하기

1.  **CSS Module 파일 생성**

    ```css
    /* src/components/Button.module.css */
    .button {
      background-color: royalblue;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 8px;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background-color: darkblue;
    }
    ```

2.  **컴포넌트에서 사용**

    ```jsx
    // src/components/MyButton.js
    import styles from './Button.module.css'; // styles 객체로 import

    // props로 children을 받으면 <MyButton>여기에 쓰는 내용</MyButton>이 들어옵니다.
    export default function MyButton({ children }) {
      // className에 styles 객체의 속성을 전달합니다.
      // 실제 렌더링 시 <button class="Button_button__a1B2c">... 와 같이 고유한 이름으로 변환됩니다.
      return <button className={styles.button}>{children}</button>;
    }
    ```

### 💡 예제 2: Tailwind CSS로 카드 UI 만들기

(Tailwind CSS가 설치 및 설정되었다고 가정합니다.)

```jsx
// src/components/InfoCard.js

export default function InfoCard({ title, content }) {
  return (
    // Tailwind 클래스를 조합하여 스타일을 적용합니다.
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
      <div>
        <div className="text-xl font-medium text-black">{title}</div>
        <p className="text-slate-500">{content}</p>
      </div>
    </div>
  );
}
```

### ✏️ 문제

**문제 1 (CSS Modules):** `Alert.module.css` 파일을 만들고, `success`와 `error` 두 가지 스타일을 정의해보세요.
*   `success` 클래스는 배경색이 연한 녹색, 글자색은 진한 녹색으로 지정합니다.
*   `error` 클래스는 배경색이 연한 빨간색, 글자색은 진한 빨간색으로 지정합니다.
*   `Alert` 컴포넌트를 만들어 `type`이라는 prop을 받아서, `type`이 "success"이면 `success` 스타일을, "error"이면 `error` 스타일을 적용하도록 구현해보세요.

**문제 2 (Tailwind CSS):** Tailwind CSS를 사용하여 간단한 로그인 폼을 만들어보세요.
*   "이메일"과 "비밀번호"를 입력할 수 있는 `input` 필드 2개와 "로그인" `button` 1개를 포함합니다.
*   `w-full` (width: 100%), `p-2` (padding: 0.5rem), `border` (테두리), `rounded-md` (둥근 모서리) 등의 클래스를 활용해보세요.
*   폼 전체를 감싸는 `div`에 `max-w-md`, `mx-auto`, `mt-10` 클래스를 적용하여 페이지 중앙에 적당한 크기로 보이게 해보세요.
