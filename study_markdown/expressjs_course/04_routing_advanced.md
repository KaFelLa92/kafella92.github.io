# 4장: 라우팅 심화 - 경로를 체계적으로 관리하기

애플리케이션의 규모가 커지면 모든 라우트를 `app.js` 파일 하나에 관리하기 어려워집니다. Express의 라우트 파라미터, 쿼리 스트링, 그리고 `express.Router`를 사용하여 라우트를 동적이고 체계적으로 구성하는 방법을 배웁니다.

---

## 1. 핵심 개념

- **라우트 파라미터 (Route Parameters)**:
    - URL 경로의 일부를 변수로 사용하는 기능입니다. 주로 특정 리소스의 고유 ID를 전달할 때 사용됩니다.
    - 경로에 콜론(`:`)을 사용하여 정의합니다. (예: `/users/:userId`)
    - `req.params` 객체를 통해 접근할 수 있습니다. (예: `req.params.userId`)

- **쿼리 스트링 (Query Strings)**:
    - URL 경로 뒤에 `?`로 시작하여 `key=value` 쌍으로 전달되는 데이터입니다. 여러 개일 경우 `&`로 연결합니다.
    - 주로 데이터 정렬(sorting), 필터링(filtering), 검색(searching) 등 부가적인 옵션을 전달할 때 사용됩니다.
    - `req.query` 객체를 통해 접근할 수 있습니다.
    - 예시: `/posts?sort=latest&page=2` -> `req.query`는 `{ sort: 'latest', page: '2' }`가 됩니다.

- **`express.Router`**:
    - Express의 미니 라우터입니다. 라우트들을 모듈화하여 별도의 파일로 분리할 수 있게 해줍니다.
    - `express.Router()`로 라우터 인스턴스를 생성하고, 기존 `app` 객체처럼 `router.get()`, `router.post()` 등을 사용하여 라우트를 정의합니다.
    - 메인 파일(`app.js`)에서는 `app.use('/prefix', routerFile)` 형태로 라우터를 등록하여 사용합니다.

---

## 2. 예제 코드

### 예제 1: 라우트 파라미터와 쿼리 스트링 사용하기

```javascript
const express = require('express');
const app = express();

// 라우트 파라미터 예제
// /users/123, /users/abc 등 :userId 부분에 어떤 값이든 올 수 있음
app.get('/users/:userId/books/:bookId', (req, res) => {
  // req.params 객체는 { userId: '123', bookId: 'xyz' } 형태가 됨
  res.send(`사용자 ID: ${req.params.userId}, 책 ID: ${req.params.bookId}`);
});

// 쿼리 스트링 예제
// 접속 URL: http://localhost:3000/search?keyword=react&limit=10
app.get('/search', (req, res) => {
  // req.query 객체는 { keyword: 'react', limit: '10' } 형태가 됨
  const { keyword, limit } = req.query;
  res.send(`검색어: ${keyword}, 결과 수 제한: ${limit}`);
});

app.listen(3000, () => console.log('서버 실행 중'));
```

### 예제 2: `express.Router`로 라우트 분리하기

프로젝트 구조:
```
my-express-app/
├── app.js        (메인 파일)
└── routes/
    └── users.js  (사용자 관련 라우터)
```

```javascript
// routes/users.js

const express = require('express');
const router = express.Router(); // 라우터 인스턴스 생성

// 이 파일에서의 경로는 /users를 기준으로 상대적으로 설정됨

// GET /users/
router.get('/', (req, res) => {
  res.send('모든 사용자 목록');
});

// GET /users/:id
router.get('/:id', (req, res) => {
  res.send(`${req.params.id}번 사용자 정보`);
});

// POST /users/
router.post('/', (req, res) => {
  res.send('새로운 사용자 생성');
});

// 라우터를 모듈로 export
module.exports = router;
```

```javascript
// app.js (메인 파일)

const express = require('express');
const app = express();
const usersRouter = require('./routes/users'); // users 라우터 파일을 가져옴

// /users 경로로 들어오는 모든 요청은 usersRouter에서 처리하도록 등록
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.send('홈 페이지');
});

app.listen(3000, () => console.log('서버 실행 중'));
```
**실행**: `app.js`를 실행하고 `http://localhost:3000/users` 또는 `http://localhost:3000/users/123`으로 접속하면 `routes/users.js`에 정의된 핸들러가 동작합니다.

---

## 3. 연습 문제

### 문제 1: 블로그 게시물 라우트 만들기
- **요구사항**: 라우트 파라미터를 사용하여 특정 카테고리의 특정 게시물 ID를 조회하는 라우트를 만드세요.
- **세부사항**:
    1. `GET /posts/:category/:postId` 형태의 경로를 설정합니다.
    2. 핸들러 함수에서 `req.params`를 사용하여 `category`와 `postId`를 추출합니다.
    3. "카테고리: [category], 게시물 ID: [postId]" 형식의 문자열을 응답합니다.
- **확인**: 브라우저에서 `http://localhost:3000/posts/tech/101` 과 같은 URL로 접속하여 결과 확인.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
app.get('/posts/:category/:postId', (req, res) => {
  const { category, postId } = req.params;
  res.send(`카테고리: ${category}, 게시물 ID: ${postId}`);
});
```
</details>

### 문제 2: 상품 라우터 분리하기
- **요구사항**: 2장에서 만들었던 상품(Product) 관련 라우트들을 `routes/products.js` 파일로 분리하세요.
- **세부사항**:
    1. `routes` 폴더를 만들고 그 안에 `products.js` 파일을 생성합니다.
    2. `products.js`에서 `express.Router()`를 사용하여 라우터를 생성합니다.
    3. `GET /` (모든 상품 조회)와 `POST /` (새 상품 생성) 라우트를 `router` 객체에 정의합니다.
    4. `products.js` 파일 끝에서 `router`를 `module.exports` 합니다.
    5. 메인 `app.js` 파일에서 `products.js` 라우터를 `require`하고, `app.use('/products', ...)`를 사용하여 등록합니다.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
// routes/products.js
const express = require('express');
const router = express.Router();

// GET /products/
router.get('/', (req, res) => {
  res.json([{ name: '노트북' }, { name: '키보드' }]);
});

// POST /products/
router.post('/', (req, res) => {
  res.status(201).send('상품 생성 완료');
});

module.exports = router;
```

```javascript
// app.js
const express = require('express');
const app = express();
const productsRouter = require('./routes/products');

app.use('/products', productsRouter);

app.listen(3000, () => console.log('서버 실행 중'));
```
</details>
