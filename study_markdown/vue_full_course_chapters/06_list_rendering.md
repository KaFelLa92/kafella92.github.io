# 6장: 리스트 렌더링 - 동적인 목록 만들기

배열 데이터를 UI에 동적으로 렌더링하는 방법을 배웁니다. Vue가 리스트의 변경 사항을 효율적으로 추적하고 업데이트하는 데 필요한 `key` 속성의 중요성을 이해합니다.

---

## 1. 핵심 개념

- **`v-for` 디렉티브**: 배열이나 객체를 기반으로 엘리먼트 또는 템플릿 블록을 여러 번 렌더링하는 데 사용됩니다.
    - 문법: `item in items` 형식. `items`는 원본 데이터 배열이고 `item`은 배열에서 반복되고 있는 현재 요소의 별칭입니다.
    - `v-for`는 `(item, index) in items` 형태로 두 번째 인자인 `index`도 받을 수 있습니다.

- **`key`**: `v-for`를 사용할 때 반드시 제공해야 하는 특별한 속성입니다.
    - **왜 필요한가?**: Vue는 `key`를 사용하여 각 노드의 ID를 추적하고, 리스트가 변경될 때 기존 엘리먼트를 재사용하고 재정렬할지 여부를 결정합니다. `key`가 없으면 Vue는 리스트를 효율적으로 업데이트하기 어렵습니다.
    - **좋은 Key의 조건**:
        1.  **고유성**: 형제 노드 사이에서 유일해야 합니다.
        2.  **안정성**: 리렌더링 되더라도 변하지 않아야 합니다. 항목의 순서가 바뀌어도 해당 항목의 `key`는 그대로 유지되어야 합니다.
    - **무엇을 Key로 사용해야 하는가?**: 데이터에 포함된 고유 ID(예: 데이터베이스의 `id`, `uuid`)를 사용하는 것이 가장 좋습니다.
    - **최후의 수단, `index`**: 마땅한 `key`가 없을 때 `index`를 `key`로 사용할 수 있지만, **권장하지 않습니다**. 리스트의 순서가 바뀌거나 항목이 추가/삭제될 때 `key`가 불안정해져 성능 저하와 예기치 않은 버그(특히 폼 입력과 관련된)를 유발할 수 있습니다.

---

## 2. 예제 코드

### 예제 1: 간단한 숫자 리스트 렌더링

`v-for`를 사용하여 숫자 배열을 `<li>` 엘리먼트 배열로 변환합니다.

```vue
<script setup>
import { ref } from 'vue';

const numbers = ref([1, 2, 3, 4, 5]);
</script>

<template>
  <ul>
    <!-- 
      v-for로 numbers 배열을 순회합니다.
      각 li 엘리먼트에 고유한 key를 부여합니다.
      이 경우 number 자체가 고유하므로 key로 사용할 수 있습니다.
    -->
    <li v-for="number in numbers" :key="number">
      {{ number }}
    </li>
  </ul>
</template>
```

### 예제 2: 객체 배열과 컴포넌트 렌더링

데이터가 객체 배열일 경우, 각 객체를 컴포넌트에 prop으로 전달하여 렌더링하는 것이 일반적입니다.

```vue
<!-- src/components/TodoItem.vue -->
<script setup>
defineProps({
  todo: Object
});
</script>

<template>
  <li :class="{ completed: todo.completed }">
    {{ todo.text }}
  </li>
</template>

<style scoped>
.completed {
  text-decoration: line-through;
  color: #aaa;
}
</style>
```

```vue
<!-- src/components/TodoList.vue -->
<script setup>
import { reactive } from 'vue';
import TodoItem from './TodoItem.vue';

const todos = reactive([
  { id: 'a1', text: 'Vue 공부하기', completed: true },
  { id: 'b2', text: '운동하기', completed: false },
  { id: 'c3', text: '저녁 장보기', completed: false },
]);
</script>

<template>
  <div>
    <h1>오늘의 할 일</h1>
    <ul>
      <!-- 
        v-for로 컴포넌트를 렌더링합니다.
        데이터의 고유 ID인 todo.id를 key로 사용합니다.
        todo 객체 전체를 props로 전달합니다.
      -->
      <TodoItem 
        v-for="item in todos" 
        :key="item.id" 
        :todo="item" 
      />
    </ul>
  </div>
</template>
```

---

## 3. 연습 문제

### 문제 1: `FruitList` 컴포넌트 만들기
- **요구사항**: 과일 이름 배열을 받아 `<ul>` 리스트로 렌더링하는 `FruitList.vue` 컴포넌트를 만드세요.
- **세부사항**:
    1. `const fruits = ['사과', '바나나', '오렌지', '딸기', '포도'];` 배열을 사용합니다.
    2. `v-for` 디렉티브를 사용하여 각 과일 이름을 `<li>` 태그로 렌더링합니다.
    3. **(중요)** `:key` 속성을 적절히 설정하세요. 이 경우, 과일 이름이 중복되지 않는다고 가정하고 이름 자체를 `key`로 사용할 수 있습니다.
- **도전과제**: `index`를 `key`로 사용했을 때와 과일 이름을 `key`로 사용했을 때 어떤 차이가 있을지 생각해보세요. (만약 리스트의 순서가 바뀐다면?)

<details>
<summary>문제 1 정답 예시</summary>

```vue
<script setup>
import { ref } from 'vue';

const fruits = ref(['사과', '바나나', '오렌지', '딸기', '포도']);
</script>

<template>
  <div>
    <h2>과일 목록</h2>
    <ul>
      <!-- 이 예제에서는 fruit 이름이 고유하므로 key로 사용 가능합니다. -->
      <!-- index를 key로 사용하는 것은 피하는 것이 좋습니다: <li v-for="(fruit, index) in fruits" :key="index">{{ fruit }}</li> -->
      <li v-for="fruit in fruits" :key="fruit">
        {{ fruit }}
      </li>
    </ul>
  </div>
</template>
```
</details>

### 문제 2: `UserList` 컴포넌트 만들기
- **요구사항**: 사용자 정보가 담긴 객체 배열을 받아, 각 사용자의 이름과 이메일을 리스트로 보여주는 `UserList.vue` 컴포넌트를 만드세요.
- **세부사항**:
    1. 아래의 `users` 배열을 사용합니다.
        ```javascript
        const users = [
          { id: 101, name: '최동진', email: 'kafella@example.com' },
          { id: 102, name: 'Gemini', email: 'gemini@example.com' },
          { id: 103, name: 'Vue', email: 'vue@example.com' },
        ];
        ```
    2. `v-for`를 사용하여 각 `user` 객체를 `<li>` 엘리먼트로 변환합니다.
    3. 각 `<li>` 안에는 "이름: [name], 이메일: [email]" 형식의 텍스트가 포함되어야 합니다.
    4. 각 `<li>`의 `:key`로는 `user.id`를 사용하세요.
- **도전과제**: 각 리스트 항목을 별도의 `User.vue` 컴포넌트로 분리하고, `UserList.vue`에서는 `User` 컴포넌트를 `v-for`로 렌더링하도록 구조를 변경해보세요.

<details>
<summary>문제 2 정답 예시</summary>

```vue
<!-- src/components/User.vue -->
<script setup>
defineProps({
  user: Object
});
</script>

<template>
  <li>
    이름: {{ user.name }}, 이메일: {{ user.email }}
  </li>
</template>
```

```vue
<!-- src/components/UserList.vue -->
<script setup>
import { reactive } from 'vue';
import User from './User.vue';

const users = reactive([
  { id: 101, name: '최동진', email: 'kafella@example.com' },
  { id: 102, name: 'Gemini', email: 'gemini@example.com' },
  { id: 103, name: 'Vue', email: 'vue@example.com' },
]);
</script>

<template>
  <div>
    <h2>사용자 목록</h2>
    <ul>
      <User v-for="user in users" :key="user.id" :user="user" />
    </ul>
  </div>
</template>
```
</details>
