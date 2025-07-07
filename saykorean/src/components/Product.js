function Product(props) {
    return (
        <div>
            <p> 상품명: {props.name} , 가격: {props.price}원 </p>
        </div>
    );
}

export default Product;