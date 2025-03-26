
import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <div className="max-w-3xl mx-auto">
        <p className="mb-4">
          Welcome to our Recipe App! We're passionate about making cooking easier and more accessible.
        </p>
        <p className="mb-4">
          Our app uses AI technology to help you convert recipes from any format into a structured, easy-to-follow format.
          Whether you have a handwritten recipe, a PDF, or a screenshot, our AI can process it and convert it into a usable recipe.
        </p>
        <p className="mb-4">
          We also provide an AI assistant to help answer cooking questions, suggest substitutions, and provide tips for your recipes.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="mb-4">
          Our mission is to make cooking more accessible and enjoyable for everyone, regardless of their skill level.
          We believe that good food brings people together, and we want to help you create delicious meals with confidence.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
