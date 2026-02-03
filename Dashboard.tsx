import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Course } from './types';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  useEffect(() => {
    const allCourses: Course[] = JSON.parse(localStorage.getItem('bk_courses') || '[]');
    if (user && user.enrolledCourses) {
      const userCourses = allCourses.filter(c => user.enrolledCourses.includes(c.id));
      setEnrolledCourses(userCourses);
    }
  }, [user]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Ready to continue learning?</p>
      </header>

      <div className="dashboard-section">
        <h2>My Enrolled Courses</h2>
        
        {enrolledCourses.length === 0 ? (
          <div className="empty-state">
            <p>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="course-grid">
            {enrolledCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-image" style={{ backgroundImage: `url(${course.image})` }}></div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '0%' }}></div>
                  </div>
                  <p className="progress-text">0% Complete</p>
                  <Link to={`/course/${course.id}`} className="btn btn-primary btn-sm btn-block">
                    <PlayCircle size={16} /> Continue Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;