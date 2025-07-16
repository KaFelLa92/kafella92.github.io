function Greeting({ isLoggedIn }) {
    if (isLoggedIn) {
        return <h1>환영합니다!</h1>;
    }
    return <h1> 로그인해라 뒤지기 싫으면 </h1>;
}


export default Greeting;