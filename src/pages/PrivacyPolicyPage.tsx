
import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="max-w-3xl mx-auto prose">
        <p>Last Updated: June 1, 2023</p>
        
        <h2>1. Introduction</h2>
        <p>
          This Privacy Policy describes how we collect, use, and handle your information when you use our services.
          We take your privacy seriously and are committed to protecting your personal information.
        </p>
        
        <h2>2. Information We Collect</h2>
        <p>
          We collect information to provide better services to our users. This includes:
        </p>
        <ul>
          <li>Account information: When you create an account, we collect your name, email address, and password.</li>
          <li>Recipe data: The recipes you create, convert, or save.</li>
          <li>Usage data: How you interact with our services, including features you use and time spent on the app.</li>
        </ul>
        
        <h2>3. How We Use Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services, including:
        </p>
        <ul>
          <li>Providing and personalizing our services</li>
          <li>Improving our AI recipe conversion technology</li>
          <li>Communicating with you about our services</li>
        </ul>
        
        <h2>4. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@recipeapp.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
