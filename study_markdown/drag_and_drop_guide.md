
# 드래그 앤 드롭(Drag and Drop)으로 컴포넌트 이동 구현 가이드

이 문서는 프론트엔드 환경에서 인력 정보, 업무 정보와 같은 컴포넌트를 드래그 앤 드롭으로 이동시키는 기능을 구현하는 방법을 안내합니다.

크게 두 가지 방법을 제시합니다.

1.  **HTML5 네이티브 Drag and Drop API**: 별도의 라이브러리 없이 순수 HTML, CSS, JavaScript로 구현하는 방식입니다.
2.  **React 라이브러리 (dnd-kit)**: React 환경에서 더 쉽고 강력하게 기능을 구현할 수 있는 라이브러리 사용 방식입니다.

---

## 1. HTML5 네이티브 Drag and Drop API 사용

이 방식은 프레임워크에 종속되지 않아 어떤 프로젝트에도 적용할 수 있는 가장 기본적인 방법입니다.

### 주요 단계

1.  **드래그할 요소 지정**: HTML 요소에 `draggable="true"` 속성을 추가합니다.
2.  **이벤트 핸들러 등록**:
    *   `ondragstart`: 드래그가 시작될 때 발생. 드래그할 데이터(예: 컴포넌트의 ID)를 지정합니다.
    *   `ondragover`: 드롭 대상 위에서 마우스가 움직일 때 발생. `preventDefault()`를 호출하여 드롭이 가능하도록 설정해야 합니다.
    *   `ondrop`: 드롭 대상에 요소를 놓았을 때 발생. `dragstart`에서 저장한 데이터를 가져와 UI와 데이터 상태를 업데이트합니다.

### 예제 코드

#### HTML

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Drag and Drop 예제</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>업무 관리 보드</h1>
    <div class="board">
        <div id="lane-todo" class="lane">
            <h2>To Do</h2>
            <div class="task" id="task-1" draggable="true">인력 정보 UI 개발</div>
            <div class="task" id="task-2" draggable="true">업무 정보 API 연동</div>
        </div>
        <div id="lane-done" class="lane">
            <h2>Done</h2>
            <div class="task" id="task-3" draggable="true">기획서 작성</div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

#### CSS (`style.css`)

```css
.board {
    display: flex;
    gap: 20px;
}
.lane {
    width: 200px;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
    min-height: 200px;
}
.task {
    background-color: white;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-bottom: 10px;
    cursor: grab;
}
.task:active {
    cursor: grabbing;
}
.lane.drag-over {
    border: 2px dashed #000;
}
```

#### JavaScript (`script.js`)

```javascript
const tasks = document.querySelectorAll('.task');
const lanes = document.querySelectorAll('.lane');

tasks.forEach(task => {
    task.addEventListener('dragstart', (e) => {
        // 드래그할 데이터(task의 id)를 저장
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.style.opacity = '0.5';
    });

    task.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
    });
});

lanes.forEach(lane => {
    lane.addEventListener('dragover', (e) => {
        // 기본 이벤트를 막아야 drop 이벤트가 발생함
        e.preventDefault();
        lane.classList.add('drag-over');
    });

    lane.addEventListener('dragleave', () => {
        lane.classList.remove('drag-over');
    });

    lane.addEventListener('drop', (e) => {
        e.preventDefault();
        lane.classList.remove('drag-over');

        // dragstart에서 저장한 task의 id를 가져옴
        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);

        // 드롭된 lane에 task를 추가
        e.currentTarget.appendChild(draggable);
    });
});
```

---

## 2. React 라이브러리 사용 (예: dnd-kit)

React 프로젝트에서는 `dnd-kit`과 같은 라이브러리를 사용하면 상태 관리와 통합이 용이하고, 더 복잡한 상호작용을 쉽게 구현할 수 있습니다.

### 주요 단계

1.  **라이브러리 설치**:
    ```bash
    npm install @dnd-kit/core @dnd-kit/sortable
    ```
2.  **컨텍스트 제공**: 앱의 최상단 또는 드래그 앤 드롭이 필요한 영역을 `<DndContext>`로 감쌉니다.
3.  **훅 사용**:
    *   `useDraggable`: 드래그할 컴포넌트에서 사용합니다.
    *   `useDroppable`: 드롭될 영역에서 사용합니다.
    *   `useSortable`: 목록 내에서 순서를 변경하는 기능을 쉽게 만들 때 사용합니다.
4.  **이벤트 핸들러 작성**: `<DndContext>`의 `onDragEnd`와 같은 이벤트 핸들러에서 상태(State)를 업데이트하는 로직을 작성합니다.

### 예제 컨셉 코드

```jsx
import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

// 드래그할 아이템 컴포넌트
function DraggableItem({ id, children }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
}

// 드롭될 영역 컴포넌트
function DroppableLane({ id, children }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="lane">
            {children}
        </div>
    );
}

function App() {
    const [tasks, setTasks] = useState({
        todo: [{ id: 'task-1', content: '인력 정보 UI 개발' }],
        done: [{ id: 'task-2', content: '기획서 작성' }],
    });

    function handleDragEnd(event) {
        const { over, active } = event;
        if (over) {
            // 상태 업데이트 로직
            // 1. active.id를 가진 task를 찾는다.
            // 2. 해당 task를 원래 lane에서 제거한다.
            // 3. 해당 task를 over.id를 가진 lane에 추가한다.
            console.log(`Task ${active.id} was dropped over ${over.id}`);
            // 여기에 실제 데이터 변경 로직을 구현해야 합니다.
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="board">
                <DroppableLane id="todo">
                    <h2>To Do</h2>
                    {tasks.todo.map(task => (
                        <DraggableItem key={task.id} id={task.id}>
                            <div className="task">{task.content}</div>
                        </DraggableItem>
                    ))}
                </DroppableLane>
                <DroppableLane id="done">
                    <h2>Done</h2>
                    {tasks.done.map(task => (
                        <DraggableItem key={task.id} id={task.id}>
                            <div className="task">{task.content}</div>
                        </DraggableItem>
                    ))}
                </DroppableLane>
            </div>
        </DndContext>
    );
}
```

---

## 결론

-   **간단한 기능**이나 특정 프레임워크에 **종속되지 않아야 하는 경우**에는 **HTML5 네이티브 API**를 사용하는 것이 좋습니다.
-   **React**를 사용하고 있고, **상태 관리와의 연동**, 정렬, 접근성 등 **고급 기능**이 필요하다면 **dnd-kit**과 같은 라이브러리를 사용하는 것이 훨씬 효율적입니다.

