

function AlertButton() {
    const handleClick = () => {
        alert('버튼이 클릭되었습니다!')
    };

    return (
        <button onClick={handleClick}>
            클릭하세요.
        </button>
    )
}

export default AlertButton;