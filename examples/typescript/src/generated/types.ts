export interface User {
  id: string;
  email: string;
  birthDate: Date | null;
  role: UserRole;
  posts: Post[];
}

export interface Post {
  id: string;
  author: User[];
}

enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}