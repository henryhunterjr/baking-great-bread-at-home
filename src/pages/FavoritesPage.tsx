
import React from 'react';

const FavoritesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <p className="text-gray-600">
          This is where your favorite recipes will be stored. You haven't saved any favorites yet.
        </p>
      </div>
      <div className="flex justify-center">
        <a 
          href="/recipe-converter" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Convert a Recipe
        </a>
      </div>
    </div>
  );
};

export default FavoritesPage;
