// 1초마다 1씩 증가하는 스톱워치
// 시작/일시정지 버튼과 리셋 버튼이 있음

import { useEffect, useState } from "react";

function stopWatch(){

    const [seconds , setSeconds] = useState(0);

    useEffect( () => {
        const intervalId = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
        } ,1000 );
    }
    
    //

    )

}

export default stopWatch;