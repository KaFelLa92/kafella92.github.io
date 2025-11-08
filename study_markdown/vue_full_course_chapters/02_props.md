# 2장: Props - 컴포넌트에 생명 불어넣기

Props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 통로입니다. Props를 통해 재사용 가능한 동적인 컴포넌트를 만드는 방법을 배웁니다.

---

## 1. 핵심 개념

- **Props (Properties)**: 부모 컴포넌트가 자식 컴포넌트에게 전달하는 데이터 묶음입니다. 자식 컴포넌트는 `defineProps` 매크로를 사용하여 수신할 props를 명시적으로 선언해야 합니다.

- **단방향 데이터 흐름 (One-Way Data Flow)**: 모든 props는 부모와 자식 사이에 하향식 바인딩을 형성합니다. 부모 속성이 업데이트되면 자식으로 전달되지만, 자식 컴포넌트 내에서 props를 직접 변경해서는 안 됩니다. 이는 데이터 흐름을 예측 가능하게 만듭니다.

- **Props 선언**: `<script setup>` 내에서 `defineProps`를 사용하여 props를 선언합니다. 배열이나 객체 형태로 타입을 지정할 수 있습니다.
    - `defineProps(['name', 'age'])`
    - `defineProps({ name: String, age: Number })`

- **Props 유효성 검사**: 객체 형태의 선언을 사용하면 타입, 필수 여부, 기본값 등 더 상세한 유효성 검사를 지정할 수 있습니다.

---

## 2. 예제 코드

### 예제 1: Props로 다양한 데이터 전달하기

문자열 뿐만 아니라 숫자, 배열, 객체 등 모든 JavaScript 값을 props로 전달할 수 있습니다.

```vue
<!-- src/components/UserProfile.vue -->
<script setup>
// defineProps로 수신할 props와 타입을 선언합니다.
const props = defineProps({
  name: String,
  age: Number,
  hobbies: Array
});
</script>

<template>
  <div class="profile-card">
    <h2>{{ name }}</h2>
    <p>나이: {{ age }}세</p>
    <h4>취미:</h4>
    <ul>
      <!-- hobbies 배열을 순회하며 li 태그 생성 -->
      <li v-for="hobby in hobbies" :key="hobby">{{ hobby }}</li>
    </ul>
  </div>
</template>

<style scoped>
.profile-card {
  border: 1px solid #ccc;
  margin: 10px;
  padding: 10px;
}
</style>
```

```vue
<!-- src/App.vue -->
<script setup>
import UserProfile from './components/UserProfile.vue';
import { reactive } from 'vue';

const user1 = reactive({
  name: '최동진',
  age: 30,
  hobbies: ['코딩', '독서', '영화감상']
});
</script>

<template>
  <div>
    <h1>사용자 프로필</h1>
    <!-- v-bind 또는 단축 문법 ':'를 사용하여 props를 전달합니다. -->
    <UserProfile 
      :name="user1.name" 
      :age="user1.age" 
      :hobbies="user1.hobbies" 
    />
    <UserProfile 
      name="Gemini" 
      :age="1" 
      :hobbies="['데이터 분석', '언어 모델링']" 
    />
  </div>
</template>
```

### 예제 2: `<slot>`으로 컨텐츠 전달하기

React의 `children` prop과 유사하게, Vue는 `<slot>` 엘리먼트를 사용하여 부모로부터 컨텐츠를 전달받습니다. 이는 재사용 가능한 레이아웃 컴포넌트를 만들 때 매우 유용합니다.

```vue
<!-- src/components/Card.vue -->
<template>
  <div class="card">
    <!-- 부모 컴포넌트가 Card 태그 사이에 넣은 컨텐츠가 여기에 렌더링됩니다. -->
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  margin: 20px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  border-radius: 10px;
  background-color: white;
}
</style>
```

```vue
<!-- src/App.vue -->
<script setup>
import Card from './components/Card.vue';
import UserProfile from './components/UserProfile.vue';
</script>

<template>
  <div>
    <Card>
      <!-- 이 부분이 Card 컴포넌트의 <slot>으로 전달됩니다. -->
      <h2>첫 번째 카드</h2>
      <p>Card 컴포넌트는 다른 컴포넌트나 엘리먼트를 감쌀 수 있습니다.</p>
    </Card>
    
    <Card>
      <UserProfile 
        name="최동진" 
        :age="30" 
        :hobbies="['코딩', '독서']" 
      />
    </Card>
  </div>
</template>
```

---

## 3. 연습 문제

### 문제 1: `Article` 컴포넌트 만들기
- **요구사항**: 블로그 게시글을 표시하는 `Article.vue` 컴포넌트를 만드세요.
- **세부사항**:
    1. `title`(제목), `author`(작성자), `content`(내용)를 props로 받도록 `defineProps`를 설정합니다.
    2. `<h2>`로 제목을, `<h4>`로 "작성자: [author]"를, `<p>`로 내용을 표시합니다.
- **도전과제**: `App.vue`에서 `Article` 컴포넌트를 사용하여 2개 이상의 다른 게시글을 렌더링해보세요.

<details>
<summary>문제 1 정답 예시</summary>

```vue
<!-- src/components/Article.vue -->
<script setup>
defineProps({
  title: String,
  author: String,
  content: String
});
</script>

<template>
  <article>
    <h2>{{ title }}</h2>
    <h4>작성자: {{ author }}</h4>
    <p>{{ content }}</p>
  </article>
</template>
```

```vue
<!-- src/App.vue -->
<script setup>
import Article from './components/Article.vue';
</script>

<template>
  <div>
    <h1>My Blog</h1>
    <Article 
      title="Vue Props 완전 정복"
      author="최동진"
      content="Props는 컴포넌트 간 데이터 전달의 핵심입니다..."
    />
    <hr />
    <Article 
      title="컴포넌트 재사용성 높이기"
      author="Gemini"
      content="Props를 활용하면 컴포넌트를 다양한 상황에서 재사용할 수 있습니다."
    />
  </div>
</template>
```
</details>

### 문제 2: `ImageCard` 컴포넌트 만들기
- **요구사항**: 이미지와 설명을 함께 보여주는 `ImageCard.vue` 컴포넌트를 만드세요.
- **세부사항**:
    1. `imageUrl`(이미지 주소)과 `caption`(설명)을 props로 받도록 `defineProps`를 설정합니다.
    2. `<img>` 태그로 이미지를 표시하고, 그 아래 `<p>` 태그로 설명을 표시합니다.
- **도전과제**: `App.vue`에서 `ImageCard` 컴포넌트를 사용하여 좋아하는 이미지 2개 이상을 화면에 띄워보세요. (이미지 주소는 인터넷에서 검색하여 사용할 수 있습니다.)

<details>
<summary>문제 2 정답 예시</summary>

```vue
<!-- src/components/ImageCard.vue -->
<script setup>
defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: '이미지 설명이 없습니다.'
  }
});
</script>

<template>
  <figure>
    <img :src="imageUrl" :alt="caption" width="300" />
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>
```

```vue
<!-- src/App.vue -->
<script setup>
import ImageCard from './components/ImageCard.vue';
</script>

<template>
  <div>
    <h1>Image Gallery</h1>
    <ImageCard 
      image-url="https://via.placeholder.com/300x200.png?text=Vue"
      caption="Vue 로고"
    />
    <ImageCard 
      image-url="https://via.placeholder.com/300x200.png?text=JavaScript"
      caption="JavaScript 로고"
    />
  </div>
</template>
```
</details>
