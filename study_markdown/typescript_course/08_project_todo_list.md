# 8장: 실전 프로젝트 - 클래스 기반 Todo 리스트 만들기

지금까지 배운 TypeScript의 모든 개념(타입, 인터페이스, 제네릭, 클래스 등)을 종합하여, 프레임워크 없이 순수 TypeScript만으로 동작하는 간단한 Todo 리스트 애플리케이션의 핵심 로직을 만들어봅니다.

---

## 1. 프로젝트 목표 및 설계

- **기능 요구사항**:
    - Todo 항목을 추가할 수 있다.
    - 특정 ID의 Todo 항목을 찾을 수 있다.
    - 특정 Todo 항목의 완료 상태를 토글(toggle)할 수 있다.
    - 모든 Todo 목록 또는 특정 상태(완료/미완료)의 목록을 가져올 수 있다.

- **핵심 타입 및 클래스 설계**:
    1.  **`Todo` 인터페이스**: 개별 Todo 항목의 데이터 구조를 정의합니다.
        - `id`: `number` (고유 식별자)
        - `task`: `string` (할 일 내용)
        - `isDone`: `boolean` (완료 여부)

    2.  **`TodoList` 클래스**: Todo 항목들을 관리하는 주체입니다.
        - `todos`: `Todo[]` (Todo 항목들을 저장하는 배열)
        - `addTodo(task: string): Todo`: 새 Todo를 추가하고, 생성된 Todo 객체를 반환합니다.
        - `toggleTodo(id: number): boolean`: ID로 Todo를 찾아 `isDone` 상태를 반전시키고, 성공 여부를 반환합니다.
        - `getTodos(status?: \'all\' | \'done\' | \'undone\'): Todo[]`: 상태에 따라 필터링된 Todo 목록을 반환합니다.

## 2. 구현 코드

```typescript
// src/index.ts

// 1. Todo 항목의 구조를 정의하는 인터페이스
interface Todo {
  readonly id: number;
  task: string;
  isDone: boolean;
}

// 2. Todo 리스트를 관리하는 클래스
class TodoList {
  // private: 클래스 외부에서 접근 불가
  private todos: Todo[] = [];
  private nextId: number = 1;

  /**
   * 새로운 할 일을 추가합니다.
   * @param task 할 일의 내용
   * @returns 생성된 Todo 객체
   */
  public addTodo(task: string): Todo {
    const newTodo: Todo = {
      id: this.nextId++,
      task: task,
      isDone: false,
    };
    this.todos.push(newTodo);
    console.log(`[ADD] "${task}" 추가됨 (ID: ${newTodo.id})`);
    return newTodo;
  }

  /**
   * 특정 ID의 할 일 완료 상태를 변경합니다.
   * @param id 완료 상태를 변경할 Todo의 ID
   * @returns 성공 여부
   */
  public toggleTodo(id: number): boolean {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.isDone = !todo.isDone;
      console.log(`[TOGGLE] ID ${id}의 상태가 ${todo.isDone}로 변경됨`);
      return true;
    }
    console.error(`[TOGGLE] ID ${id}를 찾을 수 없음`);
    return false;
  }

  /**
   * 할 일 목록을 가져옵니다.
   * @param status 필터링할 상태 ('all', 'done', 'undone')
   * @returns 필터링된 Todo 목록
   */
  public getTodos(status: 'all' | 'done' | 'undone' = 'all'): Todo[] {
    switch (status) {
      case 'done':
        return this.todos.filter(t => t.isDone);
      case 'undone':
        return this.todos.filter(t => !t.isDone);
      case 'all':
      default:
        return [...this.todos]; // 원본 배열의 복사본을 반환
    }
  }
}

// 3. 실행 코드
const myTodoList = new TodoList();

myTodoList.addTodo('TypeScript 공부하기');
const todo2 = myTodoList.addTodo('점심 먹기');
myTodoList.addTodo('운동하기');

console.log('\n--- 전체 목록 ---");
console.table(myTodoList.getTodos());

myTodoList.toggleTodo(todo2.id);

console.log('\n--- 완료된 목록 ---");
console.table(myTodoList.getTodos('done'));

console.log('\n--- 미완료 목록 ---");
console.table(myTodoList.getTodos('undone'));
```

## 3. 연습 문제 및 개선 과제

### 문제 1: Todo 삭제 기능 추가하기
- **요구사항**: `TodoList` 클래스에 특정 ID의 Todo 항목을 삭제하는 `removeTodo(id: number)` 메소드를 추가하세요.
- **세부사항**:
    1. `id`를 인자로 받습니다.
    2. `findIndex`를 사용하여 배열에서 해당 ID를 가진 Todo의 인덱스를 찾습니다.
    3. 인덱스를 찾았다면, `splice` 메소드를 사용하여 배열에서 해당 항목을 제거하고 `true`를 반환합니다.
    4. 인덱스를 찾지 못했다면, 콘솔에 에러 메시지를 출력하고 `false`를 반환합니다.

<details>
<summary>문제 1 정답 예시</summary>

```typescript
// TodoList 클래스 내부에 추가

public removeTodo(id: number): boolean {
  const index = this.todos.findIndex(t => t.id === id);
  if (index > -1) {
    const removedTask = this.todos[index].task;
    this.todos.splice(index, 1);
    console.log(`[REMOVE] "${removedTask}" 삭제됨 (ID: ${id})`);
    return true;
  }
  console.error(`[REMOVE] ID ${id}를 찾을 수 없음`);
  return false;
}
```
</details>

### 문제 2: 제네릭을 이용한 데이터 저장소 클래스 만들기
- **요구사항**: 현재 `TodoList` 클래스는 `Todo` 타입에만 의존적입니다. 제네릭을 사용하여 어떤 타입의 데이터든 저장하고 관리할 수 있는 범용 `DataRepository<T>` 클래스를 만들어보세요.
- **세부사항**:
    1. `T`는 `id` (`number` 타입) 속성을 반드시 가져야 한다는 제네릭 제약 조건을 추가합니다. (`T extends { id: number }`)
    2. `addItem(item: Omit<T, 'id'>): T`: `id`가 없는 아이템을 받아, `id`를 부여하고 저장한 후 전체 아이템을 반환합니다.
    3. `removeItem(id: number): boolean`: ID로 아이템을 삭제합니다.
    4. `updateItem(id: number, updates: Partial<Omit<T, 'id'>>): T | undefined`: ID로 아이템을 찾아, 주어진 `updates` 객체로 내용을 부분적으로 수정합니다.
    5. `findAll(): T[]`: 모든 아이템을 반환합니다.
    6. 이 `DataRepository` 클래스를 사용하여 `Todo` 데이터를 관리하도록 기존 코드를 리팩토링해보세요.

<details>
<summary>문제 2 힌트</summary>

```typescript
interface HasId {
  id: number;
}

class DataRepository<T extends HasId> {
  private items: T[] = [];
  private nextId: number = 1;

  addItem(itemData: Omit<T, 'id'>): T {
    const newItem = { ...itemData, id: this.nextId++ } as T;
    this.items.push(newItem);
    return newItem;
  }

  // ... 나머지 메소드 구현 ...
}

// 사용 예시
const todoRepo = new DataRepository<Todo>();
todoRepo.addItem({ task: '제네릭 공부', isDone: false });
```
</details>
