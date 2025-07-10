// 1초마다 1씩 증가하는 스톱워치
// 시작/일시정지 버튼과 리셋 버튼이 있음

import { useEffect, useState } from "react";

function Stopwatch() {

    const [seconds, setSeconds] = useState(0);         // 경과 시간
    const [isRunning, setIsRunning] = useState(false);  // 타이머 작동 여부는 boolean

    useEffect(() => {
        let intervalId;

        if (isRunning) {    // true 상태일 때
            intervalId = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }


        // 컴포넌트 언마운트 시 또는 isRunning이 false로 바뀔 때 interval 제거
        return () => clearInterval(intervalId);
    }, [isRunning]); // isRunning 상태 변경될 때마다 useEffect 재실행

    // 시작/일시정지 토글
    const handleStartPause = () => {
        setIsRunning(prev => !prev);    // prev이 뭘 뜻하는 거임?
    };

    // 시간 리셋
    const handleReset = () => {
        setIsRunning(false);    // 일시정지 상태로 전환
        setSeconds(0);          // 시간 초기화
    };

    return (
        <div>
            <h2>스톱워치</h2>
            <p>⏱️ {seconds} 초 </p>
            <button onClick={handleStartPause}>
                {isRunning ? '⏸️ 일시정지' : '▶️ 시작'}
            </button>
            <button onClick={handleReset}>🔄 리셋</button>
        </div>
    );
}

export default Stopwatch;