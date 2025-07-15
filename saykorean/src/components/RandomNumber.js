import { useState } from "react";

function RandomNumber() {
    const [number, setNumber] = useState(0);

    const generateRandom = () => {
        const random = Math.floor(Math.random() * 100) + 1;
        setNumber(random);
    };

    return (
        <div>
            <h2> 숫자뽑기 : {number} </h2>
            <button onClick={generateRandom}>숫자 생성</button>
        </div>
    );

}

export default RandomNumber;