# 11장: 전역 상태 관리 (Zustand) - 컴포넌트의 벽 허물기

애플리케이션의 규모가 커지면, 여러 컴포넌트가 공유해야 하는 상태(예: 사용자 정보, 테마, 장바구니 등)가 생깁니다. Props drilling 없이 이러한 **전역 상태**를 효율적으로 관리하는 방법을 배웁니다. 여기서는 간단하고 강력한 라이브러리인 **Zustand**를 사용합니다.

---

## 1. 핵심 개념

- **전역 상태(Global State)**: 여러 컴포넌트가 공통으로 접근하고 수정해야 하는 상태.
- **상태 관리 라이브러리**: 전역 상태를 컴포넌트 트리 바깥의 한 곳(스토어)에서 관리하고, 어떤 컴포넌트에서든 쉽게 접근할 수 있도록 도와주는 도구. (예: Redux, Recoil, Zustand 등)

- **Zustand**:
    - **간단함**: 몇 줄의 코드로 스토어를 만들고 바로 사용할 수 있습니다. Redux처럼 복잡한 설정(Provider, Action, Reducer 등)이 필요 없습니다.
    - **Hook 기반**: 스토어를 만들고, 컴포넌트에서는 커스텀 훅처럼 사용하여 상태와 액션을 가져옵니다.
    - **최소한의 리렌더링**: 스토어의 여러 상태 중 특정 상태만 구독하여, 해당 상태가 변경될 때만 컴포넌트가 리렌더링되도록 최적화하기 쉽습니다.

---

## 2. 예제 코드

### 예제 1: Zustand로 간단한 스토어 만들기

사용자의 로그인 상태와 이름을 관리하는 인증 스토어를 만들어봅니다. (`npm install zustand` 필요)

```javascript
// src/stores/authStore.js
import { create } from 'zustand';

// create 함수로 스토어를 생성
const useAuthStore = create((set) => ({
  // 1. 상태 (State)
  isLoggedIn: false,
  user: null,

  // 2. 상태를 변경하는 함수 (Actions)
  login: (username) => set({ 
    isLoggedIn: true, 
    user: { name: username } 
  }),
  
  logout: () => set({ 
    isLoggedIn: false, 
    user: null 
  }),
}));

export default useAuthStore;
```

### 예제 2: 컴포넌트에서 스토어 사용하기

서로 다른 컴포넌트에서 `useAuthStore` 훅을 사용하여 상태를 구독하고 액션을 호출합니다.

```javascript
// src/components/LoginButton.js
import useAuthStore from '../stores/authStore';

function LoginButton() {
  // 액션만 가져와서 사용
  const login = useAuthStore((state) => state.login);
  
  return <button onClick={() => login('최동진')}>로그인</button>;
}

// src/components/LogoutButton.js
import useAuthStore from '../stores/authStore';

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);

  return <button onClick={logout}>로그아웃</button>;
}

// src/components/UserProfile.js
import useAuthStore from '../stores/authStore';

function UserProfile() {
  // 상태만 가져와서 사용
  const user = useAuthStore((state) => state.user);

  if (!user) return <div>로그인되지 않았습니다.</div>;
  
  return <h1>환영합니다, {user.name}님!</h1>;
}

// src/App.js
import useAuthStore from './stores/authStore';
// ... (위 컴포넌트들 import)

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div>
      <UserProfile />
      {isLoggedIn ? <LogoutButton /> : <LoginButton />}
    </div>
  );
}
```
**핵심**: `App` 컴포넌트를 `Provider`로 감쌀 필요 없이, 어떤 컴포넌트에서든 `useAuthStore()` 훅을 호출하기만 하면 스토어에 접근할 수 있습니다.

---

## 3. 연습 문제

### 문제 1: 장바구니 스토어 만들기
- **요구사항**: 상품을 담고 제거할 수 있는 장바구니 스토어(`useCartStore`)를 만드세요.
- **세부사항**:
    1. `items`라는 이름의 배열 state를 가집니다. (초기값: `[]`)
    2. `addItem` 액션을 만듭니다. 이 액션은 `product` 객체를 인자로 받아 `items` 배열에 추가합니다.
    3. `removeItem` 액션을 만듭니다. 이 액션은 `productId`를 인자로 받아 `items` 배열에서 해당 ID를 가진 상품을 제거합니다.
    4. (선택) `clearCart` 액션을 만들어 장바구니를 모두 비웁니다.
- **힌트**: 배열에 항목을 추가할 때는 `[...state.items, newItem]`, 제거할 때는 `state.items.filter(...)`를 사용합니다.

<details>
<summary>문제 1 정답 예시</summary>

```javascript
// src/stores/cartStore.js
import { create } from 'zustand';

const useCartStore = create((set) => ({
  items: [],
  addItem: (product) => set((state) => ({
    // 이미 장바구니에 있는 상품인지 확인 (선택적)
    // 여기서는 간단하게 그냥 추가
    items: [...state.items, product]
  })),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.id !== productId)
  })),
  clearCart: () => set({ items: [] }),
}));

export default useCartStore;
```
</details>

### 문제 2: 장바구니 UI 만들기
- **요구사항**: 문제 1에서 만든 `useCartStore`를 사용하여 장바구니 UI를 만드세요.
- **세부사항**:
    1. `ProductList` 컴포넌트를 만들어, 몇 개의 가상 상품과 "장바구니에 추가" 버튼을 표시합니다. 이 버튼을 누르면 `addItem` 액션이 호출됩니다.
    2. `Cart` 컴포넌트를 만들어, 현재 장바구니에 담긴 상품 목록(`items`)과 총 개수를 표시합니다.
    3. `Cart` 컴포넌트의 각 상품 옆에 "제거" 버튼을 만들어 `removeItem` 액션을 호출하도록 합니다.
    4. `App` 컴포넌트에서 `ProductList`와 `Cart`를 함께 렌더링합니다.

<details>
<summary>문제 2 정답 예시</summary>

```javascript
// src/App.js
import useCartStore from './stores/cartStore';

const products = [
  { id: 1, name: '노트북' },
  { id: 2, name: '키보드' },
  { id: 3, name: '마우스' },
];

function ProductList() {
  const addItem = useCartStore(state => state.addItem);
  return (
    <div>
      <h2>상품 목록</h2>
      {products.map(p => (
        <div key={p.id}>
          {p.name} <button onClick={() => addItem(p)}>장바구니에 추가</button>
        </div>
      ))}
    </div>
  );
}

function Cart() {
  const { items, removeItem } = useCartStore();
  return (
    <div>
      <h2>장바구니</h2>
      <p>총 {items.length}개의 상품</p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} <button onClick={() => removeItem(item.id)}>제거</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div>
      <ProductList />
      <hr />
      <Cart />
    </div>
  );
}
```
</details>
