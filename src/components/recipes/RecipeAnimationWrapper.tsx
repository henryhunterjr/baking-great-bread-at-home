
import React, { useEffect, useRef } from 'react';

interface RecipeAnimationWrapperProps {
  children: React.ReactNode;
}

const RecipeAnimationWrapper: React.FC<RecipeAnimationWrapperProps> = ({ children }) => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  // Observer setup for animations
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    };
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe sections
    sectionRefs.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {React.Children.map(children, (child, index) => (
        <div ref={(el) => sectionRefs.current[index] = el as HTMLElement}>
          {child}
        </div>
      ))}
    </>
  );
};

export default RecipeAnimationWrapper;
