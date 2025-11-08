# 9장: 스타일링 - 컴포넌트에 옷 입히기

Vue 컴포넌트의 스타일을 꾸미는 다양한 방법을 배웁니다. 컴포넌트 스코프를 보장하는 `<style scoped>`, 동적 스타일링을 위한 `v-bind`, 그리고 전역 스타일 관리까지 알아봅니다.

---

## 1. 핵심 개념

1.  **`<style scoped>`**:
    - 싱글 파일 컴포넌트(SFC)의 가장 큰 장점 중 하나입니다. `<style>` 태그에 `scoped` 속성을 추가하면, 해당 스타일은 **현재 컴포넌트의 엘리먼트에만 적용**됩니다.
    - Vue는 빌드 시점에 각 엘리먼트에 고유한 데이터 속성(예: `data-v-f3f3eg9`)을 추가하고, CSS 셀렉터를 `h1[data-v-f3f3eg9]`와 같이 변환하여 스타일 충돌을 방지합니다.

2.  **전역 스타일**:
    - `scoped`를 사용하지 않은 `<style>` 블록은 전역 스타일로 적용됩니다. 애플리케이션 전체에 일관된 스타일(예: 기본 폰트, 레이아웃 리셋)을 정의할 때 유용합니다. 보통 `App.vue`나 별도의 CSS 파일에서 관리합니다.

3.  **CSS Modules**:
    - `<style module>`을 사용하여 CSS 파일을 모듈로 가져올 수 있습니다. 클래스 이름이 고유한 해시값으로 변환되어 객체 형태로 주입됩니다. JavaScript 내에서 클래스 이름을 동적으로 다룰 때 유용합니다.

4.  **State-Driven Dynamic Styles (v-bind in CSS)**:
    - Vue 3.2+ 부터 `<style>` 블록 안에서 `v-bind()` 함수를 사용하여 JavaScript 상태(ref, reactive, props 등)를 CSS 값에 직접 바인딩할 수 있습니다. 매우 직관적이고 강력한 동적 스타일링 기법입니다.

---

## 2. 예제 코드

### 예제 1: `<style scoped>`와 전역 스타일

`Button.vue`는 자신만의 스코프 스타일을 가지고, `App.vue`는 전역 스타일을 정의합니다.

```vue
<!-- src/components/Button.vue -->
<template>
  <button class="button">나는 스코프 버튼</button>
</template>

<style scoped>
/* 이 스타일은 Button.vue 컴포넌트 내의 .button 클래스에만 적용됩니다. */
.button {
  background-color: #42b883; /* Vue 색상 */
  color: white;
  border: none;
  padding: 10px;
}
</style>
```

```vue
<!-- src/App.vue -->
<script setup>
import MyButton from './components/Button.vue';
</script>

<template>
  <div>
    <p class="global-text">이 텍스트는 전역 스타일의 영향을 받습니다.</p>
    <MyButton />
    <button class="button">나는 일반 버튼</button>
  </div>
</template>

<style>
/* scoped가 없으므로 전역 스타일로 적용됩니다. */
/* App.vue의 .button과 MyButton의 .button 모두에 영향을 주려 하지만,
   scoped로 인해 MyButton에는 적용되지 않습니다. */
.button {
  background-color: #ccc;
  padding: 5px;
}

.global-text {
  font-style: italic;
}
</style>
```

### 예제 2: `v-bind`를 사용한 동적 스타일링

JavaScript 상태를 CSS에 직접 바인딩하여 동적으로 색상을 변경합니다.

```vue
<script setup>
import { ref } from 'vue';

const textColor = ref('red');
</script>

<template>
  <p>이 텍스트의 색상은 아래 버튼으로 바꿀 수 있습니다.</p>
  <button @click="textColor = 'green'">Green</button>
  <button @click="textColor = 'blue'">Blue</button>
</template>

<style scoped>
p {
  /* <script setup>의 textColor 상태를 CSS color 속성에 바인딩 */
  color: v-bind(textColor);
  font-weight: bold;
  transition: color 0.3s;
}
</style>
```

---

## 3. 연습 문제

### 문제 1: 클래스 바인딩으로 경고 메시지 만들기
- **요구사항**: `Alert.vue` 컴포넌트를 만들어, `type` prop에 따라 다른 스타일의 경고 메시지를 보여주세요.
- **세부사항**:
    1. `type`('success' 또는 'error')과 `message`를 props로 받습니다.
    2. `<style scoped>` 안에 `.alert`, `.success`, `.error` 세 개의 클래스를 정의합니다.
    3. `type`이 'success'이면 배경은 연한 녹색, 글자는 진한 녹색으로 설정합니다.
    4. `type`이 'error'이면 배경은 연한 빨간색, 글자는 진한 빨간색으로 설정합니다.
    5. `:class` 바인딩을 사용하여 `type` prop 값에 따라 `.success` 또는 `.error` 클래스를 동적으로 적용합니다.

<details>
<summary>문제 1 정답 예시</summary>

```vue
<!-- src/components/Alert.vue -->
<script setup>
defineProps({
  type: String,
  message: String
});
</script>

<template>
  <!-- 
    :class에 객체를 전달하여 조건부로 클래스를 적용합니다.
    'alert' 클래스는 항상 적용되고,
    type이 'success'이면 'success' 클래스가, 'error'이면 'error' 클래스가 추가됩니다.
  -->
  <div :class="{ alert: true, success: type === 'success', error: type === 'error' }">
    {{ message }}
  </div>
</template>

<style scoped>
.alert {
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid;
}
.success {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}
.error {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}
</style>
```
</details>

### 문제 2: `v-bind`로 프로그레스 바 만들기
- **요구사항**: `ProgressBar.vue` 컴포넌트를 만들어, `progress` prop(0~100)에 따라 너비가 변하는 프로그레스 바를 구현하세요.
- **세부사항**:
    1. `progress`라는 숫자 타입의 prop을 받습니다.
    2. `v-bind`를 사용하여 `progress` prop 값을 내부 바(bar)의 `width` 스타일에 연결합니다.
    3. `progress` prop 값에 '%' 단위를 붙여서 `width`를 설정해야 합니다. (힌트: 템플릿 리터럴을 사용)

<details>
<summary>문제 2 정답 예시</summary>

```vue
<!-- src/components/ProgressBar.vue -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100,
  }
});

// v-bind에 복잡한 표현식을 사용하기 위해 computed 속성을 활용할 수 있습니다.
const barWidth = computed(() => `${props.progress}%`);
</script>

<template>
  <div class="progress-container">
    <div class="progress-bar"></div>
  </div>
</template>

<style scoped>
.progress-container {
  width: 100%;
  height: 20px;
  background-color: #eee;
  border-radius: 10px;
}
.progress-bar {
  height: 100%;
  background-color: #42b883;
  border-radius: 10px;
  /* computed 속성인 barWidth를 width에 바인딩합니다. */
  width: v-bind(barWidth);
  transition: width 0.5s ease;
}
</style>
```
</details>
