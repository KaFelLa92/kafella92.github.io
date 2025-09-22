# 8장: 컴포저블과 반응성 심화 - Vue 능력 끌어올리기

Vue 3의 Composition API는 로직을 재사용 가능한 "컴포저블(Composable)" 함수로 쉽게 추출할 수 있게 해줍니다. `computed`, `watch` 등 더 깊이 있는 반응성 API를 통해 복잡한 시나리오를 다루는 방법을 배웁니다.

---

## 1. 핵심 개념

- **컴포저블 (Composable)**: Vue의 Composition API를 활용하여 상태 저장 로직(stateful logic)을 캡슐화하고 재사용하는 함수입니다. 이름이 `use`로 시작하는 관례가 있습니다. (예: `useMouse`, `useFetch`). 컴포저블은 컴포넌트의 재사용성을 극대화하는 강력한 패턴입니다.

- **`computed`**: 종속된 반응형 상태에 기반하여 계산되는 값을 선언적으로 생성합니다. 원본 상태가 변경될 때만 `computed` 속성이 다시 계산되며, 그렇지 않으면 캐시된 결과를 반환합니다. 복잡한 연산을 반복적으로 수행하는 것을 방지하여 성능을 최적화합니다.

- **`watch`**: 특정 반응형 상태의 변경을 감지하고, 변경이 일어났을 때 특정 작업(Side Effect)을 수행합니다.
    - `ref`나 `reactive` 객체, `computed` 속성 등 다양한 데이터 소스를 감시할 수 있습니다.
    - 데이터 변경에 대한 응답으로 비동기 작업이나 비용이 큰 작업을 수행할 때 유용합니다.

- **`provide`와 `inject`**: React의 `Context`와 유사한 기능입니다. 부모 컴포넌트가 자손 컴포넌트들에게 데이터를 제공할 수 있게 해줍니다. 아무리 깊이 중첩되어 있어도 "Props drilling" 없이 데이터를 전달할 수 있습니다. (예: 테마, 언어 설정, 사용자 인증 정보 등)

---

## 2. 예제 코드

### 예제 1: `useMouse` 컴포저블 만들기

마우스 좌표를 추적하는 로직을 재사용 가능한 컴포저블 함수로 추출합니다.

```javascript
// src/composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue';

// 컴포저블 함수는 관례적으로 'use'로 시작합니다.
export function useMouse() {
  // 컴포저블 내부에서 상태를 캡슐화합니다.
  const x = ref(0);
  const y = ref(0);

  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  // 컴포저블은 생명주기 훅도 관리할 수 있습니다.
  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  // 관리하는 상태를 반환하여 컴포넌트에서 사용할 수 있게 합니다.
  return { x, y };
}
```

```vue
<!-- src/components/MouseTracker.vue -->
<script setup>
// 컴포저블을 임포트하여 사용합니다.
import { useMouse } from '../composables/useMouse';

const { x, y } = useMouse();
</script>

<template>
  Mouse position is at: {{ x }}, {{ y }}
</template>
```

### 예제 2: `computed`와 `watch` 사용하기

`computed`로 파생된 상태를 만들고, `watch`로 특정 상태의 변화를 감시합니다.

```vue
<script setup>
import { ref, computed, watch } from 'vue';

const firstName = ref('최');
const lastName = ref('동진');

// computed: firstName이나 lastName이 바뀔 때만 재계산됩니다.
const fullName = computed(() => {
  console.log('Computing full name...');
  return `${firstName.value} ${lastName.value}`;
});

// watch: fullName이 바뀔 때마다 콜백 함수가 실행됩니다.
watch(fullName, (newValue, oldValue) => {
  console.log(`fullName이 변경되었습니다: ${oldValue} -> ${newValue}`);
  // 예: 변경된 이름으로 API 호출 등...
});
</script>

<template>
  <div>
    <input v-model="firstName" placeholder="성" />
    <input v-model="lastName" placeholder="이름" />
    <p>전체 이름: {{ fullName }}</p>
  </div>
</template>
```

---

## 3. 연습 문제

### 문제 1: `useToggle` 컴포저블 만들기
- **요구사항**: `true`/`false` 상태를 토글하는 로직을 가진 `useToggle.js` 컴포저블을 만드세요.
- **세부사항**:
    1. `useToggle` 함수는 초기 상태(boolean)를 인자로 받습니다.
    2. 내부적으로 `ref`를 사용하여 `state`를 관리합니다.
    3. `toggle` 함수를 만들어 `state`의 값을 반전시킵니다.
    4. `state`와 `toggle` 함수를 객체로 반환합니다.
    5. 이 컴포저블을 사용하여, 버튼을 누르면 "ON"/"OFF" 텍스트가 바뀌는 컴포넌트를 만들어보세요.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// src/composables/useToggle.js
import { ref } from 'vue';

export function useToggle(initialValue = false) {
  const state = ref(initialValue);
  const toggle = () => {
    state.value = !state.value;
  };
  return { state, toggle };
}
```

```vue
<!-- src/components/ToggleComponent.vue -->
<script setup>
import { useToggle } from '../composables/useToggle';

const { state: isOn, toggle } = useToggle(false);
</script>

<template>
  <div>
    <button @click="toggle">토글</button>
    <p>상태: {{ isOn ? 'ON' : 'OFF' }}</p>
  </div>
</template>
```
</details>

### 문제 2: `computed`로 장바구니 총액 계산하기
- **요구사항**: 상품 목록이 있고, 각 상품의 수량을 조절할 수 있는 장바구니 컴포넌트를 만드세요.
- **세부사항**:
    1. `reactive`를 사용하여 상품 배열 `items`를 만듭니다. 각 상품은 `name`, `price`, `quantity` 속성을 가집니다.
    2. `computed` 속성 `totalPrice`를 만들어, 모든 상품의 `price * quantity`의 합계를 계산합니다.
    3. 각 상품 옆에 수량을 늘리거나 줄이는 버튼을 만듭니다.
    4. 수량이 변경될 때마다 `totalPrice`가 자동으로 업데이트되는 것을 확인합니다.

<details>
<summary>문제 2 정답 예시</summary>

```vue
<script setup>
import { reactive, computed } from 'vue';

const items = reactive([
  { id: 1, name: '노트북', price: 1000, quantity: 1 },
  { id: 2, name: '키보드', price: 100, quantity: 1 },
  { id: 3, name: '마우스', price: 50, quantity: 2 },
]);

const totalPrice = computed(() => {
  console.log('총액 계산 중...');
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

function increaseQuantity(item) {
  item.quantity++;
}

function decreaseQuantity(item) {
  if (item.quantity > 0) {
    item.quantity--;
  }
}
</script>

<template>
  <div>
    <h2>장바구니</h2>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }} ({{ item.price }}원) - 
        <button @click="decreaseQuantity(item)">-</button>
        {{ item.quantity }}
        <button @click="increaseQuantity(item)">+</button>
      </li>
    </ul>
    <h3>총액: {{ totalPrice }}원</h3>
  </div>
</template>
```
</details>
