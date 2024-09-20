import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="border p-4 min-h-[150px] animate-pulse bg-gray-100">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
