# 6장: 정적 파일 제공과 템플릿 엔진

지금까지는 `res.send()`나 `res.json()`으로 텍스트나 JSON 데이터만 응답했습니다. 이번 장에서는 Express를 사용하여 이미지, CSS, 클라이언트 사이드 JavaScript 파일과 같은 **정적 파일(static files)**을 제공하는 방법과, 서버의 데이터를 동적으로 HTML에 채워넣는 **템플릿 엔진(template engine)**의 사용법을 배웁니다.

---

## 1. 핵심 개념

- **정적 파일(Static Files)**:
    - 서버에서 특별한 처리 없이 내용 그대로 클라이언트에게 제공되는 파일들을 의미합니다. (예: 이미지(`.jpg`, `.png`), CSS 스타일시트(`.css`), 프론트엔드 JavaScript 파일(`.js`), 폰트 파일 등)
    - Express의 내장 미들웨어인 `express.static()`을 사용하여 특정 폴더를 정적 파일 제공용으로 지정할 수 있습니다.

- **템플릿 엔진(Template Engine)**:
    - 정적인 템플릿 파일(예: HTML 파일)에 동적인 데이터(서버에서 전달된 변수)를 결합하여 최종적인 HTML을 생성하는 도구입니다.
    - Express는 특정 템플릿 엔진을 강제하지 않으며, Pug(구 Jade), EJS, Handlebars 등 다양한 엔진과 호환됩니다.
    - `res.render(viewName, dataObject)` 메소드를 사용하여 템플릿을 렌더링하고 클라이언트에게 응답합니다.

- **EJS (Embedded JavaScript Templating)**:
    - 가장 대중적인 템플릿 엔진 중 하나로, 일반 HTML 문법 내에 `<% ... %>` 와 같은 태그를 사용하여 JavaScript 코드를 삽입할 수 있어 배우기 쉽습니다.
    - `<%= ... %>`: 변수의 값을 HTML에 출력 (이스케이프 처리됨)
    - `<%- ... %>`: 변수의 값을 HTML에 출력 (이스케이프 처리 안 됨, HTML 태그를 직접 출력할 때 사용)
    - `<% ... %>`: 조건문, 반복문 등 JavaScript 로직 실행

## 2. 예제 코드

### 프로젝트 구조
```
my-express-app/
├── app.js
├── node_modules/
├── package.json
├── public/         <-- 정적 파일 폴더
│   ├── css/
│   │   └── style.css
│   └── images/
│       └── logo.png
└── views/          <-- 템플릿 파일 폴더
    └── index.ejs
```

### 예제 1: 정적 파일 제공하기

```javascript
// app.js
const express = require('express');
const path = require('path'); // 파일 및 디렉토리 경로 작업을 위한 내장 모듈
const app = express();

// 'public' 폴더를 정적 파일 제공 폴더로 지정합니다.
// 이제 /css/style.css, /images/logo.png 와 같은 경로로 파일에 접근할 수 있습니다.
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  // HTML 응답에 CSS 파일을 링크
  res.send(`
    <html>
      <head>
        <title>정적 파일 테스트</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body>
        <h1>안녕하세요!</h1>
        <p>이 페이지는 public/css/style.css의 스타일을 적용받습니다.</p>
        <img src="/images/logo.png" alt="로고 이미지">
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log('서버 실행 중'));
```

```css
/* public/css/style.css */
body {
  background-color: #f0f0f0;
  font-family: sans-serif;
}
h1 {
  color: navy;
}
```

### 예제 2: EJS 템플릿 엔진 사용하기

1.  **EJS 설치**: `npm install ejs`
2.  **`app.js` 설정 및 렌더링**:

    ```javascript
    // app.js
    const express = require('express');
    const path = require('path');
    const app = express();

    // 1. 뷰 엔진으로 ejs를 사용하도록 설정
    app.set('view engine', 'ejs');
    // 2. 템플릿 파일이 있는 폴더를 'views'로 지정
    app.set('views', path.join(__dirname, 'views'));

    app.get('/', (req, res) => {
      // 3. res.render()로 템플릿을 렌더링
      // 'index'는 'views/index.ejs' 파일을 의미
      // 두 번째 인자로 템플릿에 전달할 데이터를 객체 형태로 넘김
      res.render('index', {
        title: 'EJS 템플릿 엔진',
        user: { name: '최동진' },
        items: ['노트북', '키보드', '마우스']
      });
    });

    app.listen(3000, () => console.log('서버 실행 중'));
    ```

3.  **`views/index.ejs` 템플릿 파일 작성**:

    ```html
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <!-- title 변수를 출력 -->
      <title><%= title %></title>
    </head>
    <body>
      <h1><%= title %></h1>
      
      <!-- if 조건문으로 user 객체의 존재 여부 확인 -->
      <% if (user) { %>
        <p>환영합니다, <%= user.name %>님!</p>
      <% } else { %>
        <p>로그인이 필요합니다.</p>
      <% } %>

      <h2>상품 목록</h2>
      <!-- forEach 반복문으로 items 배열 순회 -->
      <ul>
        <% items.forEach(function(item) { %>
          <li><%= item %></li>
        <% }); %>
      </ul>
    </body>
    </html>
    ```

---

## 3. 연습 문제

### 문제 1: 가상 경로 접두사 사용하기
- **요구사항**: `public` 폴더의 정적 파일들을 `/static`이라는 가상 경로를 통해서만 접근할 수 있도록 설정해보세요.
- **세부사항**:
    1. `app.use(express.static('public'))` 코드를 `app.use('/static', express.static('public'))`으로 수정합니다.
    2. 이제 CSS 파일의 링크는 `/css/style.css`가 아닌 `/static/css/style.css`로 변경해야 접근할 수 있습니다.
- **장점**: 정적 파일의 URL 경로를 실제 폴더 구조와 분리하여 유연성과 보안을 높일 수 있습니다.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// app.js
app.use('/static', express.static(path.join(__dirname, 'public')));

// HTML에서 사용 예시
// <link rel="stylesheet" href="/static/css/style.css">
```
</details>

### 문제 2: `about.ejs` 페이지 만들기
- **요구사항**: `views` 폴더에 `about.ejs` 파일을 만들고, `/about` 경로로 접속했을 때 해당 페이지를 렌더링하세요.
- **세부사항**:
    1. `views/about.ejs` 파일을 새로 만듭니다.
    2. `about.ejs` 파일에는 이 서비스에 대한 간단한 설명과 함께, `app.js`에서 전달한 `version` 변수를 출력하는 코드를 작성합니다.
    3. `app.js`에 `GET /about` 라우트를 추가합니다.
    4. 해당 라우트 핸들러에서 `res.render('about', { version: '1.0.0' })`을 호출하여 페이지를 렌더링하고 데이터를 전달합니다.

<details>
<summary>문제 2 정답 예시</summary>

```html
<!-- views/about.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title>About Us</title>
</head>
<body>
  <h1>이 서비스에 대하여</h1>
  <p>이것은 Express.js 학습을 위한 예제 애플리케이션입니다.</p>
  <p>현재 버전: <%= version %></p>
</body>
</html>
```

```javascript
// app.js
app.get('/about', (req, res) => {
  res.render('about', { version: '1.0.0' });
});
```
</details>
