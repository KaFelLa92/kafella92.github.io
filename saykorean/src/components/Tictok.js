import { useState } from "react";

function Tictok() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2>현재 카운트 : {count} </h2>
            <button onClick={() => setCount(count + 1)} > 증가 </button>
        </div>
    );
}

export default Tictok;