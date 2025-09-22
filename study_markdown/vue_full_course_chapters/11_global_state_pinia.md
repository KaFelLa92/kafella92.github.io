# 11장: 전역 상태 관리 (Pinia) - 컴포넌트의 벽 허물기

애플리케이션의 규모가 커지면, 여러 컴포넌트가 공유해야 하는 상태(예: 사용자 정보, 테마, 장바구니 등)가 생깁니다. Props drilling이나 provide/inject 없이 이러한 **전역 상태**를 효율적으로 관리하는 방법을 배웁니다. 여기서는 Vue의 공식 상태 관리 라이브러리인 **Pinia**를 사용합니다.

---

## 1. 핵심 개념

- **전역 상태(Global State)**: 여러 컴포넌트가 공통으로 접근하고 수정해야 하는 상태.
- **Pinia**: Vue 3를 위한 직관적이고 타입-세이프한 상태 관리 라이브러리입니다. Vuex의 차세대 버전으로 간주되며, Composition API와 매우 잘 어울립니다. (`npm install pinia` 필요)

- **Pinia의 주요 개념**:
    - **스토어(Store)**: `defineStore` 함수로 정의되는, 상태(state), 게터(getters), 액션(actions)을 포함하는 중앙 집중식 저장소입니다.
    - **`defineStore`**: 스토어를 생성하는 함수입니다. 첫 번째 인자로 스토어의 고유 ID(문자열)를, 두 번째 인자로 옵션 객체나 셋업 함수를 받습니다.
    - **State**: 스토어의 핵심 데이터입니다. `ref`나 `reactive`로 만든 반응형 상태를 반환하는 함수로 정의됩니다.
    - **Getters**: 스토어 상태에 기반한 계산된 값입니다. Vue의 `computed` 속성과 동일하게 동작합니다.
    - **Actions**: 스토어 상태를 변경하는 함수입니다. 비동기 작업을 포함할 수 있습니다. Vue의 `methods`와 유사합니다.

---

## 2. 예제 코드

### 예제 1: Pinia로 간단한 스토어 만들기

사용자의 로그인 상태와 이름을 관리하는 인증 스토어를 만들어봅니다.

```javascript
// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 'auth'는 스토어의 고유 ID입니다.
export const useAuthStore = defineStore('auth', () => {
  // 1. State (ref, reactive)
  const user = ref(null);
  const isLoggedIn = ref(false);

  // 2. Getters (computed)
  const welcomeMessage = computed(() => {
    return user.value ? `환영합니다, ${user.value.name}님!` : '로그인되지 않았습니다.';
  });

  // 3. Actions (function)
  function login(username) {
    user.value = { name: username };
    isLoggedIn.value = true;
  }

  function logout() {
    user.value = null;
    isLoggedIn.value = false;
  }

  // 스토어에서 사용할 상태, 게터, 액션을 반환합니다.
  return { user, isLoggedIn, welcomeMessage, login, logout };
});
```

```javascript
// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Pinia 임포트
import App from './App.vue';

const app = createApp(App);
app.use(createPinia()); // 앱에 Pinia 등록
app.mount('#app');
```

### 예제 2: 컴포넌트에서 스토어 사용하기

서로 다른 컴포넌트에서 `useAuthStore` 훅을 사용하여 상태를 구독하고 액션을 호출합니다.

```vue
<!-- src/App.vue -->
<script setup>
import { useAuthStore } from './stores/auth';

// 컴포넌트 내에서 스토어를 호출하여 인스턴스를 얻습니다.
const authStore = useAuthStore();
</script>

<template>
  <div>
    <!-- 게터 사용 -->
    <h1>{{ authStore.welcomeMessage }}</h1>

    <!-- 상태와 액션 사용 -->
    <div v-if="authStore.isLoggedIn">
      <button @click="authStore.logout">로그아웃</button>
    </div>
    <div v-else>
      <button @click="authStore.login('최동진')">로그인</button>
    </div>
  </div>
</template>
```
**핵심**: `main.js`에서 Pinia를 등록하면, 어떤 컴포넌트에서든 `use...Store()` 함수를 호출하기만 하면 스토어에 접근할 수 있습니다.

---

## 3. 연습 문제

### 문제 1: 장바구니 스토어 만들기
- **요구사항**: 상품을 담고 제거할 수 있는 장바구니 스토어(`useCartStore`)를 만드세요.
- **세부사항**:
    1. `items`라는 이름의 배열 state를 `ref`로 만듭니다. (초기값: `[]`)
    2. `totalItems`라는 이름의 getter를 만들어 `items` 배열의 길이를 반환합니다.
    3. `totalPrice`라는 이름의 getter를 만들어 모든 상품 가격의 합계를 계산합니다.
    4. `addItem` 액션을 만듭니다. 이 액션은 `product` 객체를 인자로 받아 `items` 배열에 추가합니다.
    5. `removeItem` 액션을 만듭니다. 이 액션은 `productId`를 인자로 받아 `items` 배열에서 해당 ID를 가진 상품을 제거합니다.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// src/stores/cart.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);

  const totalItems = computed(() => items.value.length);
  
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price, 0);
  });

  function addItem(product) {
    items.value.push(product);
  }

  function removeItem(productId) {
    items.value = items.value.filter(item => item.id !== productId);
  }

  return { items, totalItems, totalPrice, addItem, removeItem };
});
```
</details>

### 문제 2: 장바구니 UI 만들기
- **요구사항**: 문제 1에서 만든 `useCartStore`를 사용하여 장바구니 UI를 만드세요.
- **세부사항**:
    1. `ProductList` 컴포넌트를 만들어, 몇 개의 가상 상품과 "장바구니에 추가" 버튼을 표시합니다. 이 버튼을 누르면 `addItem` 액션이 호출됩니다.
    2. `Cart` 컴포넌트를 만들어, 현재 장바구니에 담긴 상품 목록(`items`), 총 개수(`totalItems`), 총 가격(`totalPrice`)을 표시합니다.
    3. `Cart` 컴포넌트의 각 상품 옆에 "제거" 버튼을 만들어 `removeItem` 액션을 호출하도록 합니다.

<details>
<summary>문제 2 정답 예시</summary>

```vue
<!-- src/App.vue -->
<script setup>
import { useCartStore } from './stores/cart';

const products = [
  { id: 1, name: '노트북', price: 1200 },
  { id: 2, name: '키보드', price: 100 },
  { id: 3, name: '마우스', price: 50 },
];

const cartStore = useCartStore();
</script>

<template>
  <div>
    <!-- ProductList 부분 -->
    <h2>상품 목록</h2>
    <div v-for="p in products" :key="p.id">
      {{ p.name }} ({{ p.price }}원)
      <button @click="cartStore.addItem(p)">장바구니에 추가</button>
    </div>

    <hr />

    <!-- Cart 부분 -->
    <h2>장바구니</h2>
    <p>총 {{ cartStore.totalItems }}개의 상품 / 총액: {{ cartStore.totalPrice }}원</p>
    <ul>
      <li v-for="item in cartStore.items" :key="item.id">
        {{ item.name }}
        <button @click="cartStore.removeItem(item.id)">제거</button>
      </li>
    </ul>
  </div>
</template>
```
</details>
