# 10장: Vue Router - 페이지 이동과 목차 만들기

Vue는 기본적으로 단일 페이지 애플리케이션(SPA)이므로, 여러 페이지를 가진 것처럼 보이게 하려면 "라우팅" 라이브러리가 필요합니다. Vue의 공식 라우터인 `vue-router`를 사용하여 페이지 간 이동을 구현하는 방법을 배웁니다.

---

## 1. 핵심 개념

- **SPA (Single Page Application)**: 최초에 하나의 HTML 페이지만 불러오고, 이후에는 서버와 데이터를 교환하며 동적으로 페이지 내용을 갱신하는 방식의 웹 애플리케이션입니다. 페이지를 이동할 때 전체 페이지를 새로고침하지 않아 사용자 경험이 부드럽습니다.

- **`vue-router`**: Vue.js를 위한 공식 클라이언트 사이드 라우팅 라이브러리입니다. (`npm install vue-router` 로 설치)

- **주요 API 및 컴포넌트**:
    - **`createRouter`**: 라우터 인스턴스를 생성하는 함수입니다. `history`와 `routes` 옵션을 필수로 받습니다.
    - **`createWebHistory`**: HTML5의 History API를 사용하는 히스토리 모드입니다. URL이 일반 URL처럼 보입니다. (예: `https://example.com/user/id`)
    - **`routes` 배열**: 각 라우트 정보를 담는 객체들의 배열입니다. 각 객체는 `path`, `name`, `component` 등의 속성을 가집니다.
    - **`<router-view>`**: 현재 URL과 매칭되는 컴포넌트가 렌더링되는 위치를 지정하는 컴포넌트입니다.
    - **`<router-link>`**: 페이지를 새로고침하지 않고 다른 경로로 이동할 수 있는 네비게이션 링크를 만듭니다. HTML의 `<a>` 태그로 렌더링되며, `href` 대신 `to` prop을 사용합니다.
    - **`useRoute`**: 현재 활성화된 라우트 객체에 접근하는 컴포저블입니다. 경로, 파라미터, 쿼리 등의 정보를 담고 있습니다.
    - **`useRouter`**: 라우터 인스턴스에 접근하는 컴포저블입니다. 프로그래밍 방식으로 다른 페이지로 이동시킬 때 사용합니다.

---

## 2. 예제 코드

### 예제 1: 기본 라우팅 설정

홈, 소개, 대시보드 세 개의 페이지를 가진 기본적인 라우팅 구조입니다.

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import AboutPage from '../pages/AboutPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';

// 1. 라우트 정의
const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/dashboard', name: 'Dashboard', component: DashboardPage },
];

// 2. 라우터 인스턴스 생성
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

```javascript
// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 라우터 임포트

const app = createApp(App);
app.use(router); // 3. 앱에 라우터 등록
app.mount('#app');
```

```vue
<!-- src/App.vue -->
<template>
  <div>
    <!-- 4. router-link로 네비게이션 메뉴 생성 -->
    <nav>
      <router-link to="/">홈</router-link> |
      <router-link to="/about">소개</router-link> |
      <router-link to="/dashboard">대시보드</router-link>
    </nav>

    <hr />

    <!-- 5. router-view로 현재 경로에 맞는 컴포넌트 렌더링 -->
    <router-view></router-view>
  </div>
</template>
```

### 예제 2: 동적 라우트와 `useRoute`

사용자 ID에 따라 다른 프로필 페이지를 보여주는 동적 라우트 예제입니다.

```javascript
// src/router/index.js 에 추가
import UserProfilePage from '../pages/UserProfilePage.vue';

// ... routes 배열 안에 추가
// :userId는 동적인 값을 의미하는 파라미터
{ path: '/users/:userId', name: 'UserProfile', component: UserProfilePage }
```

```vue
<!-- src/pages/UserProfilePage.vue -->
<script setup>
import { useRoute } from 'vue-router';

const route = useRoute(); // 현재 라우트 객체 가져오기
const userId = route.params.userId; // URL의 :userId 부분의 값을 가져온다.
</script>

<template>
  <h2>사용자 프로필: {{ userId }}</h2>
</template>
```

---

## 3. 연습 문제

### 문제 1: "Not Found" 페이지 만들기
- **요구사항**: 정의되지 않은 경로로 접근했을 때 "404 - 페이지를 찾을 수 없습니다." 메시지를 보여주는 페이지를 만드세요.
- **세부사항**:
    1. `NotFoundPage.vue` 컴포넌트를 만듭니다.
    2. `router/index.js`의 `routes` 배열 맨 마지막에, `path`를 `/:pathMatch(.*)*`로 설정한 라우트를 추가합니다. 이 정규식은 위에서 매칭되지 않은 모든 경로를 의미합니다.
    3. 이 라우트의 `component`로 `NotFoundPage` 컴포넌트를 연결합니다.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// src/router/index.js 에 추가
import NotFoundPage from '../pages/NotFoundPage.vue';

// ... routes 배열 맨 마지막에 추가
{ 
  path: '/:pathMatch(.*)*', 
  name: 'NotFound', 
  component: NotFoundPage 
}
```

```vue
<!-- src/pages/NotFoundPage.vue -->
<template>
  <h2>404 - 페이지를 찾을 수 없습니다.</h2>
</template>
```
</details>

### 문제 2: 프로그래밍 방식 네비게이션 구현하기
- **요구사항**: 로그인 버튼을 클릭하면 대시보드 페이지로 이동하는 `LoginPage.vue` 컴포넌트를 만드세요.
- **세부사항**:
    1. `LoginPage.vue` 컴포넌트를 만듭니다. 이 컴포넌트는 "로그인" 버튼을 가집니다.
    2. `useRouter` 훅을 사용하여 `router` 인스턴스를 가져옵니다.
    3. "로그인" 버튼의 `@click` 핸들러에서 `router.push('/dashboard')`를 호출하여 대시보드 페이지로 이동시킵니다.
    4. `router/index.js`에 `/login` 경로와 `LoginPage` 컴포넌트를 연결하는 라우트를 추가합니다.

<details>
<summary>문제 2 정답 예시</summary>

```vue
<!-- src/pages/LoginPage.vue -->
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function handleLogin() {
  // 실제로는 로그인 API 호출 후 성공 시 이동
  alert('로그인 성공! 대시보드로 이동합니다.');
  router.push('/dashboard');
  // 또는 이름이 있는 라우트로 이동: router.push({ name: 'Dashboard' });
}
</script>

<template>
  <div>
    <h2>로그인 페이지</h2>
    <button @click="handleLogin">로그인</button>
  </div>
</template>
```

```javascript
// src/router/index.js 에 추가
import LoginPage from '../pages/LoginPage.vue';

// ... routes 배열에 추가
{ path: '/login', name: 'Login', component: LoginPage }
```
</details>
