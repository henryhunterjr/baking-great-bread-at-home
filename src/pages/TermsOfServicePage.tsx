
import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="max-w-3xl mx-auto prose">
        <p>Last Updated: June 1, 2023</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using our service, you agree to be bound by these Terms of Service.
          If you disagree with any part of the terms, you may not access the service.
        </p>
        
        <h2>2. Use of Services</h2>
        <p>
          Our services are designed to help you convert and manage recipes. You may use our services only as permitted
          by these terms and any applicable laws.
        </p>
        
        <h2>3. User Accounts</h2>
        <p>
          When you create an account with us, you must provide accurate and complete information.
          You are responsible for safeguarding your account and for any activities or actions under your account.
        </p>
        
        <h2>4. Content</h2>
        <p>
          Our service allows you to post, link, store, share and otherwise make available certain information, text,
          graphics, or other material. You are responsible for the content that you post.
        </p>
        
        <h2>5. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will provide notice of significant changes.
          Your continued use of the service after such modifications constitutes your acceptance of the new terms.
        </p>
        
        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at terms@recipeapp.com.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
