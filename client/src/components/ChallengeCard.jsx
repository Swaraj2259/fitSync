// ChallengeCard component
import React from 'react';
import { Link } from 'react-router-dom';

const getChallengeImage = (title) => {
  const t = title.toLowerCase();
  // Running - Man running on track
  if (t.includes('run') || t.includes('marathon')) return 'https://images.unsplash.com/photo-1452626038306-3a27432b698b?auto=format&fit=crop&w=800&q=80';
  // Walking - Shoes on pavement
  if (t.includes('walk') || t.includes('step')) return 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80';
  // Yoga - Woman in pose
  if (t.includes('yoga') || t.includes('meditat')) return 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80';
  // Cycling - Cyclist on road
  if (t.includes('cycl') || t.includes('bike')) return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80';
  // Swimming - Pool lane
  if (t.includes('swim')) return 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80';
  // Gym/Workout - Weights
  if (t.includes('gym') || t.includes('lift') || t.includes('workout')) return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
  // Generic - Gym interior
  return 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80';
};

export default function ChallengeCard({ challenge }){
  const formattedDate = new Date(challenge.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const now = new Date();
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  
  let status = 'Active';
  let statusClass = 'status-active';

  if (endDate < now) {
    status = 'Completed';
    statusClass = 'status-completed';
  } else if (startDate > now) {
    status = 'Upcoming';
    statusClass = 'status-upcoming';
  }

  const imageUrl = getChallengeImage(challenge.title);
  const isClickable = status === 'Active';

  return (
    <Link 
      to={isClickable ? `/challenges/${challenge._id}` : '#'} 
      className="challenge-card" 
      style={{ 
        textDecoration: 'none', 
        color: 'inherit',
        cursor: isClickable ? 'pointer' : 'default'
      }}
      onClick={(e) => !isClickable && e.preventDefault()}
    >
      <div className="challenge-image-container">
        <img 
          src={imageUrl} 
          alt={challenge.title} 
          className="challenge-image"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <span className={`challenge-status-badge ${statusClass}`}>{status}</span>
      </div>

      <div className="challenge-content">
        <h4 className="challenge-title">
          {challenge.title}
        </h4>
        
        <div className="challenge-description">
          {challenge.description}
        </div>
        
        <div className="challenge-meta">
          <div className="challenge-date">
            <span>Starts: {formattedDate}</span>
          </div>
          {isClickable && (
            <span className="challenge-link-btn">
              View Details
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}