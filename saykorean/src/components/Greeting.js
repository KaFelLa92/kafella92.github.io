import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

function Greeting({ isLoggedIn, onLogin, onLogout }) {

    return (
        <div>
            <h1> {isLoggedIn ? "환영합니다!" : "로그인해라 뒤지기 싫으면"}</h1>
            {isLoggedIn ? (
                <LogoutButton onClick={onLogout} />
            ) : (
                <LoginButton onClick={onLogin} />
            )}
        </div>
    );
}


export default Greeting;