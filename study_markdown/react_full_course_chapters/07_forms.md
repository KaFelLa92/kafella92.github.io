# 7장: 폼 다루기 - 사용자의 입력 받기

사용자로부터 텍스트, 선택, 파일 등 다양한 입력을 받기 위한 폼(Form)을 다루는 방법을 배웁니다. React에서는 폼 엘리먼트의 값을 컴포넌트의 state로 관리하는 **제어 컴포넌트(Controlled Component)** 방식을 권장합니다.

---

## 1. 핵심 개념

- **제어 컴포넌트(Controlled Component)**:
    - 폼 데이터(예: `<input>`의 값)를 React 컴포넌트의 `state`를 통해 관리하는 방식입니다.
    - 사용자가 입력할 때마다 `state`가 업데이트되고, 이 `state` 값이 다시 폼 엘리먼트의 `value`로 전달됩니다.
    - 데이터의 흐름이 단방향(state -> UI, UI event -> state update)으로 명확해져서, 입력 값에 대한 검증, 조작, 다른 UI 요소와의 연동이 쉬워집니다.

- **제어 컴포넌트 구현의 2가지 핵심 요소**:
    1.  **`value` prop**: 폼 엘리먼트가 보여줄 값을 React `state`와 연결합니다. (`<input value={this.state.value} />`)
    2.  **`onChange` prop**: 사용자가 폼 엘리먼트의 값을 변경할 때마다 호출될 이벤트 핸들러를 연결합니다. 이 핸들러 안에서 `setState`를 호출하여 `state`를 업데이트합니다. (`<input onChange={this.handleChange} />`)

---

## 2. 예제 코드

### 예제 1: 단일 `input` 제어하기

가장 기본적인 제어 컴포넌트 예제입니다.

```javascript
import React, { useState } from 'react';

function NameForm() {
  // 'name' state로 input 값을 제어
  const [name, setName] = useState('');

  // input 값이 변경될 때마다 호출되어 state를 업데이트
  const handleChange = (event) => {
    setName(event.target.value.toUpperCase()); // 입력값을 대문자로 변경하는 등 조작이 가능
  };

  // 폼 제출 시 호출
  const handleSubmit = (event) => {
    event.preventDefault(); // 기본 동작(페이지 새로고침) 방지
    alert('제출된 이름: ' + name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        이름:
        {/* input의 value를 state와 연결, onChange로 핸들러 연결 */}
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <button type="submit">제출</button>
      <p>현재 state 값: {name}</p>
    </form>
  );
}
```

### 예제 2: 여러 `input` 제어하기

여러 개의 폼 엘리먼트를 다룰 때는 각 `input`에 `name` 속성을 부여하고, 이벤트 핸들러에서 이를 활용하여 하나의 핸들러로 여러 `input`의 `state`를 관리할 수 있습니다.

```javascript
import React, { useState } from 'react';

function Reservation() {
  const [formData, setFormData] = useState({
    guestName: '',
    numberOfGuests: 2,
    isGoing: true,
  });

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name; // input의 name 속성 (예: 'guestName')

    setFormData({
      ...formData, // 기존 formData를 복사하고
      [name]: value // 변경된 input의 name에 해당하는 속성만 새로운 값으로 덮어씀
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`예약자: ${formData.guestName}, 손님 수: ${formData.numberOfGuests}, 참석 여부: ${formData.isGoing ? '예' : '아니오'}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        이름:
        <input
          name="guestName"
          type="text"
          value={formData.guestName}
          onChange={handleInputChange} />
      </label>
      <br />
      <label>
        손님 수:
        <input
          name="numberOfGuests"
          type="number"
          value={formData.numberOfGuests}
          onChange={handleInputChange} />
      </label>
      <br />
      <label>
        참석 여부:
        <input
          name="isGoing"
          type="checkbox"
          checked={formData.isGoing}
          onChange={handleInputChange} />
      </label>
      <br />
      <button type="submit">예약 제출</button>
    </form>
  );
}
```

---

## 3. 연습 문제

### 문제 1: 회원가입 폼 만들기
- **요구사항**: 이메일과 비밀번호를 입력받는 회원가입 폼을 만드세요.
- **세부사항**:
    1. `email`과 `password`를 위한 `state`를 각각 만듭니다.
    2. 각 `input`은 제어 컴포넌트 방식으로 구현합니다.
    3. "가입하기" 버튼을 누르면(폼 제출), `alert`로 "이메일: [email], 비밀번호: [password]" 형식의 메시지를 띄웁니다.
- **도전과제**: 비밀번호 `input`의 `type`을 `password`로 설정하여 입력 내용이 보이지 않게 하고, 비밀번호가 8자 미만일 경우 제출 버튼을 비활성화하는 로직을 추가해보세요.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
import React, { useState } from 'react';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`가입 시도 => 이메일: ${email}, 비밀번호: ${password}`);
  };

  // 도전과제: 비밀번호 길이에 따른 제출 버튼 활성화 여부
  const isSubmitDisabled = password.length < 8;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        이메일:
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        비밀번호:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      {/* 도전과제: 비밀번호가 8자 미만일 때 경고 메시지 표시 */}
      {password.length > 0 && password.length < 8 && 
        <p style={{color: 'red'}}>비밀번호는 8자 이상이어야 합니다.</p>
      }
      <br />
      <button type="submit" disabled={isSubmitDisabled}>가입하기</button>
    </form>
  );
}
```
</details>

### 문제 2: 선호도 조사 폼 만들기
- **요구사항**: `<select>`와 `<textarea>`를 사용하여 사용자의 선호 과일과 그 이유를 입력받는 폼을 만드세요.
- **세부사항**:
    1. `favoriteFruit`와 `reason`을 위한 `state`를 만듭니다.
    2. `<select>` 태그로 "사과", "바나나", "오렌지" 중 하나를 선택할 수 있게 합니다.
    3. `<textarea>` 태그로 그 과일을 좋아하는 이유를 입력받습니다.
    4. 두 폼 엘리먼트 모두 제어 컴포넌트로 구현합니다.
    5. 제출 시, "선택한 과일: [fruit], 이유: [reason]" 형식의 메시지를 `alert`로 보여줍니다.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
import React, { useState } from 'react';

function PreferenceForm() {
  const [favoriteFruit, setFavoriteFruit] = useState('사과');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`선택한 과일: ${favoriteFruit}, 이유: ${reason}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        가장 좋아하는 과일은?
        <select value={favoriteFruit} onChange={e => setFavoriteFruit(e.target.value)}>
          <option value="사과">사과</option>
          <option value="바나나">바나나</option>
          <option value="오렌지">오렌지</option>
        </select>
      </label>
      <br />
      <label>
        이유를 적어주세요:
        <br />
        <textarea value={reason} onChange={e => setReason(e.target.value)} />
      </label>
      <br />
      <button type="submit">제출</button>
    </form>
  );
}
```
</details>
