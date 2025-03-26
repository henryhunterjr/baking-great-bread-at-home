
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-600 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
