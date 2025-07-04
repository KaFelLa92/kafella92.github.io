/* eslint-disable */
// 워닝 메시지 지워주는 기능

import logo from './logo.svg';
import './App.css';               // css import
import { useState } from 'react'; // state import

// 자주 변경될 것 같은 html 부분은 useState써서 state화하기.

function App() {

  let post = '밥에 관련한 한국어 표현';
  let [title, titleHigh] = useState(['다음에 밥 한 번 먹자', '그게 밥이 돼?', '밥 먹었어요?']); // state 문법 사용 방법
  let [logo, setLogo] = useState('ReactNovice');
  let [thumb, thumbSwap] = useState(0); // state 문법 => let [호출변수 , 변경변수] = useState('출력값')


  // // 디스트럭처링 문법 시작
  // let num = [1, 2, 3];
  // let a = num[0];
  // let c = num[1];
  // console.log(c);     // 2가 나옴. 배열에서 찾아서 값을 넣어줌

  let [d, e] = [1, 2];  // 형태 맞추면 대응해서 집어넣어짐
  //디스트럭처링 문법 끝


  // HTML에서 () => {} 이렇게 함수 만들 수 있음
  // onClick에 함수 문법 갔다 박아도 됨

  function like() {
    console.log(1);
  }


  return (
    <div className="App">
      <div className="head-nav">
        <h4> {logo} </h4>
      </div>
      <button onClick={() => {
        title[0] = '그게 밥이 돼?';
        titleHigh(title);
      }}>글수정</button>
      <div className='list'>
        <h4> <span onClick={() => { thumbSwap(thumb + 1) }}>😊</span> {thumb} </h4>
        <p>2월 17일 발행 </p>
      </div>
      <div className='list'>
        <h4>{title[1]}</h4>
        <p>2월 17일 발행 </p>
      </div>
      <div className='list'>
        <h4>{title[2]}</h4>
        <p>2월 17일 발행 </p>
      </div>
    </div>
  );
}

export default App;
