
import React, { useState, useEffect, useRef } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { ChatMessage } from './types/chat';
import { useToast } from '@/hooks/use-toast';
import { logInfo, logError } from '@/utils/logger';

interface RecipeAssistantProps {
  recipe: RecipeData;
  onHelp?: () => void;
}

const RecipeAssistant: React.FC<RecipeAssistantProps> = ({ recipe, onHelp }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Add welcome message when component mounts or recipe changes
  useEffect(() => {
    if (recipe?.title) {
      const welcomeMessage = {
        role: 'assistant',
        content: `I see you're working with "${recipe.title}". I can help with any questions about this recipe, suggest modifications, or assist with techniques mentioned in it. Just ask!`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } else {
      const introMessage = {
        role: 'assistant',
        content: 'Hello! I\'m your bread baking assistant. I can help with recipes, techniques, troubleshooting, or answer any baking questions you might have. What would you like to know?',
        timestamp: new Date()
      };
      setMessages([introMessage]);
    }
  }, [recipe?.title]);
  
  // Scroll to bottom of messages whenever they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = { 
      role: 'user', 
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Show progressive loading states
      setLoadingStage('Analyzing your question...');
      
      setTimeout(() => {
        if (isLoading) setLoadingStage('Searching for relevant information...');
      }, 1500);
      
      setTimeout(() => {
        if (isLoading) setLoadingStage('Preparing your answer...');
      }, 3000);
      
      logInfo('Sending request to assistant API', { message: inputMessage, recipe: recipe?.title });
      
      // Send to API with recipe context
      const response = await fetch('/api/ask-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          recipeContext: recipe,
          chatHistory: messages.slice(-6), // Last 6 messages for context
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from assistant');
      }
      
      const data = await response.json();
      
      // Add assistant message to chat
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Check if the response suggests recipe modifications
      const hasModifications = 
        data.response.includes('you could modify') || 
        data.response.includes('I suggest changing') ||
        data.response.includes('you might try adjusting') ||
        data.response.includes('try increasing') ||
        data.response.includes('try decreasing') ||
        data.response.includes('you could substitute') ||
        data.response.includes('recommend adding');
      
      // Offer to apply modifications if suggested
      if (hasModifications && recipe) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Would you like me to apply these suggestions to your recipe?',
            timestamp: new Date(),
            actions: [
              { label: 'Apply Changes', value: 'apply' },
              { label: 'No Thanks', value: 'ignore' }
            ]
          }]);
        }, 1000);
      }
      
    } catch (error) {
      logError('Error getting AI response', { error });
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while processing your request. Please try again in a moment.',
        timestamp: new Date()
      }]);
      
      toast({
        title: "Assistant Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };
  
  // Handle action button clicks
  const handleActionClick = async (action: string, messageIndex: number) => {
    if (action === 'apply' && recipe) {
      // Get the modification suggestion from the previous message
      const modificationMessage = messages[messageIndex - 1].content;
      
      setIsLoading(true);
      setLoadingStage('Updating your recipe...');
      
      try {
        logInfo('Sending request to modify recipe', { recipe: recipe.title });
        
        // Call API to modify recipe based on suggestions
        const response = await fetch('/api/modify-recipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipe: recipe,
            suggestion: modificationMessage
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to modify recipe');
        }
        
        const data = await response.json();
        
        // Remove the action message
        const updatedMessages = [...messages];
        updatedMessages.splice(messageIndex, 1);
        
        // Add confirmation message
        updatedMessages.push({
          role: 'assistant',
          content: 'I\'ve prepared the recipe modifications. You can apply them in the recipe editor.',
          timestamp: new Date()
        });
        
        setMessages(updatedMessages);
        
        // Notify user about the modifications
        toast({
          title: "Recipe Modified",
          description: "Suggested changes have been prepared for your review.",
          variant: "default"
        });
        
      } catch (error) {
        logError('Error modifying recipe', { error });
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I couldn\'t apply those changes automatically. You can make them manually in the recipe editor.',
          timestamp: new Date()
        }]);
        
        toast({
          title: "Modification Error",
          description: "Failed to apply changes to the recipe.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        setLoadingStage('');
      }
    } else if (action === 'ignore') {
      // Remove the action message
      const updatedMessages = [...messages];
      updatedMessages.splice(messageIndex, 1);
      setMessages(updatedMessages);
    }
  };
  
  return (
    <div className="recipe-assistant bg-card text-card-foreground p-4 rounded-lg shadow-sm flex flex-col h-full">
      <h2 className="text-xl font-medium mb-4">Bread Baking Assistant</h2>
      
      <div className="messages-container flex-1 overflow-y-auto mb-4 p-2 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`${msg.role === 'user' ? 'text-right' : ''}`}
          >
            <div 
              className={`inline-block px-4 py-2 rounded-lg max-w-[85%] ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {msg.content}
              
              {msg.actions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.actions.map((action, actionIndex) => (
                    <button 
                      key={actionIndex}
                      onClick={() => handleActionClick(action.value, index)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        action.value === 'apply' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {msg.timestamp && (
              <div className="text-xs text-muted-foreground mt-1">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center">
            <div className="flex space-x-1 mr-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-sm text-muted-foreground">{loadingStage}</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container mt-auto">
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about baking techniques, recipes, or ingredients..."
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary border-input bg-background text-foreground placeholder:text-muted-foreground/60"
            disabled={isLoading}
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="p-2 bg-primary text-primary-foreground rounded-r-md disabled:opacity-50 transition-opacity"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        
        {onHelp && (
          <button 
            onClick={onHelp}
            className="text-sm text-muted-foreground hover:text-foreground mt-2 transition-colors"
          >
            Need help getting started?
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeAssistant;
