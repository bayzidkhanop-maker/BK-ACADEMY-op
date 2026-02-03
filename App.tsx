import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';
import Courses from './Courses';
import CourseDetails from './CourseDetails';
import Profile from './Profile';
import { useAuth } from './AuthContext';
import { Course } from './types';

// Mock Data Seeder
const seedCourses = () => {
  if (!localStorage.getItem('bk_courses')) {
    const initialCourses: Course[] = [
      {
        id: '1',
        title: 'Complete React Guide',
        description: 'Master React from scratch with hands-on projects.',
        instructor: 'John Doe',
        price: 99,
        discountPrice: 49,
        image: 'https://picsum.photos/400/250',
        lessons: [
          { id: 'l1', title: 'Introduction to JSX', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l2', title: 'Components & Props', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
        ]
      },
      {
        id: '2',
        title: 'Advanced TypeScript',
        description: 'Deep dive into Generics, Utility Types and more.',
        instructor: 'Jane Smith',
        price: 129,
        image: 'https://picsum.photos/401/250',
        lessons: []
      }
    ];
    localStorage.setItem('bk_courses', JSON.stringify(initialCourses));
  }
};

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    seedCourses();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Courses />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2024 BK Academy. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;