import { motion } from 'framer-motion';
import { Mic, Send, Sparkles, Brain, TrendingUp, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { chatWithHenry, ChatMessage } from '@/lib/henryAI';
import { useDataMode } from '@/contexts/DataContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What are our win conditions against Team Liquid?",
  "Analyze Blaber's jungle pathing this week",
  "What draft adjustments should we make?",
  "Compare our early game to top LCS teams",
];

export default function CoachHenry() {
  const { isLiveMode } = useDataMode();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello Coach! I'm Henry, your AI assistant. I've analyzed your recent matches and I'm ready to help with strategy, player development, or match preparation. What would you like to discuss?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    // Create a placeholder message for streaming
    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }]);

    try {
      // Build chat history for context
      const chatHistory: ChatMessage[] = messages
        .filter(m => m.role !== 'assistant' || m.content !== '')
        .map(m => ({ role: m.role, content: m.content }));
      chatHistory.push({ role: 'user', content: userInput });

      // Use streaming to update the message in real-time
      await chatWithHenry(chatHistory, (streamedText) => {
        setMessages(prev => prev.map(m => 
          m.id === aiMessageId 
            ? { ...m, content: streamedText }
            : m
        ));
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => prev.map(m => 
        m.id === aiMessageId 
          ? { ...m, content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment." }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-wide">
            COACH HENRY
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered strategic insights and analysis
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-status-success/10 border border-status-success/30">
          <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          <span className="text-sm font-mono text-status-success">HENRY ONLINE</span>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30 overflow-hidden"
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' && "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  message.role === 'assistant' 
                    ? "bg-gradient-to-br from-primary to-brand-blue" 
                    : "bg-secondary"
                )}>
                  {message.role === 'assistant' ? (
                    <Brain className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <span className="text-sm font-bold text-foreground">C</span>
                  )}
                </div>
                <div className={cn(
                  "max-w-[80%] p-4 rounded-xl",
                  message.role === 'assistant' 
                    ? "bg-secondary/50 border border-primary/20" 
                    : "bg-primary/20 border border-primary/30"
                )}>
                  {message.content ? (
                    <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-muted-foreground text-sm">Henry is thinking...</span>
                    </div>
                  )}
                  {message.content && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-primary/20">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="border-primary/30 hover:bg-primary/10">
                <Mic className="w-4 h-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask Henry anything about your team..."
                className="flex-1 bg-secondary/50 border-primary/20"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                className="bg-primary hover:bg-primary/90"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-80 space-y-4 hidden lg:block"
        >
          {/* Suggested Questions */}
          <div className="p-4 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-display font-bold text-foreground text-sm">SUGGESTED QUESTIONS</h3>
            </div>
            <div className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="w-full text-left p-3 rounded-lg bg-secondary/30 border border-primary/10 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="font-display font-bold text-foreground text-sm">QUICK INSIGHTS</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-status-success/10 border border-status-success/20">
                <p className="text-xs text-status-success font-medium">Win streak: 4 games</p>
              </div>
              <div className="p-3 rounded-lg bg-status-warning/10 border border-status-warning/20">
                <p className="text-xs text-status-warning font-medium">Next match in 2 hours</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs text-primary font-medium">12 VODs pending review</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
