# 6장: 리스트와 Key - 동적인 목록 만들기

배열 데이터를 UI에 동적으로 렌더링하는 방법을 배웁니다. React가 리스트의 변경 사항을 효율적으로 추적하고 업데이트하는 데 필요한 `key` prop의 중요성을 이해합니다.

---

## 1. 핵심 개념

- **`map()` 함수**: JavaScript 배열의 내장 함수로, 배열의 각 요소를 순회하며 새로운 배열을 만듭니다. React에서는 이 `map()` 함수를 사용하여 데이터 배열을 엘리먼트 배열로 변환합니다.

- **Key**: 리스트의 각 엘리먼트에 부여해야 하는 **고유하고 안정적인** 문자열 속성입니다.
    - **왜 필요한가?**: React는 `key`를 사용하여 리스트의 어떤 항목이 변경, 추가, 또는 제거되었는지 식별합니다. `key`가 없으면 React는 리스트가 변경될 때마다 전체 리스트를 파괴하고 새로 만드는 비효율적인 방식을 사용할 수 있습니다.
    - **좋은 Key의 조건**:
        1.  **고유성**: 형제 엘리먼트 사이에서 유일해야 합니다. 전체 애플리케이션에서 고유할 필요는 없습니다.
        2.  **안정성**: 리렌더링 되더라도 변하지 않아야 합니다. 항목의 순서가 바뀌어도 해당 항목의 `key`는 그대로 유지되어야 합니다.
    - **무엇을 Key로 사용해야 하는가?**: 데이터에 포함된 고유 ID(예: 데이터베이스의 `id`, `uuid`)를 사용하는 것이 가장 좋습니다.
    - **최후의 수단, `index`**: 마땅한 `key`가 없을 때 배열의 `index`를 `key`로 사용할 수 있지만, **권장하지 않습니다**. 리스트의 순서가 바뀌거나 항목이 추가/삭제될 때 `key`가 불안정해져 성능 저하와 예기치 않은 버그를 유발할 수 있습니다.

---

## 2. 예제 코드

### 예제 1: 간단한 숫자 리스트 렌더링

`map` 함수를 사용하여 숫자 배열을 `<li>` 엘리먼트 배열로 변환합니다.

```javascript
function NumberList() {
  const numbers = [1, 2, 3, 4, 5];
  
  const listItems = numbers.map((number) =>
    // 각 li 엘리먼트에 고유한 key를 부여합니다.
    // 이 경우 number 자체가 고유하므로 key로 사용할 수 있습니다.
    <li key={number.toString()}>
      {number}
    </li>
  );

  return <ul>{listItems}</ul>;
}
```

### 예제 2: 객체 배열과 컴포넌트 렌더링

데이터가 객체 배열일 경우, 각 객체를 컴포넌트에 prop으로 전달하여 렌더링하는 것이 일반적입니다.

```javascript
// src/components/TodoItem.js
// 할 일 항목 하나를 렌더링하는 컴포넌트
function TodoItem({ id, text, completed }) {
  const itemStyle = {
    textDecoration: completed ? 'line-through' : 'none',
    color: completed ? '#aaa' : '#000'
  };
  
  return <li style={itemStyle}>{text}</li>;
}

// src/components/TodoList.js
import TodoItem from './TodoItem';

function TodoList() {
  const todos = [
    { id: 'a1', text: 'React 공부하기', completed: true },
    { id: 'b2', text: '운동하기', completed: false },
    { id: 'c3', text: '저녁 장보기', completed: false },
  ];

  return (
    <div>
      <h1>오늘의 할 일</h1>
      <ul>
        {todos.map((todo) => (
          // 데이터의 고유 ID인 todo.id를 key로 사용
          // todo 객체 전체를 props로 전달 (또는 필요한 속성만 전달)
          <TodoItem 
            key={todo.id} 
            id={todo.id} 
            text={todo.text} 
            completed={todo.completed}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
```

---

## 3. 연습 문제

### 문제 1: `FruitList` 컴포넌트 만들기
- **요구사항**: 과일 이름 배열을 받아 `<ul>` 리스트로 렌더링하는 `FruitList` 컴포넌트를 만드세요.
- **세부사항**:
    1. `const fruits = ['사과', '바나나', '오렌지', '딸기', '포도'];` 배열을 사용합니다.
    2. `map` 함수를 사용하여 각 과일 이름을 `<li>` 태그로 렌더링합니다.
    3. **(중요)** `key` prop을 적절히 설정하세요. 이 경우, 과일 이름이 중복되지 않는다고 가정하고 이름 자체를 `key`로 사용할 수 있습니다.
- **도전과제**: `index`를 `key`로 사용했을 때와 과일 이름을 `key`로 사용했을 때 어떤 차이가 있을지 생각해보세요. (만약 리스트의 순서가 바뀐다면?)

<details>
<summary>문제 1 정답 예시</summary>

```javascript
function FruitList() {
  const fruits = ['사과', '바나나', '오렌지', '딸기', '포도'];
  
  return (
    <div>
      <h2>과일 목록</h2>
      <ul>
        {fruits.map((fruit, index) => (
          // 이 예제에서는 fruit 이름이 고유하므로 key로 사용 가능합니다.
          // index를 key로 사용하는 것은 피하는 것이 좋습니다: <li key={index}>{fruit}</li>
          <li key={fruit}>{fruit}</li>
        ))}
      </ul>
    </div>
  );
}

export default FruitList;
```
</details>

### 문제 2: `UserList` 컴포넌트 만들기
- **요구사항**: 사용자 정보가 담긴 객체 배열을 받아, 각 사용자의 이름과 이메일을 리스트로 보여주는 `UserList` 컴포넌트를 만드세요.
- **세부사항**:
    1. 아래의 `users` 배열을 사용합니다.
        ```javascript
        const users = [
          { id: 101, name: '최동진', email: 'kafella@example.com' },
          { id: 102, name: 'Gemini', email: 'gemini@example.com' },
          { id: 103, name: 'React', email: 'react@example.com' },
        ];
        ```
    2. `map` 함수를 사용하여 각 `user` 객체를 `<li>` 엘리먼트로 변환합니다.
    3. 각 `<li>` 안에는 "이름: [name], 이메일: [email]" 형식의 텍스트가 포함되어야 합니다.
    4. 각 `<li>`의 `key`로는 `user.id`를 사용하세요.
- **도전과제**: 각 리스트 항목을 별도의 `User` 컴포넌트로 분리하고, `UserList`에서는 `User` 컴포넌트를 `map`으로 렌더링하도록 구조를 변경해보세요.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
// 도전과제까지 포함한 정답

// src/components/User.js
function User({ name, email }) {
  return (
    <li>
      이름: {name}, 이메일: {email}
    </li>
  );
}

// src/components/UserList.js
import User from './User';

function UserList() {
  const users = [
    { id: 101, name: '최동진', email: 'kafella@example.com' },
    { id: 102, name: 'Gemini', email: 'gemini@example.com' },
    { id: 103, name: 'React', email: 'react@example.com' },
  ];

  return (
    <div>
      <h2>사용자 목록</h2>
      <ul>
        {users.map(user => (
          <User key={user.id} name={user.name} email={user.email} />
        ))}
      </ul>
    </div>
  );
}

export default UserList;
```
</details>
