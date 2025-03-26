
import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Our Recipe App</h1>
      <p className="mb-4">
        This app helps you manage and convert recipes using AI technology.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recipe Converter</h2>
          <p className="mb-4">
            Convert any recipe text into a structured format using our AI-powered recipe converter.
          </p>
          <a 
            href="/recipe-converter" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Try Recipe Converter
          </a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
          <p className="mb-4">
            Get help with your cooking questions and recipe adaptations from our AI assistant.
          </p>
          <a 
            href="/ai" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Chat with AI
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
