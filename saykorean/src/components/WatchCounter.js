import { useEffect, useState } from "react";

function WatchCounter() {

    const [count, setCount] = useState(0);
    useEffect(() => {
        console.log('카운트가 ' + count + "(으)로 변경되었습니다.")
    }, [count]);

    return (
        <div>
            <h2> 카운트: {count} </h2>
            <button onClick={() => setCount(count + 1)}>+1</button>
        </div>
    );
}

export default WatchCounter