import React from 'react';
import { useAuth } from './AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-placeholder">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h2>{user?.name}</h2>
          <p className="role-badge">{user?.role}</p>
        </div>
        
        <div className="profile-details">
          <div className="detail-group">
            <label>Email Address</label>
            <div className="detail-value">{user?.email}</div>
          </div>
          <div className="detail-group">
            <label>Member Since</label>
            <div className="detail-value">August 2024</div>
          </div>
          <div className="detail-group">
            <label>Enrolled Courses</label>
            <div className="detail-value">{user?.enrolledCourses.length || 0}</div>
          </div>
        </div>

        <div className="profile-actions">
            <button className="btn btn-primary">Edit Profile</button>
            <button className="btn btn-outline">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;