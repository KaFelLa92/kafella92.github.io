function Greeting() { // 간단한 함수형 컴포넌트
  return <h1> 안녕하세요, 반갑습니다. </h1>;
}

// 복잡한 예시
function WelcomeMessage() {
  const name = "SAYKOREAN";
  const message = "한국어를 잘하려면 한국인처럼 생각하면 됩니다.";

  return (
    <div>
      <h1>안녕하세요, 저는 {name}입니다.</h1>
      <p>{message}</p>
    </div>
  )
}

function App() {
  return (
    <div>
      <Greeting></Greeting>
      <WelcomeMessage></WelcomeMessage>
    </div>
  );
}

export default App;
