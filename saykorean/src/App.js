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
import AlertButton from './components/AlertButton.js';
import ToggleButton from './components/ToggleButton.js';
import Greeting from './components/Greeting.js';
import { useState } from 'react';
import LoginButton from './components/LoginButton.js';
import LogoutButton from './components/LogoutButton.js';
import DataLoader from './components/DataLoader.js';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

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
      <DataLoader />
    </div >
  );
}


export default App;