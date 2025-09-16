# 7장: 실전 프로젝트 - 메모장 API 서버 만들기

지금까지 배운 Express의 모든 개념(라우팅, 미들웨어, 오류 처리 등)을 종합하여 간단한 메모(Memo)에 대한 CRUD(Create, Read, Update, Delete) 기능을 제공하는 REST API 서버를 만들어봅니다. 데이터는 실제 데이터베이스 대신 메모리(배열)에 저장하여 로직에 집중합니다.

---

## 1. 프로젝트 목표 및 구조

- **기능 요구사항**:
    - 모든 메모 조회 (GET /memos)
    - 특정 ID의 메모 조회 (GET /memos/:id)
    - 새 메모 작성 (POST /memos)
    - 특정 메모 수정 (PUT /memos/:id)
    - 특정 메모 삭제 (DELETE /memos/:id)

- **프로젝트 구조**:
    ```
    memo-api-server/
    ├── app.js          # 메인 서버 파일
    ├── package.json
    └── routes/
        └── memos.js    # 메모 관련 라우터
    ```

## 2. 구현 단계

### 1단계: 프로젝트 초기화 및 Express 설치

```bash
npm init -y
npm install express
```

### 2단계: 데이터 저장소 및 라우터 파일 생성 (`routes/memos.js`)

실제 DB 대신, 서버가 실행되는 동안 메모 데이터를 저장할 배열을 만듭니다.

```javascript
// routes/memos.js
const express = require('express');
const router = express.Router();

// 데이터베이스 대신 사용할 메모리 내 데이터 저장소
let memos = [
  { id: 1, title: '첫 번째 메모', content: 'Express.js 공부하기' },
  { id: 2, title: '두 번째 메모', content: '저녁 장보기' }
];
let nextId = 3;

// (1) 모든 메모 조회 (GET /memos)
router.get('/', (req, res) => {
  res.json(memos);
});

// (2) 특정 ID의 메모 조회 (GET /memos/:id)
router.get('/:id', (req, res) => {
  const memo = memos.find(m => m.id === parseInt(req.params.id));
  if (!memo) {
    return res.status(404).send('메모를 찾을 수 없습니다.');
  }
  res.json(memo);
});

// (3) 새 메모 작성 (POST /memos)
router.post('/', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('제목과 내용을 모두 입력해야 합니다.');
  }
  const newMemo = { id: nextId++, title, content };
  memos.push(newMemo);
  res.status(201).json(newMemo);
});

// (4) 특정 메모 수정 (PUT /memos/:id)
router.put('/:id', (req, res) => {
  const memo = memos.find(m => m.id === parseInt(req.params.id));
  if (!memo) {
    return res.status(404).send('수정할 메모를 찾을 수 없습니다.');
  }
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('제목과 내용을 모두 입력해야 합니다.');
  }
  memo.title = title;
  memo.content = content;
  res.json(memo);
});

// (5) 특정 메모 삭제 (DELETE /memos/:id)
router.delete('/:id', (req, res) => {
  const memoIndex = memos.findIndex(m => m.id === parseInt(req.params.id));
  if (memoIndex === -1) {
    return res.status(404).send('삭제할 메모를 찾을 수 없습니다.');
  }
  memos.splice(memoIndex, 1);
  res.status(204).send(); // No Content
});

module.exports = router;
```

### 3단계: 메인 서버 파일 작성 (`app.js`)

라우터를 등록하고 필요한 미들웨어를 설정합니다.

```javascript
// app.js
const express = require('express');
const memosRouter = require('./routes/memos');

const app = express();
const port = 3000;

// JSON body 파싱을 위한 미들웨어 등록
app.use(express.json());

// /memos 경로에 대한 요청을 memosRouter로 전달
app.use('/memos', memosRouter);

// 기본 오류 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('서버 오류가 발생했습니다.');
});

app.listen(port, () => {
  console.log(`메모 API 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
```

### 4단계: API 테스트

Postman이나 Insomnia 같은 API 테스트 도구를 사용하여 각 엔드포인트(GET, POST, PUT, DELETE)가 의도한 대로 동작하는지 확인합니다.

- **POST `/memos` 요청 예시**:
  - Body (raw, JSON):
    ```json
    {
      "title": "새로운 할 일",
      "content": "API 서버 만들기 프로젝트 완료하기"
    }
    ```

---

## 3. 연습 문제 및 개선 과제

### 문제 1: 입력값 검증 강화하기
- **요구사항**: 메모를 생성(POST)하거나 수정(PUT)할 때, `title`과 `content`의 길이를 검증하는 로직을 추가하세요.
- **세부사항**:
    1. `title`은 1자 이상 50자 이하, `content`는 1자 이상 200자 이하로 제한합니다.
    2. 유효성 검사에 실패하면, "제목은 1~50자, 내용은 1~200자로 입력해야 합니다." 와 같은 구체적인 오류 메시지와 함께 400 (Bad Request) 상태 코드를 응답합니다.

<details>
<summary>문제 1 힌트</summary>

```javascript
// POST /memos 핸들러 내부
const { title, content } = req.body;
if (!title || !content || title.length > 50 || content.length > 200) {
  return res.status(400).send('제목(1~50자)과 내용(1~200자)을 확인해주세요.');
}
// ...
```
</details>

### 문제 2: 라우트 핸들러 분리하기 (리팩토링)
- **요구사항**: `routes/memos.js` 파일이 너무 길어지고 있습니다. 각 라우트의 핸들러 함수(로직)를 별도의 컨트롤러(controller) 객체나 파일로 분리하여 코드 구조를 개선해보세요.
- **세부사항**:
    1. `controllers/memoController.js` 파일을 만듭니다.
    2. `getAllMemos`, `getMemoById`, `createMemo` 등 각 라우트에 해당하는 함수들을 만들어 `module.exports` 합니다.
    3. `routes/memos.js`에서는 이 컨트롤러 함수들을 `require`하여 라우트 핸들러로 등록합니다. (예: `router.get('/', memoController.getAllMemos);`)
- **장점**: 라우트 정의(어떤 길)와 비즈니스 로직(무엇을 할지)이 분리되어 코드를 이해하고 유지보수하기 훨씬 쉬워집니다.

<details>
<summary>문제 2 힌트</summary>

```javascript
// controllers/memoController.js
let memos = []; // 데이터는 컨트롤러에서 관리
let nextId = 1;

exports.getAllMemos = (req, res) => { /* ... */ };
exports.createMemo = (req, res) => { /* ... */ };
// ... 다른 함수들도 export
```

```javascript
// routes/memos.js
const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController'); // 경로 주의

router.get('/', memoController.getAllMemos);
router.post('/', memoController.createMemo);
// ...

module.exports = router;
```
</details>
