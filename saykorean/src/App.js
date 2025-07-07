import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostListPage from './pages/PostListPage';
import NewPostPage from './pages/NewPostPage';
import './App.css';

function App() {
  return (
    <div>
      <nav className="head-nav">
        <Link to="/" style={{color: 'white', marginRight: '20px'}}>Home</Link>
        <Link to="/posts" style={{color: 'white', marginRight: '20px'}}>글 목록</Link>
        <Link to="/new-post" style={{color: 'white'}}>새 글 작성</Link>
      </nav>

      <div style={{padding: '20px'}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/new-post" element={<NewPostPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;