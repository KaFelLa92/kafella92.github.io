window.onload = function () {
    const correctPassword = "19930623"; // 원하는 비밀번호로 수정

    let input = prompt("💬 푸룬토크는 This Flower만 입장 가능합니다.\n비밀번호를 입력해주세요:");

    if (input !== correctPassword) {
        alert("❌ 접근 거부! 푸룬이 부족합니다.");
        // 다른 페이지로 리디렉션하거나 닫기
        window.location.href = "home.html"; // 또는 공용 페이지로 돌리기
    } else {
        alert("✅ 접근 허용! 푸룬이 충만합니다. 입장하세요.");
    }
};