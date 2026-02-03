import React, { useState, useEffect } from 'react';
import { Course, Lesson } from './types';
import { Plus, Trash2, Edit, Save } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  
  // Load courses
  useEffect(() => {
    const stored = localStorage.getItem('bk_courses');
    if (stored) setCourses(JSON.parse(stored));
  }, []);

  const saveToStorage = (updatedCourses: Course[]) => {
    localStorage.setItem('bk_courses', JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const updated = courses.filter(c => c.id !== id);
      saveToStorage(updated);
    }
  };

  const handleEdit = (course: Course) => {
    setCurrentCourse(course);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentCourse({
      id: Date.now().toString(),
      lessons: [],
      image: 'https://picsum.photos/400/250'
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse.title || !currentCourse.price) return;

    let updatedCourses;
    if (courses.find(c => c.id === currentCourse.id)) {
      // Update
      updatedCourses = courses.map(c => c.id === currentCourse.id ? currentCourse as Course : c);
    } else {
      // Create
      updatedCourses = [...courses, currentCourse as Course];
    }
    
    saveToStorage(updatedCourses);
    setIsEditing(false);
    setCurrentCourse({});
  };

  // Lesson Management within Course Form
  const addLesson = () => {
    const newLesson: Lesson = { id: Date.now().toString(), title: 'New Lesson', videoUrl: '' };
    setCurrentCourse({
      ...currentCourse,
      lessons: [...(currentCourse.lessons || []), newLesson]
    });
  };

  const updateLesson = (index: number, field: keyof Lesson, value: string) => {
    const updatedLessons = [...(currentCourse.lessons || [])];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setCurrentCourse({ ...currentCourse, lessons: updatedLessons });
  };

  const removeLesson = (index: number) => {
    const updatedLessons = [...(currentCourse.lessons || [])];
    updatedLessons.splice(index, 1);
    setCurrentCourse({ ...currentCourse, lessons: updatedLessons });
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={18} /> Add New Course
        </button>
      </div>

      {isEditing ? (
        <div className="admin-form-container">
          <h2>{courses.find(c => c.id === currentCourse.id) ? 'Edit Course' : 'Create Course'}</h2>
          <form onSubmit={handleSave} className="admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Title</label>
                <input 
                  value={currentCourse.title || ''} 
                  onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Instructor</label>
                <input 
                  value={currentCourse.instructor || ''} 
                  onChange={e => setCurrentCourse({...currentCourse, instructor: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input 
                  type="number"
                  value={currentCourse.price || ''} 
                  onChange={e => setCurrentCourse({...currentCourse, price: Number(e.target.value)})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Discount Price ($)</label>
                <input 
                  type="number"
                  value={currentCourse.discountPrice || ''} 
                  onChange={e => setCurrentCourse({...currentCourse, discountPrice: Number(e.target.value)})}
                />
              </div>
              <div className="form-group full-width">
                <label>Image URL</label>
                <input 
                  value={currentCourse.image || ''} 
                  onChange={e => setCurrentCourse({...currentCourse, image: e.target.value})}
                />
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea 
                  rows={4}
                  value={currentCourse.description || ''} 
                  onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})}
                />
              </div>
            </div>

            <div className="lessons-section">
              <div className="lessons-header">
                <h3>Lessons</h3>
                <button type="button" className="btn btn-sm btn-outline" onClick={addLesson}>Add Lesson</button>
              </div>
              {currentCourse.lessons?.map((lesson, idx) => (
                <div key={lesson.id} className="lesson-row">
                  <input 
                    placeholder="Lesson Title"
                    value={lesson.title}
                    onChange={e => updateLesson(idx, 'title', e.target.value)}
                  />
                  <input 
                    placeholder="YouTube Embed URL"
                    value={lesson.videoUrl || ''}
                    onChange={e => updateLesson(idx, 'videoUrl', e.target.value)}
                  />
                  <button type="button" className="btn-icon danger" onClick={() => removeLesson(idx)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary"><Save size={16} /> Save Course</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Instructor</th>
                <th>Price</th>
                <th>Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.instructor}</td>
                  <td>${course.price}</td>
                  <td>-</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleEdit(course)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDelete(course.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;