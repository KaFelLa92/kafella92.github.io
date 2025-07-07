
import { useState } from 'react';

function PostForm({ onSubmit, initialData = { title: '', content: '' } }) {
  const [post, setPost] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (post.title && post.content) {
      onSubmit(post);
      setPost({ title: '', content: '' });
    } else {
      alert('제목과 내용을 모두 입력해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label style={{display: 'block', marginBottom: '5px'}}>제목:</label>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
      </div>
      <div>
        <label style={{display: 'block', marginBottom: '5px'}}>내용:</label>
        <textarea
          name="content"
          value={post.content}
          onChange={handleChange}
          rows="10"
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
      </div>
      <button type="submit" style={{padding: '10px 20px'}}>저장</button>
    </form>
  );
}

export default PostForm;
