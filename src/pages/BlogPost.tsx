
import React from 'react';
import { useParams } from 'react-router-dom';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Blog Post {id}</h1>
        <div className="text-gray-500 mb-6">Published on June 1, 2023</div>
        <div className="prose max-w-none">
          <p className="mb-4">
            This is a sample blog post content. In a real application, this would be fetched from a database or API.
          </p>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. 
            Cras porttitor augue a venenatis malesuada. Curabitur auctor vel orci eu consectetur.
          </p>
          <p className="mb-4">
            Curabitur ac enim dictum arcu varius fermentum vel sodales dui. Praesent a consectetur erat. Aenean 
            eu purus vitae tellus fringilla eleifend sit amet non urna.
          </p>
        </div>
        <div className="mt-8">
          <a 
            href="/blog" 
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            ← Back to Blog
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
