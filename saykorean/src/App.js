import './App.css';
import Welcome from './components/Welcome';
import MyProfile from './components/MyProfile';
import Book from './components/Book';
import Product from './components/Product';
import { useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  

  // count 값이 변할 때마다 useEffect 실행
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);  // 의존성 배열에 count 전달


  return (

    <div>
      <Welcome name="최동진" />
      <Welcome name="Gemini" />
      <MyProfile />
      <Book title="연금술사" author="paul cojelo" />
      <Book title="강철의 연금술사" author="arakawa hiromu" />
      <Product name="정동진쌀 10kg" price="21,000" />
      <p>You clicked {count} times </p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div >
  );
}


export default App;