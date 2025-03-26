
import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="max-w-3xl mx-auto prose">
        <p>Last Updated: June 1, 2023</p>
        
        <h2>1. Introduction</h2>
        <p>
          Welcome to our Recipe App. By using our service, you agree to these Terms of Service.
          Please read them carefully.
        </p>
        
        <h2>2. Using Our Services</h2>
        <p>
          You must follow any policies made available to you within the Services.
          Don't misuse our Services. For example, don't interfere with our Services or try to access them using a method other than the interface and the instructions that we provide.
        </p>
        
        <h2>3. Your Content</h2>
        <p>
          When you upload, submit, store, send or receive content to or through our Services, you give us a license to use, host, store, reproduce, and create derivative works.
          The rights you grant in this license are for the limited purpose of operating, promoting, and improving our Services, and to develop new ones.
        </p>
        
        <h2>4. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at terms@recipeapp.com.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
