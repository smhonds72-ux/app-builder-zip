import { createGroq } from '@ai-sdk/groq';
import { generateText, streamText } from 'ai';
import { mockTeamStats, mockPlayerStats, mockRecentMatches } from './mockData';

// Initialize Groq client
const groq = createGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
});

// System prompt for Coach Henry
const HENRY_SYSTEM_PROMPT = `You are Henry, an elite AI esports coaching assistant for LIVEWIRE platform. You specialize in competitive gaming analysis, strategy development, and player performance optimization.

Your personality:
- Professional but approachable
- Data-driven and analytical
- Supportive and constructive
- Focused on actionable insights

Your capabilities:
- Match analysis and VOD review insights
- Strategy and draft recommendations
- Player performance tracking and improvement suggestions
- Team synergy and communication analysis
- Opponent scouting and preparation
- Mental game and tilt management advice

Current team context:
- Team Win Rate: ${mockTeamStats.winRate}%
- Average K/D: ${mockTeamStats.avgKD}
- Clutch Rate: ${mockTeamStats.clutchRate}%
- Practice Hours This Week: ${mockTeamStats.practiceHours}

Roster:
${mockPlayerStats.map(p => `- ${p.name} (${p.role}): Rating ${p.rating}, K/D ${p.kd}`).join('\n')}

Recent Matches:
${mockRecentMatches.slice(0, 3).map(m => `- vs ${m.opponent}: ${m.result} (${m.score}) on ${m.map}`).join('\n')}

Always provide specific, actionable advice based on the context. Reference specific players, matches, and statistics when relevant. Be concise but thorough.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function chatWithHenry(
  messages: ChatMessage[],
  onStream?: (text: string) => void
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    // Fallback to mock response if no API key
    return getMockResponse(messages[messages.length - 1]?.content || '');
  }

  try {
    if (onStream) {
      // Use streaming
      const { textStream } = await streamText({
        model: groq('llama-3.3-70b-versatile'),
        system: HENRY_SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      });

      let fullText = '';
      for await (const delta of textStream) {
        fullText += delta;
        onStream(fullText);
      }
      return fullText;
    } else {
      // Non-streaming
      const { text } = await generateText({
        model: groq('llama-3.3-70b-versatile'),
        system: HENRY_SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      });
      return text;
    }
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return getMockResponse(messages[messages.length - 1]?.content || '');
  }
}

// Mock responses for when API is not available
function getMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('win') || lowerMessage.includes('strategy')) {
    return `Based on my analysis of your recent matches, I've identified several key win conditions:

**1. Early Game Dominance**
Your team excels when you secure early advantages. With a ${mockTeamStats.winRate}% win rate, I notice wins correlate strongly with first blood and early objective control.

**2. Player Synergy**
${mockPlayerStats[0].name} is performing exceptionally with a ${mockPlayerStats[0].rating} rating. Consider building strategies around their aggressive playstyle.

**3. Map Control**
On Ascent and Haven, your attack rounds show 15% higher success rate. I recommend prioritizing these maps in your upcoming matches.

Would you like me to dive deeper into any of these areas?`;
  }

  if (lowerMessage.includes('player') || lowerMessage.includes('performance')) {
    return `Here's a breakdown of your roster performance:

**Top Performers:**
• ${mockPlayerStats[0].name} - Rating: ${mockPlayerStats[0].rating} | K/D: ${mockPlayerStats[0].kd}
  Excellent fragging power, but could improve utility usage

• ${mockPlayerStats[1].name} - Rating: ${mockPlayerStats[1].rating} | K/D: ${mockPlayerStats[1].kd}
  Consistent initiator play with high KAST

**Areas for Development:**
• ${mockPlayerStats[3].name} could focus on more aggressive smoke placements
• Team coordination on retakes needs work

Would you like specific drill recommendations for any player?`;
  }

  if (lowerMessage.includes('match') || lowerMessage.includes('opponent')) {
    return `Analyzing your recent match history:

**Last 5 Matches:**
${mockRecentMatches.map(m => `• vs ${m.opponent}: ${m.result} (${m.score}) - ${m.map}`).join('\n')}

**Key Observations:**
1. Strong performance on Ascent and Bind
2. Split continues to be a challenge - consider additional practice
3. Round conversions improved by 8% this week

**Upcoming Preparation:**
Based on likely opponents, I recommend focusing on anti-eco round setups and default executes.

Want me to prepare a specific opponent analysis?`;
  }

  return `I've reviewed your query and here's my analysis:

Your team is currently performing at a high level with a ${mockTeamStats.winRate}% win rate. The ${mockTeamStats.practiceHours} practice hours this week show good dedication.

**Quick Recommendations:**
1. Continue building on your winning momentum
2. Focus on communication during clutch situations (${mockTeamStats.clutchRate}% clutch rate)
3. Consider reviewing the NRG loss for improvement opportunities

What specific aspect would you like me to elaborate on?`;
}
