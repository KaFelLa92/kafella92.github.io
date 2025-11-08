# 5장: 조건부 렌더링 - 상황에 맞는 UI 보여주기

조건부 렌더링은 특정 조건에 따라 다른 엘리먼트나 컴포넌트를 렌더링하는 기법입니다. Vue에서는 `v-if`, `v-else-if`, `v-else`, `v-show` 디렉티브를 사용하여 이를 구현합니다.

---

## 1. 핵심 개념 및 기법

1.  **`v-if`, `v-else-if`, `v-else`**:
    - `v-if`는 디렉티브의 표현식이 `true`일 때만 블록을 렌더링합니다.
    - `v-else-if`는 이전 `v-if` 또는 `v-else-if` 블록이 `false`일 때 자신의 조건을 검사합니다.
    - `v-else`는 앞선 모든 `v-if`, `v-else-if` 조건이 `false`일 때 렌더링됩니다.
    - 이 디렉티브들은 **"실제"** 조건부 렌더링입니다. 조건이 `false`이면 해당 엘리먼트와 그 안의 자식 컴포넌트들은 DOM에서 완전히 제거되고 파괴됩니다.

2.  **`<template>`과 `v-if`**:
    - 여러 엘리먼트를 하나의 조건부 블록으로 묶고 싶을 때, 보이지 않는 래퍼(wrapper) 역할을 하는 `<template>` 태그에 `v-if`를 사용할 수 있습니다.

3.  **`v-show`**:
    - `v-if`와 비슷하지만, 조건과 관계없이 항상 엘리먼트를 렌더링하고 DOM에 유지합니다.
    - 조건이 `false`이면 단순히 CSS의 `display: none;` 스타일을 적용하여 엘리먼트를 숨깁니다.

4.  **`v-if` vs `v-show`**:
    - **`v-if`**: 전환 비용이 높습니다. 조건이 자주 바뀌지 않을 때 사용하는 것이 좋습니다. 런타임에 조건이 `true`가 될 일이 거의 없다면 초기 렌더링 비용이 더 저렴합니다.
    - **`v-show`**: 초기 렌더링 비용이 높습니다. 엘리먼트를 매우 자주 보여주거나 숨겨야 할 때 사용하는 것이 좋습니다.

---

## 2. 예제 코드

### 예제 1: 로그인 상태에 따른 UI 제어

사용자의 로그인 여부(`isLoggedIn`)에 따라 환영 메시지 또는 로그인 버튼을 보여줍니다.

```vue
<script setup>
import { ref } from 'vue';

const isLoggedIn = ref(false);
</script>

<template>
  <div>
    <!-- v-if와 v-else를 사용하여 조건에 따라 다른 블록을 렌더링 -->
    <div v-if="isLoggedIn">
      <p>환영합니다! 다시 오셨군요.</p>
      <button @click="isLoggedIn = false">로그아웃</button>
    </div>
    <div v-else>
      <p>로그인이 필요합니다.</p>
      <button @click="isLoggedIn = true">로그인</button>
    </div>
  </div>
</template>
```

### 예제 2: `v-show`로 토글하기

`v-show`를 사용하여 엘리먼트를 간단히 보여주거나 숨깁니다.

```vue
<script setup>
import { ref } from 'vue';

const isVisible = ref(true);
</script>

<template>
  <div>
    <button @click="isVisible = !isVisible">토글</button>
    
    <!-- isVisible 값에 따라 display: none; 스타일이 적용되거나 해제됨 -->
    <h1 v-show="isVisible">이 제목을 보여주거나 숨깁니다.</h1>
  </div>
</template>
```

---

## 3. 연습 문제

### 문제 1: 로딩 스피너 구현하기
- **요구사항**: 데이터 로딩 상태를 시뮬레이션하는 `DataLoader.vue` 컴포넌트를 만드세요.
- **세부사항**:
    1. `isLoading` 이라는 `ref` 상태를 만들고 초기값은 `true`로 설정합니다.
    2. `onMounted` 훅과 `setTimeout`을 사용하여, 컴포넌트가 마운트되고 2초 후에 `isLoading` 상태를 `false`로 변경합니다.
    3. `isLoading`이 `true`이면 "로딩 중..." 이라는 텍스트를 보여줍니다. (`v-if` 사용)
    4. `isLoading`이 `false`이면 "데이터 로딩 완료!" 라는 텍스트와 함께 가상의 데이터 목록(예: `<ul><li>항목 1</li>...</ul>`)을 보여줍니다. (`v-else` 사용)

<details>
<summary>문제 1 정답 예시</summary>

```vue
<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});
</script>

<template>
  <div>
    <div v-if="isLoading">
      <p>로딩 중...</p>
    </div>
    <div v-else>
      <h1>데이터 로딩 완료!</h1>
      <ul>
        <li>항목 1</li>
        <li>항목 2</li>
        <li>항목 3</li>
      </ul>
    </div>
  </div>
</template>
```
</details>

### 문제 2: 사용자 권한에 따른 버튼 표시하기
- **요구사항**: 사용자의 역할(`role`)에 따라 다른 버튼을 보여주는 `AdminPanel.vue` 컴포넌트를 만드세요.
- **세부사항**:
    1. `user` 객체를 prop으로 받습니다. 이 객체는 `name`과 `role`(`'admin'` 또는 `'guest'`) 속성을 가집니다.
    2. 사용자 이름을 환영하는 메시지를 항상 표시합니다. (예: "환영합니다, [user.name]님")
    3. `user.role`이 `'admin'`일 경우에만 "관리자 대시보드" 버튼을 추가로 보여줍니다. (`v-if`를 사용해보세요.)
- **도전과제**: `user.role`에 따라 `'editor'` 역할을 추가하고, `'admin'`은 "관리자 대시보드", `'editor'`는 "글쓰기" 버튼, `'guest'`는 아무 버튼도 보여주지 않도록 `v-if`, `v-else-if`, `v-else`를 모두 사용해보세요.

<details>
<summary>문제 2 정답 예시</summary>

```vue
<!-- AdminPanel.vue -->
<script setup>
defineProps({
  user: Object
});
</script>

<template>
  <div>
    <p v-if="user">환영합니다, {{ user.name }}님</p>
    <p v-else>로그인되지 않았습니다.</p>
    
    <!-- 도전과제 포함 -->
    <button v-if="user && user.role === 'admin'">관리자 대시보드</button>
    <button v-else-if="user && user.role === 'editor'">글쓰기</button>
  </div>
</template>
```

```vue
<!-- App.vue (사용 예시) -->
<script setup>
import AdminPanel from './components/AdminPanel.vue';

const adminUser = { name: '최동진', role: 'admin' };
const editorUser = { name: 'Gemini', role: 'editor' };
const guestUser = { name: 'Guest', role: 'guest' };
</script>

<template>
  <AdminPanel :user="adminUser" />  <!-- 관리자 대시보드 버튼 보임 -->
  <hr>
  <AdminPanel :user="editorUser" /> <!-- 글쓰기 버튼 보임 -->
  <hr>
  <AdminPanel :user="guestUser" />  <!-- 버튼 안 보임 -->
  <hr>
  <AdminPanel :user="null" />      <!-- "로그인되지 않았습니다." 보임 -->
</template>
```
</details>
