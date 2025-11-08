# 12장: 최종 프로젝트 - 미니 블로그 만들기

지금까지 배운 모든 기술(컴포넌트, Props, 반응성, Vue Router, Pinia)을 총동원하여 간단한 CRUD(Create, Read, Update, Delete) 기능이 있는 블로그 애플리케이션을 만듭니다.

---

## 1. 프로젝트 개요

### 만들 기능
- **글 목록 보기 (Read)**: 모든 게시글의 제목을 리스트 형태로 보여줍니다.
- **글 상세 보기 (Read)**: 특정 게시글의 제목과 내용을 상세하게 보여줍니다.
- **새 글 작성 (Create)**: 제목과 내용을 입력하여 새로운 글을 추가합니다.
- **글 수정 (Update)**: 기존 글의 제목과 내용을 수정합니다.
- **글 삭제 (Delete)**: 특정 글을 삭제합니다.

### 사용할 기술 스택
- **UI**: Vue 3 (Composition API)
- **라우팅**: Vue Router
- **전역 상태 관리**: Pinia

---

## 2. 단계별 구현 가이드

### 1단계: 프로젝트 구조 설정 및 라이브러리 설치

1.  `create-vue` (Vite 기반)로 새 프로젝트를 생성합니다.
    ```bash
    npm create vue@latest
    ```
    (설정 시 `Vue Router`와 `Pinia`를 추가(Add)할지 묻는 질문에 Yes로 답하면 편리합니다.)
2.  필요한 라이브러리를 설치합니다. (위 과정에서 설치했다면 생략)
    ```bash
    npm install vue-router pinia
    ```
3.  `src` 폴더 내에 `components`, `pages`(또는 `views`), `stores`, `router` 폴더 구조를 확인하거나 생성합니다.

### 2단계: 전역 상태(스토어) 설계 (`stores/post.js`)

Pinia를 사용하여 게시글 데이터를 관리하는 스토어를 만듭니다.

```javascript
// src/stores/post.js
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePostStore = defineStore('post', () => {
  const posts = ref([
    { id: 1, title: 'Vue.js, 너는 대체...', content: 'Vue를 처음 배우는데 생각보다 재미있네요.' },
    { id: 2, title: 'Pinia 사용법', content: '전역 상태 관리가 이렇게 쉬울 줄이야!' },
  ]);
  const nextPostId = ref(3);

  // 새 글 추가
  function addPost(postData) {
    posts.value.push({ ...postData, id: nextPostId.value });
    nextPostId.value++;
  }

  // 글 수정
  function updatePost(updatedPost) {
    const index = posts.value.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
      posts.value[index] = updatedPost;
    }
  }

  // 글 삭제
  function deletePost(id) {
    posts.value = posts.value.filter(p => p.id !== id);
  }

  return { posts, addPost, updatePost, deletePost };
});
```

### 3단계: 라우터 설정 (`router/index.js`)

Vue Router를 사용하여 페이지 경로를 설정합니다.

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import PostListPage from '../pages/PostListPage.vue';
import PostDetailPage from '../pages/PostDetailPage.vue';
import NewPostPage from '../pages/NewPostPage.vue';
import EditPostPage from '../pages/EditPostPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'PostList', component: PostListPage },
    { path: '/post/:id', name: 'PostDetail', component: PostDetailPage, props: true },
    { path: '/new-post', name: 'NewPost', component: NewPostPage },
    { path: '/edit-post/:id', name: 'EditPost', component: EditPostPage, props: true },
  ]
});

export default router;
```

### 4단계: 페이지 및 컴포넌트 구현

- **`PostForm.vue` (컴포넌트)**: 새 글 작성과 글 수정에서 재사용될 폼 컴포넌트입니다.
- **`PostListPage.vue` (페이지)**: `usePostStore`에서 `posts` 배열을 가져와 `v-for`로 렌더링합니다.
- **`PostDetailPage.vue` (페이지)**: `props`로 `id`를 받아 해당 게시글을 찾습니다. 수정/삭제 버튼을 포함합니다.
- **`NewPostPage.vue` (페이지)**: `PostForm`을 사용하고, 제출 시 `addPost` 액션을 호출합니다.
- **`EditPostPage.vue` (페이지)**: `props`로 `id`를 얻어 기존 글 데이터를 `PostForm`에 전달합니다. 제출 시 `updatePost` 액션을 호출합니다.

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
// stores/post.js의 addComment 액션 예시
function addComment(postId, commentText) {
  const post = posts.value.find(p => p.id === postId);
  if (post) {
    if (!post.comments) {
      post.comments = [];
    }
    post.comments.push({ id: Date.now(), text: commentText });
  }
}
```
</details>

### 문제 2: 검색 기능 추가하기
- **요구사항**: `PostListPage`에 검색창을 추가하여, 게시글 제목 기준으로 실시간 검색(필터링)이 되도록 만드세요.
- **세부사항**:
    1. `PostListPage` 컴포넌트에 `searchTerm`이라는 로컬 `ref` 상태를 만듭니다.
    2. 검색 `input`을 만들고, `v-model`로 `searchTerm` 상태와 연결합니다.
    3. `computed` 속성을 사용하여, `usePostStore`에서 가져온 `posts` 배열을 `searchTerm`으로 필터링한 `filteredPosts`를 만듭니다.
    4. 템플릿에서는 `posts` 대신 `filteredPosts`를 `v-for`로 렌더링합니다.

<details>
<summary>문제 2 힌트</summary>

```vue
<!-- PostListPage.vue 내부 -->
<script setup>
import { ref, computed } from 'vue';
import { usePostStore } from '../stores/post';

const postStore = usePostStore();
const searchTerm = ref('');

const filteredPosts = computed(() => {
  if (!searchTerm.value) {
    return postStore.posts;
  }
  return postStore.posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
</script>

<template>
  <input v-model="searchTerm" placeholder="게시글 검색..." />
  <!-- v-for="post in filteredPosts" ... -->
</template>
```
</details>
