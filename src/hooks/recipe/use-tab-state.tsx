
import { useState } from 'react';

export const useTabState = () => {
  const [activeTab, setActiveTab] = useState<string>('convert');

  return {
    activeTab,
    setActiveTab,
  };
};
