import { useEffect, useState } from "react";

function WatchCounter() {

    const [count, setCount] = useState(0);
    useEffect(() => {
        console.log(count)
    }, []);

    return (
        <div>
            <h2> 카운트: {count} </h2>
            <button onClick={() => setCount(count + 1)}>+1</button>
        </div>
    );
}

export default WatchCounter