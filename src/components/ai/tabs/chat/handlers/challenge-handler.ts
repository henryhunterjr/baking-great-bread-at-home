
import { ChatMessage } from '../../../utils/types';
import { getCurrentChallenge } from '../../../utils/helpers';
import { challengeImages, DEFAULT_CHALLENGE_IMAGE } from '@/data/challengeImages';

// Handle baking challenge requests
export const handleChallengeRequest = async (
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsProcessing: (value: boolean) => void
): Promise<void> => {
  const challenge = getCurrentChallenge();
  
  // Get the challenge image from the mapping or use default
  const imageUrl = challenge.id && challengeImages[challenge.id] 
    ? challengeImages[challenge.id] 
    : DEFAULT_CHALLENGE_IMAGE;
  
  const challengeMessage: ChatMessage = {
    role: 'assistant',
    content: "Here's our current baking challenge. Join in and master the art of reading your dough!",
    timestamp: new Date(),
    attachedChallenge: {
      ...challenge,
      imageUrl: imageUrl,
      link: challenge.link || '#',
      isCurrent: true
    }
  };
  
  setMessages(prev => [...prev, challengeMessage]);
  setIsProcessing(false);
};
