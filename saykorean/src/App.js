import './App.css';
import Welcome from './components/Welcome';
import MyProfile from './components/MyProfile';
import Book from './components/Book';
import Product from './components/Product';

function App() {
  return (
    <div>
      <Welcome name="최동진" />
      <Welcome name="Gemini" />
      <MyProfile />
      <Book title="연금술사" author="paul cojelo" />
      <Book title="강철의 연금술사" author="arakawa hiromu" />
      <Product name="정동진쌀 10kg" price="21,000" />
    </div>
  );
}


export default App;