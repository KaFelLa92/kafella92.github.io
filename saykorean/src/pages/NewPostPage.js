import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import usePostStore from '../stores/postStore';

function NewPostPage() {
  const navigate = useNavigate();
  const addPost = usePostStore((state) => state.addPost);

  const handleSubmit = (post) => {
    addPost(post);
    alert('새 글이 등록되었습니다.');
    navigate('/posts'); // 글 등록 후 목록 페이지로 이동
  };

  return (
    <div>
      <h1>새 글 작성</h1>
      <PostForm onSubmit={handleSubmit} />
    </div>
  );
}

export default NewPostPage;