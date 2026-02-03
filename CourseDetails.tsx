import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course } from './types';
import { useAuth } from './AuthContext';
import { CheckCircle, Lock, Play } from 'lucide-react';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateUser, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  useEffect(() => {
    const courses: Course[] = JSON.parse(localStorage.getItem('bk_courses') || '[]');
    const found = courses.find(c => c.id === id);
    setCourse(found || null);
    if (found && found.lessons.length > 0) {
      setActiveLesson(found.lessons[0].id);
    }
  }, [id]);

  const isEnrolled = user?.enrolledCourses.includes(course?.id || '');

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user && course) {
      const updatedUser = {
        ...user,
        enrolledCourses: [...user.enrolledCourses, course.id]
      };
      updateUser(updatedUser);
      // Update in global users list as well (mock backend)
      const users = JSON.parse(localStorage.getItem('bk_users') || '[]');
      const newUsers = users.map((u: any) => u.id === user.id ? updatedUser : u);
      localStorage.setItem('bk_users', JSON.stringify(newUsers));
      alert('Successfully enrolled!');
    }
  };

  if (!course) return <div className="loading">Loading...</div>;

  return (
    <div className="course-details-page">
      <div className="course-header">
        <div className="header-content">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="instructor-badge">
            Instructor: <strong>{course.instructor}</strong>
          </div>
        </div>
      </div>

      <div className="course-layout">
        <div className="main-col">
          {isEnrolled ? (
            <div className="video-player">
              {course.lessons.find(l => l.id === activeLesson)?.videoUrl ? (
                <iframe 
                  width="100%" 
                  height="450" 
                  src={course.lessons.find(l => l.id === activeLesson)?.videoUrl} 
                  title="Video Player"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="placeholder-video">Select a lesson to start watching</div>
              )}
            </div>
          ) : (
            <div className="preview-card">
              <img src={course.image} alt={course.title} />
              <div className="preview-overlay">
                <Lock size={48} />
                <p>Enroll to access course content</p>
              </div>
            </div>
          )}

          <div className="course-info-tabs">
            <h3>About This Course</h3>
            <p>{course.description}</p>
          </div>
        </div>

        <div className="sidebar-col">
          <div className="enrollment-card">
            {!isEnrolled ? (
              <>
                <div className="price-display">
                  {course.discountPrice ? (
                    <>
                      <span className="big-price">${course.discountPrice}</span>
                      <span className="strike-price">${course.price}</span>
                    </>
                  ) : (
                    <span className="big-price">${course.price}</span>
                  )}
                </div>
                <button onClick={handleEnroll} className="btn btn-primary btn-block btn-lg">
                  Enroll Now
                </button>
                <p className="guarantee-text">30-Day Money-Back Guarantee</p>
              </>
            ) : (
              <div className="enrolled-status">
                <CheckCircle className="text-success" size={24} />
                <span>You are enrolled</span>
              </div>
            )}
            
            <div className="curriculum-list">
              <h4>Course Curriculum</h4>
              {course.lessons.map((lesson, idx) => (
                <div 
                  key={lesson.id} 
                  className={`curriculum-item ${activeLesson === lesson.id ? 'active' : ''} ${!isEnrolled ? 'locked' : ''}`}
                  onClick={() => isEnrolled && setActiveLesson(lesson.id)}
                >
                  <div className="item-left">
                    {isEnrolled ? <Play size={14} /> : <Lock size={14} />}
                    <span>{idx + 1}. {lesson.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;