
import { create } from 'zustand';

const usePostStore = create((set) => ({
  // State: 초기 상태
  posts: [
    { id: 1, title: '리액트, 너는 대체...', content: '리액트를 처음 배우는데 생각보다 재미있네요.' },
    { id: 2, title: 'Zustand 사용법', content: '전역 상태 관리가 이렇게 쉬울 줄이야!' },
  ],
  nextPostId: 3,

  // Actions: 상태를 변경하는 함수들
  addPost: (post) =>
    set((state) => ({
      posts: [...state.posts, { ...post, id: state.nextPostId }],
      nextPostId: state.nextPostId + 1,
    })),
  
  getPostById: (id) => {
    const post = usePostStore.getState().posts.find((p) => p.id === id);
    return post;
  }
}));

export default usePostStore;
