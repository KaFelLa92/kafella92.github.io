# 7장: 폼과 `v-model` - 사용자의 입력 받기

사용자로부터 텍스트, 선택, 파일 등 다양한 입력을 받기 위한 폼(Form)을 다루는 방법을 배웁니다. Vue에서는 `v-model` 디렉티브를 사용하여 폼 입력과 상태를 매우 쉽게 양방향으로 바인딩할 수 있습니다.

---

## 1. 핵심 개념

- **`v-model`**: 폼 `<input>`, `<textarea>`, `<select>` 엘리먼트에 대한 양방향 데이터 바인딩을 생성하는 디렉티브입니다.
    - 사용자의 입력을 자동으로 감지하여 JavaScript 상태를 업데이트하고, 반대로 JavaScript 상태가 변경되면 폼 엘리먼트의 값을 업데이트합니다.
    - `v-model`은 내부적으로 `v-bind:value`와 `v-on:input` (또는 다른 이벤트)의 조합으로 동작하는 문법 설탕입니다.

- **다양한 입력 타입과 `v-model`**:
    - **텍스트 (`text`, `textarea`)**: `value` 속성과 `input` 이벤트를 사용합니다.
    - **체크박스 (`checkbox`), 라디오 버튼 (`radio`)**: `checked` 속성과 `change` 이벤트를 사용합니다.
    - **선택 (`select`)**: `value` 속성과 `change` 이벤트를 사용합니다.

- **`v-model` 수식어(Modifiers)**:
    - **`.lazy`**: `input` 이벤트 대신 `change` 이벤트 후에 상태를 동기화합니다. (사용자가 입력을 마친 후)
    - **`.number`**: 사용자 입력이 자동으로 숫자로 형변환되도록 합니다.
    - **`.trim`**: 사용자 입력의 앞뒤 공백을 자동으로 제거합니다.

---

## 2. 예제 코드

### 예제 1: 단일 `input` 제어하기

가장 기본적인 `v-model` 사용 예제입니다.

```vue
<script setup>
import { ref } from 'vue';

// 'name' ref로 input 값을 양방향 바인딩
const name = ref('');

function handleSubmit() {
  alert('제출된 이름: ' + name.value);
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label>
      이름:
      <!-- v-model이 name ref와 input을 연결합니다. -->
      <input type="text" v-model="name" />
    </label>
    <button type="submit">제출</button>
    <p>현재 ref 값: {{ name }}</p>
  </form>
</template>
```

### 예제 2: 여러 타입의 `input` 제어하기

텍스트, 체크박스, 라디오, 셀렉트 등 다양한 폼 엘리먼트를 `v-model`로 다룹니다.

```vue
<script setup>
import { reactive } from 'vue';

const formData = reactive({
  guestName: '',
  numberOfGuests: 2,
  isGoing: true,
  mealPreference: 'vegan'
});

function handleSubmit() {
  alert(JSON.stringify(formData, null, 2));
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- 텍스트 input -->
    <label>이름: <input v-model="formData.guestName" /></label>
    <br />
    
    <!-- 숫자 input (v-model.number) -->
    <label>손님 수: <input type="number" v-model.number="formData.numberOfGuests" /></label>
    <br />
    
    <!-- 체크박스 -->
    <label>참석 여부: <input type="checkbox" v-model="formData.isGoing" /></label>
    <br />

    <!-- 라디오 버튼 -->
    <p>식사 선택:</p>
    <label><input type="radio" value="vegan" v-model="formData.mealPreference" /> 비건</label>
    <label><input type="radio" value="non-vegan" v-model="formData.mealPreference" /> 일반</label>
    <br />

    <button type="submit">예약 제출</button>
  </form>
</template>
```

---

## 3. 연습 문제

### 문제 1: 회원가입 폼 만들기
- **요구사항**: 이메일과 비밀번호를 입력받는 회원가입 폼을 만드세요.
- **세부사항**:
    1. `email`과 `password`를 위한 `ref` 상태를 각각 만듭니다.
    2. 각 `input`에 `v-model`을 사용하여 상태와 바인딩합니다.
    3. "가입하기" 버튼을 누르면(폼 제출), `alert`로 "이메일: [email], 비밀번호: [password]" 형식의 메시지를 띄웁니다.
- **도전과제**: 비밀번호 `input`의 `type`을 `password`로 설정하여 입력 내용이 보이지 않게 하고, 비밀번호가 8자 미만일 경우 제출 버튼을 비활성화하는 로직을 추가해보세요. (`:disabled` 속성 바인딩 사용)

<details>
<summary>문제 1 정답 예시</summary>

```vue
<script setup>
import { ref, computed } from 'vue';

const email = ref('');
const password = ref('');

function handleSubmit() {
  alert(`가입 시도 => 이메일: ${email.value}, 비밀번호: ${password.value}`);
}

// 도전과제: 비밀번호 길이에 따른 제출 버튼 활성화 여부
const isSubmitDisabled = computed(() => password.value.length < 8);
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label>
      이메일:
      <input type="email" v-model="email" />
    </label>
    <br />
    <label>
      비밀번호:
      <input type="password" v-model="password" />
    </label>
    <!-- 도전과제: 비밀번호가 8자 미만일 때 경고 메시지 표시 -->
    <p v-if="password.length > 0 && password.length < 8" style="color: red;">
      비밀번호는 8자 이상이어야 합니다.
    </p>
    <br />
    <button type="submit" :disabled="isSubmitDisabled">가입하기</button>
  </form>
</template>
```
</details>

### 문제 2: 선호도 조사 폼 만들기
- **요구사항**: `<select>`와 `<textarea>`를 사용하여 사용자의 선호 과일과 그 이유를 입력받는 폼을 만드세요.
- **세부사항**:
    1. `favoriteFruit`와 `reason`을 위한 `ref` 상태를 만듭니다.
    2. `<select>` 태그로 "사과", "바나나", "오렌지" 중 하나를 선택할 수 있게 합니다.
    3. `<textarea>` 태그로 그 과일을 좋아하는 이유를 입력받습니다.
    4. 두 폼 엘리먼트 모두 `v-model`로 상태와 바인딩합니다.
    5. 제출 시, "선택한 과일: [fruit], 이유: [reason]" 형식의 메시지를 `alert`로 보여줍니다.

<details>
<summary>문제 2 정답 예시</summary>

```vue
<script setup>
import { ref } from 'vue';

const favoriteFruit = ref('사과'); // select의 초기 선택값
const reason = ref('');

function handleSubmit() {
  alert(`선택한 과일: ${favoriteFruit.value}, 이유: ${reason.value}`);
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label>
      가장 좋아하는 과일은?
      <select v-model="favoriteFruit">
        <option value="사과">사과</option>
        <option value="바나나">바나나</option>
        <option value="오렌지">오렌지</option>
      </select>
    </label>
    <br />
    <label>
      이유를 적어주세요:
      <br />
      <textarea v-model="reason" />
    </label>
    <br />
    <button type="submit">제출</button>
  </form>
</template>
```
</details>
