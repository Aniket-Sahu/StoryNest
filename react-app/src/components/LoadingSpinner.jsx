import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClass = size === 'small' ? 'spinner-small' : size === 'large' ? 'spinner-large' : 'spinner-medium';

  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass}`}></div>
    </div>
  );
};

export default LoadingSpinner;
