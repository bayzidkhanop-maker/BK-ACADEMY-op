export interface Lesson {
  id: string;
  title: string;
  videoUrl?: string; // YouTube Embed URL
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  discountPrice?: number;
  image: string;
  lessons: Lesson[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  enrolledCourses: string[]; // Array of Course IDs
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}