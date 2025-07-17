function Mapping() {
    // 1~5 숫자 배열 만들기
    const numbers = [1, 2, 3, 4, 5]
    const listItems = numbers.map((number) =>
        <li key={number.toString()}>
            {number}
        </li>);
    return (
        <ul>
            {listItems}
        </ul>
    );
}

export default Mapping;