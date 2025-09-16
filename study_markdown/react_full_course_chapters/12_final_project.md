# 12장: 최종 프로젝트 - 미니 블로그 만들기

지금까지 배운 모든 기술(컴포넌트, Props, State, React Router, Zustand)을 총동원하여 간단한 CRUD(Create, Read, Update, Delete) 기능이 있는 블로그 애플리케이션을 만듭니다.

---

## 1. 프로젝트 개요

### 만들 기능
- **글 목록 보기 (Read)**: 모든 게시글의 제목을 리스트 형태로 보여줍니다.
- **글 상세 보기 (Read)**: 특정 게시글의 제목과 내용을 상세하게 보여줍니다.
- **새 글 작성 (Create)**: 제목과 내용을 입력하여 새로운 글을 추가합니다.
- **글 수정 (Update)**: 기존 글의 제목과 내용을 수정합니다.
- **글 삭제 (Delete)**: 특정 글을 삭제합니다.

### 사용할 기술 스택
- **UI**: React
- **라우팅**: React Router (`react-router-dom`)
- **전역 상태 관리**: Zustand

---

## 2. 단계별 구현 가이드

### 1단계: 프로젝트 구조 설정 및 라이브러리 설치

1.  `create-react-app`으로 새 프로젝트를 생성합니다.
2.  필요한 라이브러리를 설치합니다.
    ```bash
    npm install react-router-dom zustand
    ```
3.  `src` 폴더 내에 `components`, `pages`, `stores` 폴더를 생성합니다.

### 2단계: 전역 상태(스토어) 설계 (`stores/postStore.js`)

Zustand를 사용하여 게시글 데이터를 관리하는 스토어를 만듭니다.

```javascript
// src/stores/postStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // (선택) 새로고침해도 데이터가 유지되도록 persist 미들웨어 사용

const usePostStore = create(
  persist( // persist로 스토어를 감싸면 localStorage에 상태가 저장됨
    (set, get) => ({
      posts: [
        { id: 1, title: '리액트, 너는 대체...', content: '리액트를 처음 배우는데 생각보다 재미있네요.' },
        { id: 2, title: 'Zustand 사용법', content: '전역 상태 관리가 이렇게 쉬울 줄이야!' },
      ],
      nextPostId: 3,
      
      // 새 글 추가
      addPost: (post) => set((state) => ({
        posts: [...state.posts, { ...post, id: state.nextPostId }],
        nextPostId: state.nextPostId + 1,
      })),
      
      // 글 수정
      updatePost: (updatedPost) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        ),
      })),
      
      // 글 삭제
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter(post => post.id !== id),
      })),
      
      // ID로 특정 글 찾기 (get() 함수 사용)
      getPostById: (id) => {
        return get().posts.find((p) => p.id === id);
      }
    }),
    {
      name: 'post-storage', // localStorage에 저장될 때 사용될 키 이름
    }
  )
);

export default usePostStore;
```

### 3단계: 라우터 설정 (`App.js`)

React Router를 사용하여 페이지 경로를 설정합니다.

```javascript
// src/App.js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';
import NewPostPage from './pages/NewPostPage';
import EditPostPage from './pages/EditPostPage';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '10px' }}>홈(글 목록)</Link>
        <Link to="/new-post">새 글 작성</Link>
      </nav>
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<PostListPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/new-post" element={<NewPostPage />} />
          <Route path="/edit-post/:id" element={<EditPostPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
```

### 4단계: 페이지 및 컴포넌트 구현

각 페이지 컴포넌트를 구현합니다. (상세 코드는 원본 `react_full_course.md` 파일의 12장 내용과 유사하므로, 여기서는 주요 로직과 추가적인 설명을 덧붙입니다.)

- **`PostForm.js` (컴포넌트)**: 새 글 작성과 글 수정에서 재사용될 폼 컴포넌트입니다. `initialData` prop을 받아 폼을 채우고, `onSubmit` prop으로 받은 함수를 제출 시 호출합니다.
- **`PostListPage.js` (페이지)**: `usePostStore`에서 `posts` 배열을 가져와 `map`으로 렌더링합니다. 각 항목에 상세 페이지로 가는 `<Link>`를 연결합니다.
- **`PostDetailPage.js` (페이지)**: `useParams`로 `id`를 얻고, `getPostById`로 해당 게시글을 찾습니다. 수정/삭제 버튼을 포함하며, 삭제 시 `window.confirm`으로 확인 후 `deletePost` 액션을 호출합니다.
- **`NewPostPage.js` (페이지)**: `PostForm`을 사용하고, 제출 시 `addPost` 액션을 호출한 뒤 목록 페이지로 이동합니다.
- **`EditPostPage.js` (페이지)**: `useParams`로 `id`를 얻어 기존 글 데이터를 `PostForm`의 `initialData`로 전달합니다. 제출 시 `updatePost` 액션을 호출합니다.

---

## 3. 연습 문제 및 도전 과제

### 문제 1: 댓글 기능 추가하기
- **요구사항**: `postStore`에 댓글 관련 상태와 액션을 추가하고, `PostDetailPage`에서 댓글을 보고 작성할 수 있게 만드세요.
- **세부사항**:
    1. `postStore`의 `posts` 배열에 있는 각 post 객체에 `comments: []` 속성을 추가합니다.
    2. `addComment(postId, commentText)` 액션을 스토어에 만듭니다. 이 액션은 해당 `postId`를 가진 게시글을 찾아 `comments` 배열에 새 댓글을 추가해야 합니다.
    3. `PostDetailPage`에서 해당 게시글의 `comments`를 리스트로 보여줍니다.
    4. `PostDetailPage`에 간단한 댓글 입력 폼을 만들고, 제출 시 `addComment` 액션을 호출합니다.

<details>
<summary>문제 1 힌트</summary>

```javascript
// postStore.js의 addComment 액션 예시
addComment: (postId, commentText) => set(state => ({
  posts: state.posts.map(post => 
    post.id === postId 
      ? { ...post, comments: [...post.comments, { id: Date.now(), text: commentText }] }
      : post
  )
})),
```
</details>

### 문제 2: 검색 기능 추가하기
- **요구사항**: `PostListPage`에 검색창을 추가하여, 게시글 제목 기준으로 실시간 검색(필터링)이 되도록 만드세요.
- **세부사항**:
    1. `PostListPage` 컴포넌트에 `searchTerm`이라는 로컬 state를 만듭니다.
    2. 검색 `input`을 만들고, `onChange` 이벤트 발생 시 `searchTerm` state를 업데이트합니다.
    3. `usePostStore`에서 가져온 `posts` 배열을 렌더링하기 전에, `filter` 메소드를 사용하여 `post.title`이 `searchTerm`을 포함하는 게시글만 걸러냅니다.
- **도전과제**: 검색 로직을 `useMemo`로 감싸서, `posts`나 `searchTerm`이 변경될 때만 필터링이 다시 일어나도록 최적화해보세요.

<details>
<summary>문제 2 힌트</summary>

```javascript
// PostListPage.js 내부
const [searchTerm, setSearchTerm] = useState('');
const posts = usePostStore(state => state.posts);

const filteredPosts = posts.filter(post => 
  post.title.toLowerCase().includes(searchTerm.toLowerCase())
);

// 렌더링 시에는 posts 대신 filteredPosts를 map으로 순회
```
</details>
