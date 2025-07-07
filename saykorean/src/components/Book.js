function Book(props) {
    return (
        <div>
            <h2> {props.title} </h2>
            <p>저자: {props.author}</p>
        </div>
    );
}

export default Book;