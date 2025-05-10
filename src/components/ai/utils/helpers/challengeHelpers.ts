
import { ChallengeInfo } from '../types';

/**
 * Get the current baking challenge
 * @returns The current baking challenge
 */
export const getCurrentChallenge = (): ChallengeInfo => {
  // Hard-code the May 2025 Foolproof challenge as current
  return {
    id: 'may-2025',
    title: 'May #FOOLPROOF Challenge',
    description: 'Mastering the Art of Reading Your Dough - Join us this May for the #Foolproof Challenge, a journey designed to deepen your understanding of bread-making by focusing on the subtle cues your dough provides.',
    dueDate: new Date(2025, 5, 1).toISOString(), // Due June 1, 2025
    link: 'https://baking-great-bread-uq6ilex.gamma.site/untitled'
  };
};
