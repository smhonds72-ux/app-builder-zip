import { createGroq } from '@ai-sdk/groq';
import { generateText, streamText } from 'ai';
import { dataService } from './dataService';
import * as mockData from './mockData';

// Initialize Groq client
const groq = createGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
});

// System prompt generator for Coach Henry
async function getHenrySystemPrompt() {
  console.log('📊 Fetching current team data for AI context...');
  
  try {
    const isLiveMode = dataService.getLiveMode();
    
    // Use enhanced metrics when available
    const teamStats = isLiveMode 
      ? await dataService.getEnhancedTeamStats()
      : await dataService.getTeamStats();
      
    const playerStats = isLiveMode 
      ? await dataService.getEnhancedPlayerStats()
      : await dataService.getPlayerStats();
      
    const recentMatches = await dataService.getRecentMatches(3);

    const dataSource = isLiveMode ? 'LIVE GRID DATA' : 'MOCK DATA';
    
    // Build enhanced context with GRID metrics
    let teamContext = '';
    let playerContext = '';
    
    if (isLiveMode && 'paceScore' in teamStats) {
      // Enhanced GRID metrics available
      teamContext = `
Advanced Team Metrics (${dataSource}):
- Team Win Rate: ${teamStats.winRate}% (${teamStats.winRateChange > 0 ? '+' : ''}${teamStats.winRateChange}% change)
- Average K/D: ${teamStats.avgKD} (${teamStats.kdChange > 0 ? '+' : ''}${teamStats.kdChange} change)
- Clutch Rate: ${teamStats.clutchRate}% (${teamStats.clutchChange > 0 ? '+' : ''}${teamStats.clutchChange}% change)
- Pace Score: ${(teamStats as any).paceScore * 100}% (team tempo and round timing efficiency)
- Objective Score: ${(teamStats as any).objectiveScore * 100}% (map control to objective conversion)
- Communication Score: ${(teamStats as any).communicationScore * 100}% (team coordination effectiveness)
- Economy Score: ${(teamStats as any).economyScore * 100}% (economic management efficiency)
- Decision Skew Variance (DSV): ${(teamStats as any).dsvTeam} (decision quality under pressure, lower is better)
- Tempo Leak: ${(teamStats as any).tempoLeakTeam} (pace deviation from optimal, lower is better)
- Objective Pressure Efficiency (OPE): ${(teamStats as any).opeTeam} (objective conversion efficiency)
- Opening Success Rate: ${(teamStats as any).openingSuccessRate}% (first engagement success)
- Retake Success Rate: ${(teamStats as any).retakeSuccessRate}% (site retake efficiency)`;
      
      playerContext = playerStats.map((p: any) => {
        const enhanced = p as any;
        return `- ${enhanced.name} (${enhanced.role}): Rating ${enhanced.rating}, K/D ${enhanced.kd}, ACS ${enhanced.acs}
  • DSV: ${enhanced.dsv} (decision variance under pressure)
  • Tempo Leak: ${enhanced.tempoLeak} (round timing efficiency)
  • OPE: ${enhanced.ope} (objective pressure efficiency)
  • Clutch Factor: ${enhanced.clutchFactor} (clutch situation performance)
  • Economy Efficiency: ${enhanced.economyEfficiency} (economic management)
  • Map Control: ${enhanced.mapControlScore} (positioning and control)
  • Combat Stats: ${enhanced.kills}K/${enhanced.deaths}D/${enhanced.assists}A`;
      }).join('\n');
    } else {
      // Standard metrics
      teamContext = `
Basic Team Metrics (${dataSource}):
- Team Win Rate: ${teamStats.winRate}% (${teamStats.winRateChange > 0 ? '+' : ''}${teamStats.winRateChange}% change)
- Average K/D: ${teamStats.avgKD} (${teamStats.kdChange > 0 ? '+' : ''}${teamStats.kdChange} change)
- Clutch Rate: ${teamStats.clutchRate}% (${teamStats.clutchChange > 0 ? '+' : ''}${teamStats.clutchChange}% change)
- Practice Hours This Week: ${teamStats.practiceHours} (${teamStats.practiceChange > 0 ? '+' : ''}${teamStats.practiceChange}h change)`;
      
      playerContext = playerStats.map(p => 
        `- ${p.name} (${p.role}): Rating ${p.rating}, K/D ${p.kd}, ACS ${p.acs}, Status: ${p.status}`
      ).join('\n');
    }
    
    return `You are Henry, an elite AI esports coaching assistant for LIVEWIRE platform. You specialize in competitive gaming analysis, strategy development, and player performance optimization using advanced GRID metrics.

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
- Advanced metrics interpretation (DSV, Tempo Leak, OPE)

${teamContext}

Roster Performance:
${playerContext}

Recent Match Results:
${recentMatches.map(m => `- vs ${m.opponent}: ${m.result} (${m.score}) on ${m.map} - ${m.date}`).join('\n')}

${isLiveMode ? `
GRID Metrics Analysis Guide:
- DSV (Decision Skew Variance): Lower values indicate more consistent decision-making under pressure
- Tempo Leak: Lower values show better round timing and pace management
- OPE (Objective Pressure Efficiency): Higher values indicate better conversion of map control to objectives
- Clutch Factor: Higher values show better performance in high-pressure situations
- Economy Efficiency: Higher values indicate better economic management and utility usage
- Map Control Score: Higher values show better positioning and map control effectiveness

When analyzing performance, reference these specific metrics and provide actionable insights based on the data. Focus on patterns, trends, and specific areas for improvement using the GRID metrics when available.
` : ''}

Always provide specific, actionable advice based on the context. Reference specific players, matches, and statistics when relevant. Be concise but thorough. When GRID metrics are available, use them to provide deeper insights about decision-making, tempo, and objective efficiency. IMPORTANT: Always provide specific, actionable advice based on the ${dataSource.toLowerCase()}. Reference specific players, matches, and statistics when relevant. Be concise but thorough. If using mock data, mention that recommendations are based on simulated scenarios.`;
  } catch (error) {
    console.error('❌ Error fetching data for AI prompt:', error);
    return `You are Henry, an elite AI esports coaching assistant for LIVEWIRE platform. I'm currently having trouble accessing the latest team data, but I can still provide general strategic advice based on your questions. Please note that my recommendations may not reflect your team's current performance metrics.`;
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function chatWithHenry(
    messages: ChatMessage[],
    onStream?: (text: string) => void
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const isLiveMode = dataService.getLiveMode();
  
  // Always try to get real-time data for system prompt
  const systemPrompt = await getHenrySystemPrompt();

  // Check if we should use live AI
  const shouldUseLiveAI = apiKey && 
    apiKey !== 'placeholder' && 
    isLiveMode && 
    apiKey.startsWith('gsk_');

  if (!shouldUseLiveAI) {
    console.log('🤖 Using mock AI response - API key missing or not in live mode');
    return getMockResponse(messages[messages.length - 1]?.content || '');
  }

  console.log('🚀 Using live Groq AI with real-time data');
  
  try {
    if (onStream) {
      // Use streaming
      const { textStream } = await streamText({
        model: groq('llama-3.3-70b-versatile'),
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: 1000,
        temperature: 0.7,
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
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: 1000,
        temperature: 0.7,
      });
      return text;
    }
  } catch (error) {
    console.error('❌ Error calling Groq API:', error);
    console.log('🔄 Falling back to mock response');
    return getMockResponse(messages[messages.length - 1]?.content || '');
  }
}

// Mock responses for when API is not available
function getMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  const { mockTeamStats, mockPlayerStats, mockRecentMatches } = mockData;

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
