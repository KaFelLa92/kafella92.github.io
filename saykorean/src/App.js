import './App.css';
import Welcome from './components/Welcome';
import MyProfile from './components/MyProfile';
import Book from './components/Book';
import Product from './components/Product';
import Counter from './components/Counter';
import Timer from './components/Timer';
import Tictok from './components/Tictok';
import RandomNumber from './components/RandomNumber.js';
import WatchCounter from './components/WatchCounter.js';
import AlertButton from './components/AlertButton.js';
import ToggleButton from './components/ToggleButton.js';
import Greeting from './components/Greeting.js';
import { useState } from 'react';
import DataLoader from './components/DataLoader.js';
import Mapping from './components/Mapping.js';
import FruitList from './components/FruitList.js';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div>
      {/* 리턴값 내부 주석처리. 졸라기네*/}

      <Welcome name="최동진" />
      <Welcome name="Gemini" />
      <MyProfile />
      <Book title="연금술사" author="paul cojelo" />
      <Book title="강철의 연금술사" author="arakawa hiromu" />
      <Product name="정동진쌀 10kg" price="21,000" />
      <Counter></Counter>
      <Timer></Timer>
      <Tictok></Tictok>
      <RandomNumber />
      <WatchCounter />
      <DataLoader />
      <AlertButton />
      <ToggleButton />
      <Greeting
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Mapping />
      <FruitList />
    </div >
  );
}


export default App;