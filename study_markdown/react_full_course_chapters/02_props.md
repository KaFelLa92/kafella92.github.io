# 2장: Props - 컴포넌트에 생명 불어넣기

Props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 통로입니다. Props를 통해 재사용 가능한 동적인 컴포넌트를 만드는 방법을 배웁니다.

---

## 1. 핵심 개념

- **Props (Properties)**: 부모 컴포넌트가 자식 컴포넌트에게 전달하는 데이터 묶음입니다. 자바스크립트 객체 형태로 전달되며, 자식 컴포넌트 내에서는 **읽기 전용(read-only)**입니다. 즉, 자식 컴포넌트가 직접 props를 수정해서는 안 됩니다. (이러한 규칙을 "Top-down data flow"라고 합니다.)

- **Props 전달**: 자식 컴포넌트를 사용할 때 HTML의 속성(attribute)처럼 `propName="value"` 형식으로 전달합니다.

- **Props 사용**: 자식 컴포넌트는 함수의 첫 번째 인자로 `props` 객체를 받아 사용합니다. `props.propName` 형태로 값에 접근할 수 있습니다.

- **구조 분해 할당 (Destructuring)**: `props` 객체를 더 편리하게 사용하기 위해, `function Component({ prop1, prop2 })` 와 같이 인자 목록에서 바로 객체의 속성을 분해하여 변수로 받을 수 있습니다.

---

## 2. 예제 코드

### 예제 1: Props로 다양한 데이터 전달하기

문자열 뿐만 아니라 숫자, 배열, 객체, 함수 등 모든 JavaScript 값을 props로 전달할 수 있습니다.

```javascript
// src/components/UserProfile.js

// props를 구조 분해 할당하여 name, age, hobbies를 직접 변수로 받음
function UserProfile({ name, age, hobbies }) {
  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <h2>{name}</h2>
      <p>나이: {age}세</p>
      <h4>취미:</h4>
      <ul>
        {/* 배열인 hobbies를 map으로 순회하며 li 태그 생성 */}
        {hobbies.map(hobby => <li key={hobby}>{hobby}</li>)}
      </ul>
    </div>
  );
}

export default UserProfile;

// src/App.js
import UserProfile from './components/UserProfile';

function App() {
  const user1 = {
    name: '최동진',
    age: 30,
    hobbies: ['코딩', '독서', '영화감상']
  };

  return (
    <div>
      <h1>사용자 프로필</h1>
      <UserProfile 
        name={user1.name} 
        age={user1.age} 
        hobbies={user1.hobbies} 
      />
      <UserProfile 
        name="Gemini" 
        age={1} 
        hobbies={['데이터 분석', '언어 모델링']} 
      />
    </div>
  );
}

export default App;
```

### 예제 2: `children` Prop

컴포넌트 태그 사이에 있는 내용은 `children`이라는 특별한 prop으로 전달됩니다. 레이아웃 컴포넌트를 만들 때 유용합니다.

```javascript
// src/components/Card.js

// Card 컴포넌트는 감싸고 있는 모든 내용을 children으로 받아서 표시
function Card({ children }) {
  const cardStyle = {
    padding: '20px',
    margin: '20px',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: '10px',
    backgroundColor: 'white'
  };
  
  return (
    <div style={cardStyle}>
      {children}
    </div>
  );
}

export default Card;

// src/App.js
import Card from './components/Card';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <div>
      <Card>
        {/* 이 부분이 Card 컴포넌트의 children으로 전달됩니다. */}
        <h2>첫 번째 카드</h2>
        <p>Card 컴포넌트는 다른 컴포넌트나 엘리먼트를 감쌀 수 있습니다.</p>
      </Card>
      
      <Card>
        <UserProfile 
          name="최동진" 
          age={30} 
          hobbies={['코딩', '독서']} 
        />
      </Card>
    </div>
  );
}
```

---

## 3. 연습 문제

### 문제 1: `Article` 컴포넌트 만들기
- **요구사항**: 블로그 게시글을 표시하는 `Article` 컴포넌트를 만드세요.
- **세부사항**:
    1. `title`(제목), `author`(작성자), `content`(내용)를 props로 받습니다.
    2. `<h2>`로 제목을, `<h4>`로 "작성자: [author]"를, `<p>`로 내용을 표시합니다.
- **도전과제**: `App.js`에서 `Article` 컴포넌트를 사용하여 2개 이상의 다른 게시글을 렌더링해보세요.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// src/components/Article.js
function Article({ title, author, content }) {
  return (
    <article>
      <h2>{title}</h2>
      <h4>작성자: {author}</h4>
      <p>{content}</p>
    </article>
  );
}

export default Article;

// src/App.js
import Article from './components/Article';

function App() {
  return (
    <div>
      <h1>My Blog</h1>
      <Article 
        title="React Props 완전 정복"
        author="최동진"
        content="Props는 컴포넌트 간 데이터 전달의 핵심입니다..."
      />
      <hr />
      <Article 
        title="컴포넌트 재사용성 높이기"
        author="Gemini"
        content="Props를 활용하면 컴포넌트를 다양한 상황에서 재사용할 수 있습니다."
      />
    </div>
  );
}
```
</details>

### 문제 2: `ImageCard` 컴포넌트 만들기
- **요구사항**: 이미지와 설명을 함께 보여주는 `ImageCard` 컴포넌트를 만드세요.
- **세부사항**:
    1. `imageUrl`(이미지 주소)과 `caption`(설명)을 props로 받습니다.
    2. `<img>` 태그로 이미지를 표시하고, 그 아래 `<p>` 태그로 설명을 표시합니다.
- **도전과제**: `App.js`에서 `ImageCard` 컴포넌트를 사용하여 좋아하는 이미지 2개 이상을 화면에 띄워보세요. (이미지 주소는 인터넷에서 검색하여 사용할 수 있습니다.)

<details>
<summary>문제 2 정답 예시</summary>

```javascript
// src/components/ImageCard.js
function ImageCard({ imageUrl, caption }) {
  return (
    <figure>
      <img src={imageUrl} alt={caption} width="300" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export default ImageCard;

// src/App.js
import ImageCard from './components/ImageCard';

function App() {
  return (
    <div>
      <h1>Image Gallery</h1>
      <ImageCard 
        imageUrl="https://via.placeholder.com/300x200.png?text=React"
        caption="React 로고"
      />
      <ImageCard 
        imageUrl="https://via.placeholder.com/300x200.png?text=JavaScript"
        caption="JavaScript 로고"
      />
    </div>
  );
}
```
</details>
