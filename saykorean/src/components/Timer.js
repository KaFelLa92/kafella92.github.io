import { useEffect, useState } from "react";

// 1초마다 1씩증가
// use

function Timer() {
    // useState로 숫자 변환
    const [seconds, setSeconds] = useState(0); // 0초부터 시작

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        // 컴포넌트 언마운트될때 실행되는 클린업(cleanUp) 함수
        return () => clearInterval(intervalId);
    }, []); // 마운트 시 한 번만 실행
    return <p> 타이머 : {seconds} 초</p>;
}

export default Timer;