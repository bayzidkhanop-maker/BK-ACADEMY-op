import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Course } from './types';
import { Search } from 'lucide-react';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('bk_courses');
    if (stored) setCourses(JSON.parse(stored));
  }, []);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="courses-page">
      <div className="courses-hero">
        <h1>Explore Our Courses</h1>
        <p>Advance your career with top-tier tech education.</p>
        <div className="search-bar">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for a course..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="courses-grid-container">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div key={course.id} className="public-course-card">
              <div className="card-image" style={{ backgroundImage: `url(${course.image})` }}>
                {course.discountPrice && (
                  <span className="badge-sale">Sale</span>
                )}
              </div>
              <div className="card-body">
                <h3>{course.title}</h3>
                <p className="instructor">By {course.instructor}</p>
                <p className="description">{course.description.substring(0, 80)}...</p>
                <div className="card-footer">
                  <div className="price-tag">
                    {course.discountPrice ? (
                      <>
                        <span className="original-price">${course.price}</span>
                        <span className="current-price">${course.discountPrice}</span>
                      </>
                    ) : (
                      <span className="current-price">${course.price}</span>
                    )}
                  </div>
                  <Link to={`/course/${course.id}`} className="btn btn-outline-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No courses found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Courses;