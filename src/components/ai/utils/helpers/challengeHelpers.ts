
import { ChallengeInfo } from '../types';

/**
 * Get the current baking challenge
 * @returns The current baking challenge
 */
export const getCurrentChallenge = (): ChallengeInfo => {
  // Get the current month and year
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long' }).toLowerCase();
  const year = now.getFullYear();
  
  return {
    id: `${month}-${year}`,
    title: `${month.charAt(0).toUpperCase() + month.slice(1)} Baking Challenge`,
    description: `Join our community in this month's baking challenge focused on ${month} seasonal flavors and techniques.`,
    dueDate: new Date(year, now.getMonth() + 1, 0).toISOString(), // Last day of the current month
    link: `/challenges/${month}-${year}`
  };
};
