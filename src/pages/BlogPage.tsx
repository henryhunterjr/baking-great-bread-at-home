
import React from 'react';

const BlogPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((id) => (
          <div key={id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Blog Post {id}</h2>
            <p className="text-gray-600 mb-4">
              This is a sample blog post description. Click to read more.
            </p>
            <a 
              href={`/blog/${id}`} 
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Read more →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
