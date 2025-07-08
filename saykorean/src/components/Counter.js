import { useEffect, useState } from "react";

function Counter() {

    const [count, setCount] = useState(0);

    // count 값이 변할 때마다 useEffect 실행
    useEffect(() => {
        document.title = `You clicked ${count} times`;
    }, [count]);  // 의존성 배열에 count 전달

    return (
        <div>
            <p>You clicked {count} times </p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}

export default Counter;