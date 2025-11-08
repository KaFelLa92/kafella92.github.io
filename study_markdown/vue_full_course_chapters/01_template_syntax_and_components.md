# 1장: 템플릿과 컴포넌트 - Vue.js의 첫인상

Vue 개발의 가장 기본이 되는 두 가지 개념, 템플릿 문법과 컴포넌트에 대해 배웁니다. UI를 레고 블록처럼 조립 가능한 부품으로 만드는 방법을 이해합니다.

---

## 1. 핵심 개념

- **컴포넌트(Component)**: Vue는 UI를 "싱글 파일 컴포넌트(Single File Component, SFC)"라는 독립적이고 재사용 가능한 `.vue` 파일 단위로 나누어 관리합니다. 각 컴포넌트는 자신만의 구조(HTML), 로직(JavaScript), 스타일(CSS)을 하나의 파일 안에 가집니다.

- **템플릿 문법 (Template Syntax)**: Vue는 렌더링될 DOM을 선언적으로 설명하기 위해 HTML 기반의 템플릿 문법을 사용합니다. 데이터 바인딩, 디렉티브 등 강력한 기능을 제공합니다.

- **`<script setup>`**: Vue 3의 Composition API를 SFC에서 더 간결하게 사용하기 위한 문법 설탕(syntactic sugar)입니다. `<script setup>` 블록 안에 작성된 코드는 컴포넌트가 생성될 때마다 실행되며, 여기에 선언된 변수나 함수는 템플릿에서 바로 사용할 수 있습니다.

## 2. 템플릿의 주요 규칙

1.  **데이터 바인딩**: 가장 기본적인 데이터 바인딩은 "Mustache" 문법(이중 중괄호)을 사용합니다: `{{ message }}`.
2.  **디렉티브(Directives)**: `v-` 접두사가 붙는 특별한 속성입니다. Vue가 렌더링된 DOM에 특정 동작을 적용하도록 지시합니다. (예: `v-if`, `v-for`, `v-bind`, `v-on`)
3.  **속성 바인딩**: HTML 속성에 동적인 값을 바인딩할 때는 `v-bind` 디렉티브를 사용합니다. 단축 문법으로 콜론(`:`)을 사용합니다. (예: `v-bind:href="url"` 또는 `:href="url"`)
4.  **이벤트 리스닝**: DOM 이벤트를 수신할 때는 `v-on` 디렉티브를 사용합니다. 단축 문법으로 골뱅이(`@`)를 사용합니다. (예: `v-on:click="doSomething"` 또는 `@click="doSomething"`)

---

## 3. 예제 코드

### 예제 1: 기본 컴포넌트 만들기

가장 기본적인 형태의 싱글 파일 컴포넌트입니다.

```vue
<!-- src/components/WelcomeMessage.vue -->

<script setup>
// <script setup> 블록 안에 로직을 작성합니다.
import { ref } from 'vue';

// ref()를 사용하여 반응형 데이터를 생성합니다.
const message = ref('Hello, Vue.js World!');
</script>

<template>
  <!-- <template> 블록 안에 UI 구조를 정의합니다. -->
  <h1>{{ message }}</h1>
</template>

<style scoped>
/* <style scoped> 블록은 이 컴포넌트 내에서만 적용되는 스타일을 정의합니다. */
h1 {
  color: #42b883; /* Vue.js의 상징색 */
}
</style>
```

### 예제 2: 여러 컴포넌트 조립하기

작은 컴포넌트들을 조립하여 더 큰 컴포넌트나 페이지를 만듭니다.

```vue
<!-- src/App.vue -->
<script setup>
import WelcomeMessage from './components/WelcomeMessage.vue';
import MyProfile from './components/MyProfile.vue'; // 추가
</script>

<template>
  <div>
    <WelcomeMessage />
    <MyProfile />
  </div>
</template>
```

---

## 4. 연습 문제

### 문제 1: `Header` 컴포넌트 만들기
- **요구사항**: 웹사이트의 헤더 부분을 담당하는 `Header.vue` 컴포넌트를 만드세요.
- **세부사항**:
    1. `<h1>` 태그로 사이트 로고(예: "My Awesome Vue Site")를 표시합니다.
    2. `<nav>` 태그 안에 `<ul>`과 `<li>`를 사용하여 "Home", "About", "Contact" 라는 세 개의 메뉴 항목을 만듭니다.
- **도전과제**: `App.vue`에서 이 `Header` 컴포넌트를 화면에 렌더링해보세요.

<details>
<summary>문제 1 정답 예시</summary>

```vue
<!-- src/components/Header.vue -->
<template>
  <header>
    <h1>My Awesome Vue Site</h1>
    <nav>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
header {
  background-color: #f2f2f2;
  padding: 20px;
  text-align: center;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
```

```vue
<!-- src/App.vue -->
<script setup>
import Header from './components/Header.vue';
</script>

<template>
  <Header />
  <!-- 다른 컨텐츠 -->
</template>
```
</details>

### 문제 2: `Footer` 컴포넌트 만들기
- **요구사항**: 웹사이트의 푸터 부분을 담당하는 `Footer.vue` 컴포넌트를 만드세요.
- **세부사항**:
    1. `<p>` 태그를 사용하여 저작권 정보를 표시합니다. (예: "© 2024 My Awesome Vue Site. All rights reserved.")
    2. 소셜 미디어 링크를 담을 `div`를 만들고, 그 안에 "Facebook", "Twitter", "Instagram" 텍스트를 넣습니다.
- **도전과제**: `App.vue`에서 `Header` 컴포넌트 아래에 `Footer` 컴포넌트를 렌더링해보세요.

<details>
<summary>문제 2 정답 예시</summary>

```vue
<!-- src/components/Footer.vue -->
<template>
  <footer>
    <p>© 2024 My Awesome Vue Site. All rights reserved.</p>
    <div>
      <span>Facebook</span> | 
      <span>Twitter</span> | 
      <span>Instagram</span>
    </div>
  </footer>
</template>

<style scoped>
footer {
  border-top: 1px solid #ccc;
  margin-top: 20px;
  padding: 20px;
  text-align: center;
}
</style>
```

```vue
<!-- src/App.vue -->
<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <Header />
  <main>
    <p>여기는 메인 컨텐츠입니다.</p>
  </main>
  <Footer />
</template>
```
</details>
