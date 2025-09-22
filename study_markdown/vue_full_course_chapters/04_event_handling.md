# 4장: 이벤트 핸들링 - 사용자와의 상호작용

사용자의 클릭, 입력, 마우스 움직임 등 다양한 행동에 반응하는 방법을 배웁니다. Vue의 `v-on` 디렉티브를 사용하여 DOM 이벤트를 수신하고 JavaScript 코드를 실행할 수 있습니다.

---

## 1. 핵심 개념

- **`v-on` 디렉티브**: DOM 이벤트를 수신하고 특정 JavaScript 코드를 실행하는 데 사용됩니다. 단축 문법으로 `@`를 사용합니다. (예: `v-on:click` -> `@click`)

- **메서드 핸들러**: 이벤트가 발생했을 때 실행할 로직이 복잡할 경우, `<script>` 부분에 함수(메서드)를 정의하고 이벤트 핸들러로 그 이름을 전달할 수 있습니다.

- **인라인 핸들러**: 간단한 로직은 템플릿 내에 직접 작성할 수 있습니다. 이 경우, 특별한 `$event` 변수를 사용하여 원본 DOM 이벤트 객체에 접근할 수 있습니다.

- **이벤트 수식어(Event Modifiers)**: `v-on` 디렉티브는 점(`.`)으로 표시되는 수식어를 지원하여 일반적인 작업을 쉽게 처리할 수 있게 해줍니다.
    - `.prevent`: `event.preventDefault()`를 호출합니다. (예: 폼 제출 시 새로고침 방지)
    - `.stop`: `event.stopPropagation()`을 호출합니다. (이벤트 버블링 방지)
    - `.once`: 이벤트를 한 번만 트리거합니다.
    - `.self`: 이벤트가 해당 엘리먼트 자체에서 발생한 경우에만 핸들러를 트리거합니다. (자식 엘리먼트에서 발생한 이벤트는 무시)

---

## 2. 예제 코드

### 예제 1: 다양한 이벤트 핸들링

클릭, 마우스 오버, 폼 제출 등 다양한 이벤트를 처리하는 방법을 보여줍니다.

```vue
<script setup>
import { ref } from 'vue';

const message = ref('여기에 메시지가 표시됩니다.');

// 버튼 클릭 이벤트 핸들러 (메서드 핸들러)
function handleClick() {
  message.value = '버튼이 클릭되었습니다!';
}

// div에 마우스가 들어왔을 때의 이벤트 핸들러
function handleMouseOver() {
  message.value = '마우스가 위에 있습니다.';
}

// div에서 마우스가 나갔을 때의 이벤트 핸들러
function handleMouseOut() {
  message.value = '마우스가 벗어났습니다.';
}

// form 제출 이벤트 핸들러
function handleSubmit() {
  // .prevent 수식어를 사용하면 event.preventDefault()를 호출할 필요가 없음
  alert('폼이 제출되었습니다.');
}
</script>

<template>
  <div>
    <p>{{ message }}</p>
    
    <!-- 메서드 핸들러 -->
    <button @click="handleClick">클릭하세요</button>
    
    <div 
      @mouseover="handleMouseOver" 
      @mouseout="handleMouseOut"
      style="width: 200px; height: 100px; background-color: lightblue; margin-top: 10px;"
    >
      이곳에 마우스를 올려보세요.
    </div>
    
    <!-- .prevent 수식어 사용 -->
    <form @submit.prevent="handleSubmit" style="margin-top: 10px;">
      <button type="submit">폼 제출</button>
    </form>
  </div>
</template>
```

### 예제 2: 이벤트 핸들러에 인자 전달하기

`map` 안에서 특정 항목에 대한 이벤트를 처리할 때처럼, 이벤트 핸들러에 추가적인 정보를 전달해야 할 때가 있습니다.

```vue
<script setup>
const items = [
  { id: 1, name: '사과' },
  { id: 2, name: '바나나' },
  { id: 3, name: '오렌지' },
];

// item.name을 인자로 받는 이벤트 핸들러
function handleItemClick(itemName) {
  alert(`${itemName}을(를) 선택했습니다.`);
}
</script>

<template>
  <ul>
    <!-- v-for로 리스트를 렌더링하면서 각 항목에 클릭 이벤트 바인딩 -->
    <li 
      v-for="item in items"
      :key="item.id" 
      @click="handleItemClick(item.name)"
      style="cursor: pointer;"
    >
      {{ item.name }}
    </li>
  </ul>
</template>
```

---

## 3. 연습 문제

### 문제 1: 간단한 계산기 만들기
- **요구사항**: 두 개의 `input`과 "더하기", "빼기" 버튼을 가진 간단한 계산기 컴포넌트를 만드세요.
- **세부사항**:
    1. `ref`를 사용하여 두 개의 숫자 입력값(`num1`, `num2`)과 결과(`result`)를 관리합니다.
    2. "더하기" 버튼을 클릭하면 `num1`과 `num2`를 더한 결과가 `result`에 표시됩니다.
    3. "빼기" 버튼을 클릭하면 `num1`에서 `num2`를 뺀 결과가 `result`에 표시됩니다.
- **힌트**: `input`의 `value`는 기본적으로 문자열이므로, 계산 전에 `Number()` 함수로 숫자로 변환해야 합니다. `v-model.number` 수식어를 사용하면 자동으로 숫자로 변환할 수도 있습니다.

<details>
<summary>문제 1 정답 예시</summary>

```vue
<script setup>
import { ref } from 'vue';

const num1 = ref(0);
const num2 = ref(0);
const result = ref(0);

function handleAdd() {
  result.value = Number(num1.value) + Number(num2.value);
}

function handleSubtract() {
  result.value = Number(num1.value) - Number(num2.value);
}
</script>

<template>
  <div>
    <!-- v-model을 사용하여 input과 ref를 양방향으로 바인딩 -->
    <input type="number" v-model="num1" />
    <input type="number" v-model="num2" />
    <br />
    <button @click="handleAdd">더하기</button>
    <button @click="handleSubtract">빼기</button>
    <h2>결과: {{ result }}</h2>
  </div>
</template>
```
</details>

### 문제 2: 배경색 변경기 만들기
- **요구사항**: `div`를 클릭하면 배경색이 랜덤한 색상으로 바뀌는 컴포넌트를 만드세요.
- **세부사항**:
    1. `ref`로 배경색(`backgroundColor`)을 관리합니다.
    2. `div`에 `@click` 이벤트 핸들러를 추가합니다.
    3. 클릭 시, 랜덤한 색상 코드를 생성하여 `backgroundColor` 상태를 업데이트합니다.
- **힌트**: 랜덤 색상 코드는 `Math.random()`과 `toString(16)`을 조합하여 만들 수 있습니다. (예: `'#' + Math.floor(Math.random()*16777215).toString(16)`)

<details>
<summary>문제 2 정답 예시</summary>

```vue
<script setup>
import { ref } from 'vue';

const color = ref('#ffffff');

function changeColor() {
  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  color.value = randomColor;
}
</script>

<template>
  <div 
    @click="changeColor"
    :style="{
      width: '200px',
      height: '200px',
      backgroundColor: color,
      cursor: 'pointer',
      border: '1px solid black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }"
  >
    Click me to change color!
  </div>
</template>
```
</details>
