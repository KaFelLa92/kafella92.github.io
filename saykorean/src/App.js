import './App.css';
import Welcome from './components/Welcome';
import MyProfile from './components/MyProfile';
import Book from './components/Book';
import Product from './components/Product';
import Counter from './components/Counter';
import Timer from './components/Timer';
import Stopwatch from './components/Stopwatch.js';
import Tictok from './components/Tictok';
import RandomNumber from './components/RandomNumber.js';
import WatchCounter from './components/WatchCounter.js';


function App() {

  return (

    <div>
      <Welcome name="최동진" />
      <Welcome name="Gemini" />
      <MyProfile />
      <Book title="연금술사" author="paul cojelo" />
      <Book title="강철의 연금술사" author="arakawa hiromu" />
      <Product name="정동진쌀 10kg" price="21,000" />
      <Counter></Counter>
      <Timer></Timer>
      <Stopwatch />
      <Tictok></Tictok>
      <RandomNumber />
      <WatchCounter />
    </div >
  );
}


export default App;