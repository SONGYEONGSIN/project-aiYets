export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export const MOCK_USER: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: '홍길동',
  avatar: 'https://github.com/shadcn.png', // Placeholder avatar
};
