# 9장: 스타일링 - 컴포넌트에 옷 입히기

React 컴포넌트의 스타일을 꾸미는 다양한 방법을 배웁니다. 일반 CSS 파일부터, 컴포넌트 스코프를 지원하는 CSS Modules, 그리고 JavaScript 내에서 스타일을 정의하는 CSS-in-JS까지 알아봅니다.

---

## 1. 핵심 개념

1.  **일반 CSS 파일 임포트**:
    - `import './App.css';` 와 같이 CSS 파일을 JavaScript 파일에서 직접 임포트하여 사용합니다.
    - 가장 간단한 방법이지만, 클래스 이름이 전역(global)으로 적용되기 때문에 다른 컴포넌트의 스타일과 충돌할 위험이 있습니다. (예: `A` 컴포넌트의 `.title` 스타일이 `B` 컴포넌트의 `.title`에 영향을 줌)

2.  **인라인 스타일(Inline Styles)**:
    - JSX 엘리먼트의 `style` 속성에 JavaScript 객체를 전달하여 스타일을 적용합니다.
    - CSS 속성은 카멜 케이스(camelCase)로 작성해야 합니다. (예: `background-color` -> `backgroundColor`)
    - 동적인 스타일에 유용하지만, 복잡한 스타일이나 미디어 쿼리, 가상 클래스(:hover 등) 적용이 어렵고, 재사용성이 떨어집니다.

3.  **CSS Modules**:
    - CSS 클래스 이름이 충돌하는 문제를 해결하기 위한 방법입니다.
    - 파일 이름을 `[filename].module.css` 형식으로 만들면, React가 빌드 시점에 각 클래스 이름을 고유한 문자열(예: `Component_title__a1B2c`)로 변환해줍니다.
    - 컴포넌트별로 독립된 스타일을 보장하여 유지보수성을 크게 향상시킵니다.

4.  **CSS-in-JS**:
    - JavaScript 코드 내에서 CSS를 작성하는 라이브러리들을 통칭합니다. (예: `styled-components`, `Emotion`)
    - JavaScript의 모든 기능(변수, 함수, props 등)을 스타일링에 활용할 수 있어 매우 동적이고 강력한 스타일링이 가능합니다.
    - 컴포넌트와 스타일이 하나의 파일에 묶여있어 관리가 편합니다.

---

## 2. 예제 코드

### 예제 1: CSS Modules 사용하기

컴포넌트 스코프를 가지는 스타일을 적용하는 방법입니다.

```css
/* src/components/Button.module.css */
.button {
  background-color: #61dafb; /* React 색상 */
  border: none;
  color: black;
  padding: 10px 20px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.primary {
  background-color: #007bff;
  color: white;
}
```

```javascript
// src/components/Button.js
import styles from './Button.module.css'; // styles 객체로 임포트

function Button({ children, primary }) {
  // 조건에 따라 여러 클래스를 조합
  const className = `${styles.button} ${primary ? styles.primary : ''}`;
  
  return <button className={className}>{children}</button>;
}

export default Button;

// 사용 예시
// <Button>일반 버튼</Button>
// <Button primary>중요 버튼</Button>
```

### 예제 2: CSS-in-JS (`styled-components`) 사용하기

`styled-components` 라이브러리를 사용하여 컴포넌트를 스타일링합니다. (`npm install styled-components` 필요)

```javascript
import styled from 'styled-components';

// Button이라는 이름의 스타일이 적용된 button 컴포넌트를 생성
const Button = styled.button`
  background-color: ${props => props.primary ? '#007bff' : '#f8f9fa'};
  color: ${props => props.primary ? 'white' : 'black'};
  border: 1px solid #dee2e6;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  /* &:hover 같은 가상 클래스도 사용 가능 */
  &:hover {
    opacity: 0.8;
  }
`;

// 사용 예시
// <Button>일반 버튼</Button>
// <Button primary>중요 버튼</Button>
```

---

## 3. 연습 문제

### 문제 1: 인라인 스타일로 경고 메시지 만들기
- **요구사항**: `Alert` 컴포넌트를 만들어, `type` prop에 따라 다른 스타일의 경고 메시지를 보여주세요.
- **세부사항**:
    1. `type`('success' 또는 'error')과 `message`를 props로 받습니다.
    2. 인라인 스타일을 사용하여 스타일 객체를 만듭니다.
    3. `type`이 'success'이면 배경은 연한 녹색, 글자는 진한 녹색으로 설정합니다.
    4. `type`이 'error'이면 배경은 연한 빨간색, 글자는 진한 빨간색으로 설정합니다.
    5. 공통적으로 padding, border-radius 등의 스타일도 적용합니다.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
function Alert({ type, message }) {
  const baseStyle = {
    padding: '15px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid',
  };

  const typeStyle = {
    success: {
      backgroundColor: '#d4edda',
      color: '#155724',
      borderColor: '#c3e6cb',
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderColor: '#f5c6cb',
    },
  };

  // 기본 스타일과 타입별 스타일을 합침
  const finalStyle = { ...baseStyle, ...typeStyle[type] };

  return <div style={finalStyle}>{message}</div>;
}

// 사용 예시
// <Alert type="success" message="성공적으로 처리되었습니다." />
// <Alert type="error" message="오류가 발생했습니다." />
```
</details>

### 문제 2: CSS Modules로 카드 UI 만들기
- **요구사항**: `Card.module.css` 파일을 사용하여 `Card` 컴포넌트를 만드세요.
- **세부사항**:
    1. `Card.module.css` 파일에 `.card`, `.cardTitle`, `.cardBody` 세 개의 클래스를 정의합니다.
    2. `.card`는 그림자, 둥근 모서리, padding을 가집니다.
    3. `.cardTitle`은 폰트 크기를 키우고, 아래쪽에 경계선을 추가합니다.
    4. `.cardBody`는 제목 아래의 컨텐츠 영역 스타일을 정의합니다.
    5. `Card` 컴포넌트는 `title` prop과 `children` prop을 받아, 각각 `.cardTitle`과 `.cardBody`에 렌더링합니다.

<details>
<summary>문제 2 정답 예시</summary>

```css
/* src/components/Card.module.css */
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin: 20px;
  background-color: white;
  max-width: 300px;
}

.cardTitle {
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.cardBody {
  font-size: 1rem;
  color: #555;
}
```

```javascript
// src/components/Card.js
import styles from './Card.module.css';

function Card({ title, children }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <div className={styles.cardBody}>
        {children}
      </div>
    </div>
  );
}

export default Card;

// 사용 예시
// <Card title="React란?">
//   <p>사용자 인터페이스를 만들기 위한 JavaScript 라이브러리입니다.</p>
// </Card>
```
</details>
