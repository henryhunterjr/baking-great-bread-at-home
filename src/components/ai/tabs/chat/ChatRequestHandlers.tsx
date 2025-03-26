
import { ChatMessage } from '../../utils/types';
import {
  handleRecipeRequest,
  handleBookRequest,
  handleChallengeRequest,
  handleConvertRequest,
  handleGenerateRequest,
  handleGeneralRequest
} from './handlers';

// Re-export all handlers for backward compatibility
export {
  handleRecipeRequest,
  handleBookRequest,
  handleChallengeRequest,
  handleConvertRequest,
  handleGenerateRequest,
  handleGeneralRequest
};
