import logo from './logo.svg';
import './App.css';               // css import
import { useState } from 'react'; // state import



function App() {

  let post = '밥에 관련한 한국어 표현';
  let [title, b] = useState('오홍홍햄빠끄 밥 한 번 먹자'); // state 문법 사용 방법
  let [logo, setLogo] = useState('ReactNovice');

  // 디스트럭처링 문법 시작
  let num = [1, 2, 3];
  let a = num[0];
  let c = num[1];
  console.log(c);     // 2가 나옴. 배열에서 찾아서 값을 넣어줌

  let [d, e] = [1, 2];  // 형태 맞추면 대응해서 집어넣어짐
  //디스트럭처링 문법 끝

  return (
    <div className="App">
      <div className="head-nav">
        <h4> {logo} </h4>
      </div>
      <div className='list'>
        <h4>{title}</h4>
        <p>2월 17일 발행 </p>
      </div>
    </div>
  );
}

export default App;
