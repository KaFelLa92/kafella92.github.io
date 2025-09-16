# 2장: 라우팅 기초 - 길을 만들고 안내하기

라우팅(Routing)은 클라이언트의 요청 URL과 HTTP 메소드(GET, POST 등)에 따라 어떤 로직을 실행할지 결정하는 과정입니다. Express의 핵심 기능인 라우팅을 통해 서버의 각기 다른 "길"(엔드포인트)을 만드는 방법을 배웁니다.

---

## 1. 핵심 개념

- **라우트(Route)**: URL 경로(Path), HTTP 메소드(Method), 그리고 핸들러 함수(Handler)의 조합입니다.
- **라우팅의 기본 구조**:
  `app.METHOD(PATH, HANDLER)`
    - `app`: express 인스턴스
    - `METHOD`: HTTP 요청 메소드 (예: `get`, `post`, `put`, `delete` 등 소문자로 작성)
    - `PATH`: 서버의 경로 (URL)
    - `HANDLER`: 라우트가 일치할 때 실행되는 함수. `(req, res) => {}` 형태.

- **요청 객체 (`req`, Request)**: 클라이언트의 HTTP 요청에 대한 모든 정보를 담고 있는 객체입니다. (예: `req.params`, `req.query`, `req.body`, `req.headers`)

- **응답 객체 (`res`, Response)**: 서버가 클라이언트에게 보낼 HTTP 응답을 나타내는 객체입니다. 이 객체의 메소드를 호출하여 응답을 보냅니다. (예: `res.send()`, `res.json()`, `res.status()`, `res.render()`)

## 2. 주요 HTTP 메소드와 라우팅

- **`app.get(path, handler)`**: 데이터를 **조회(Read)**할 때 사용됩니다. 브라우저 주소창에 URL을 입력하면 GET 요청이 발생합니다.
- **`app.post(path, handler)`**: 데이터를 **생성(Create)**할 때 사용됩니다. 주로 로그인, 회원가입, 게시글 작성 등 클라이언트가 서버로 데이터를 보낼 때 사용합니다.
- **`app.put(path, handler)`**: 데이터를 **전체 수정(Update)**할 때 사용됩니다.
- **`app.patch(path, handler)`**: 데이터를 **부분 수정(Update)**할 때 사용됩니다.
- **`app.delete(path, handler)`**: 데이터를 **삭제(Delete)**할 때 사용됩니다.

---

## 3. 예제 코드: 기본적인 CRUD 라우트

가상의 사용자 데이터에 대한 생성, 조회, 수정, 삭제 라우트를 만들어봅니다. (아직 데이터베이스 연동은 하지 않습니다.)

```javascript
const express = require('express');
const app = express();
const port = 3000;

// GET: 모든 사용자 목록 조회
app.get('/users', (req, res) => {
  res.json([
    { id: 1, name: '최동진' },
    { id: 2, name: 'Gemini' }
  ]);
});

// GET: 특정 사용자 조회 (아래 4장에서 배울 라우트 파라미터와 함께 사용)
app.get('/users/1', (req, res) => {
  res.json({ id: 1, name: '최동진' });
});

// POST: 새로운 사용자 생성
app.post('/users', (req, res) => {
  // 실제로는 req.body의 데이터를 받아 처리 (3장에서 배울 미들웨어 필요)
  res.status(201).send('새로운 사용자가 생성되었습니다.');
});

// PUT: 사용자 정보 수정
app.put('/users/1', (req, res) => {
  res.send('사용자 정보가 수정되었습니다.');
});

// DELETE: 사용자 삭제
app.delete('/users/1', (req, res) => {
  res.send('사용자가 삭제되었습니다.');
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});
```

**테스트 방법**: `GET` 요청은 브라우저로 테스트할 수 있지만, `POST`, `PUT`, `DELETE` 등은 Postman, Insomnia, VS Code의 Thunder Client 확장 프로그램과 같은 API 테스트 도구를 사용해야 합니다.

---

## 4. 연습 문제

### 문제 1: 상품(Product) 라우트 만들기
- **요구사항**: 가상의 상품 정보를 다루는 두 개의 라우트를 만드세요.
- **세부사항**:
    1. `GET /products`: 접속 시, 상품 목록 배열을 JSON 형태로 응답합니다. (예: `[{ id: 'p1', name: '노트북' }, { id: 'p2', name: '키보드' }]`)
    2. `POST /products`: 접속 시, "상품이 등록되었습니다." 라는 텍스트와 함께 HTTP 상태 코드 `201` (Created)을 응답합니다. `res.status(201).send(...)`를 사용하세요.
- **확인**: API 테스트 도구를 사용하여 두 엔드포인트가 의도대로 동작하는지 확인합니다.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// GET /products 라우트
app.get('/products', (req, res) => {
  const products = [
    { id: 'p1', name: '노트북', price: 1500000 },
    { id: 'p2', name: '키보드', price: 120000 }
  ];
  res.json(products);
});

// POST /products 라우트
app.post('/products', (req, res) => {
  res.status(201).send('상품이 성공적으로 등록되었습니다.');
});
```
</details>

### 문제 2: `app.all()`과 `app.route()`
- **`app.all(path, handler)`**: 특정 경로에 대해 모든 HTTP 메소드(GET, POST, PUT 등) 요청을 처리합니다.
- **`app.route(path)`**: 특정 경로에 대한 라우트 핸들러들을 체인 형태로 묶을 수 있게 해줍니다.
- **요구사항**: `/board` 경로에 대한 요청을 `app.route()`를 사용하여 묶어서 처리해보세요.
- **세부사항**:
    1. `app.route('/board')`를 사용합니다.
    2. `.get()` 메소드를 체이닝하여, GET 요청 시 "게시판 글 목록입니다."를 응답합니다.
    3. `.post()` 메소드를 체이닝하여, POST 요청 시 "게시글이 작성되었습니다."를 응답합니다.
- **장점**: 코드 중복을 줄이고, 특정 경로와 관련된 로직을 한 곳에 모아 가독성을 높일 수 있습니다.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
app.route('/board')
  .get((req, res) => {
    res.send('GET 요청: 게시판 글 목록입니다.');
  })
  .post((req, res) => {
    res.send('POST 요청: 게시글이 작성되었습니다.');
  })
  .put((req, res) => {
    res.send('PUT 요청: 게시글이 수정되었습니다.');
  });
```
</details>
