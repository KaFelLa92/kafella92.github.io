# 3장: 반응성과 생명주기 - 살아 움직이는 컴포넌트

반응성(Reactivity)은 Vue의 가장 핵심적인 특징입니다. 데이터가 변경되면 화면이 자동으로 업데이트되는 원리를 이해하고, 컴포넌트의 '생명'과도 같은 생명주기 훅을 다루는 방법을 배웁니다.

---

## 1. 핵심 개념

- **반응형 상태(Reactive State)**: Vue는 JavaScript 객체를 프록시(Proxy)하여, 객체의 속성이 변경되는 것을 감지하고 관련 UI를 자동으로 업데이트합니다.

- **`ref`**: 원시 값(primitive value, 예: `String`, `Number`, `Boolean`)을 반응형으로 만들기 위해 사용합니다. `ref`는 `.value` 속성을 가진 객체를 반환하며, 스크립트 내에서는 항상 `.value`로 값에 접근해야 합니다. (템플릿에서는 자동으로 `.value`가 풀려서 바로 사용 가능)
    - `import { ref } from 'vue'`
    - `const count = ref(0);`
    - `console.log(count.value); // 0`
    - `count.value++;`

- **`reactive`**: 객체(Object)나 배열(Array)을 반응형으로 만듭니다. `ref`와 달리, 객체의 속성에 직접 접근하고 변경할 수 있습니다.
    - `import { reactive } from 'vue'`
    - `const state = reactive({ count: 0 });`
    - `state.count++;`

- **생명주기 훅(Lifecycle Hooks)**: 컴포넌트가 생성되고(mount), 업데이트되고(update), 사라지는(unmount) 등 특정 시점에 실행할 코드를 등록할 수 있는 함수들입니다. Composition API에서는 `onMounted`, `onUpdated`, `onUnmounted` 등의 함수를 사용합니다.

---

## 2. 예제 코드

### 예제 1: `ref`로 카운터 만들기

버튼을 클릭하면 숫자가 증가하는 간단한 카운터 예제입니다.

```vue
<!-- src/components/SimpleCounter.vue -->
<script setup>
import { ref } from 'vue';

// 'count'라는 이름의 반응형 상태를 만들고, 초기값은 0으로 설정
const count = ref(0);

// 버튼 클릭 시 count 값을 1 증가시키는 함수
function increment() {
  count.value++;
}
</script>

<template>
  <div>
    <p>현재 카운트: {{ count }}</p>
    <button @click="increment">증가</button>
  </div>
</template>
```

### 예제 2: `onMounted`로 데이터 가져오기

컴포넌트가 처음 렌더링될 때 외부 API에서 데이터를 가져와 반응형 상태에 저장하는 예제입니다.

```vue
<!-- src/components/PostViewer.vue -->
<script setup>
import { ref, onMounted } from 'vue';

const post = ref(null);
const loading = ref(true);

// onMounted 훅은 컴포넌트가 DOM에 마운트된 후 한 번만 실행됩니다.
onMounted(async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    post.value = data; // 가져온 데이터로 post 상태 업데이트
  } catch (error) {
    console.error('데이터를 가져오는 데 실패했습니다:', error);
  } finally {
    loading.value = false; // 로딩 상태 종료
  }
});
</script>

<template>
  <div>
    <h1>게시글 뷰어</h1>
    <p v-if="loading">로딩 중...</p>
    <div v-else>
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>
```

---

## 3. 연습 문제

### 문제 1: 색상 변경기 만들기
- **요구사항**: `ref`를 사용하여 현재 색상 이름을 저장하는 `ColorPicker.vue` 컴포넌트를 만드세요.
- **세부사항**:
    1. "Red", "Green", "Blue" 세 개의 버튼을 만듭니다.
    2. 현재 선택된 색상을 표시하는 `div`를 만듭니다. (예: `<div :style="{ color: currentColor }">현재 색상: {{ currentColor }}</div>`)
    3. 각 버튼을 클릭하면 해당 색상 이름으로 `ref` 상태가 변경되고, `div`의 글자 색도 함께 바뀌어야 합니다.
- **도전과제**: `div`의 글자 색뿐만 아니라 배경색도 함께 변경해보세요.

<details>
<summary>문제 1 정답 예시</summary>

```vue
<script setup>
import { ref } from 'vue';

const color = ref('black');
</script>

<template>
  <div>
    <div :style="{ 
      color: color, 
      backgroundColor: '#f0f0f0', 
      padding: '10px',
      fontSize: '20px'
    }">
      현재 선택된 색상: {{ color }}
    </div>
    <button @click="color = 'red'">Red</button>
    <button @click="color = 'green'">Green</button>
    <button @click="color = 'blue'">Blue</button>
  </div>
</template>
```
</details>

### 문제 2: 마우스 좌표 추적기 만들기
- **요구사항**: `onMounted`와 `onUnmounted`를 사용하여 마우스의 현재 X, Y 좌표를 화면에 표시하는 `MouseTracker.vue` 컴포넌트를 만드세요.
- **세부사항**:
    1. `reactive`를 사용하여 마우스 좌표를 저장할 `position` 상태를 만듭니다. (초기값: `{ x: 0, y: 0 }`)
    2. `onMounted` 훅을 사용하여 컴포넌트가 마운트될 때 `window` 객체에 `mousemove` 이벤트 리스너를 추가합니다.
    3. 이벤트 리스너 콜백 함수에서는 `position` 상태를 업데이트합니다.
    4. **(중요)** `onUnmounted` 훅에서 컴포넌트가 언마운트될 때 `removeEventListener`를 사용하여 이벤트 리스너를 제거해야 합니다. (메모리 누수 방지)
- **도전과제**: 마우스가 움직일 때만 좌표가 업데이트되도록 최적화해보세요. (이미 기본적으로 그렇게 동작합니다. 왜 그런지 생각해보세요.)

<details>
<summary>문제 2 정답 예시</summary>

```vue
<script setup>
import { reactive, onMounted, onUnmounted } from 'vue';

const position = reactive({ x: 0, y: 0 });

const handleMouseMove = (event) => {
  position.x = event.clientX;
  position.y = event.clientY;
};

// 컴포넌트가 마운트될 때 이벤트 리스너 추가
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  console.log('이벤트 리스너가 추가되었습니다.');
});

// 컴포넌트가 언마운트될 때 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  console.log('이벤트 리스너가 제거되었습니다.');
});
</script>

<template>
  <p>
    마우스 좌표: X: {{ position.x }}, Y: {{ position.y }}
  </p>
</template>
```
</details>
