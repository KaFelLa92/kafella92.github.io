import { useState } from "react";


function DataLoader() {
    // 기본 스테이트 true (로딩 중)
    const [isLoading, setIsLoading] = useState(true);
    useState(() => {
        // false되면 로딩 완료
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        < div >
            {isLoading ? <p> 로딩 중...</p> :
            <p>데이터 로딩 완료!</p>}
        </div >
    );
}

export default DataLoader;