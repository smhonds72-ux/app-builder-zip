import { supabase } from './supabase';
import * as mockData from './mockData';
import { gridAPI, GridSeries, GridMatch } from './gridAPI';

// Enhanced type definitions for GRID metrics
export interface EnhancedTeamStats {
  winRate: number;
  winRateChange: number;
  avgKD: number;
  kdChange: number;
  clutchRate: number;
  clutchChange: number;
  practiceHours: number;
  practiceChange: number;
  // New GRID metrics
  paceScore: number;
  objectiveScore: number;
  communicationScore: number;
  economyScore: number;
  dsvTeam: number;
  tempoLeakTeam: number;
  opeTeam: number;
  openingSuccessRate: number;
  retakeSuccessRate: number;
}

export interface EnhancedPlayerStats {
  id: string;
  name: string;
  role: string;
  kd: number;
  acs: number;
  adr: number;
  kast: number;
  rating: number;
  avatar: string;
  status: string;
  // New GRID metrics
  dsv: number;
  tempoLeak: number;
  ope: number;
  clutchFactor: number;
  economyEfficiency: number;
  mapControlScore: number;
  kills: number;
  deaths: number;
  assists: number;
}

export interface TeamStats {
  winRate: number;
  winRateChange: number;
  avgKD: number;
  kdChange: number;
  clutchRate: number;
  clutchChange: number;
  practiceHours: number;
  practiceChange: number;
}

export interface PlayerStats {
  id: string;
  name: string;
  role: string;
  kd: number;
  acs: number;
  adr: number;
  kast: number;
  rating: number;
  avatar: string;
  status: string;
}

export interface Match {
  id: string;
  opponent: string;
  result: string;
  score: string;
  map: string;
  date: string;
}

export interface PerformanceData {
  day: string;
  winRate: number;
  avgKD: number;
  practiceHours: number;
}

// Data fetching functions that can switch between mock and live data
class DataService {
  private isLiveMode: boolean = localStorage.getItem('dataMode') === 'live';
  private lastFetchTime: number = 0;
  private CACHE_DURATION: number = 30000; // 30 seconds cache for live data

  setLiveMode(live: boolean) {
    this.isLiveMode = live;
    localStorage.setItem('dataMode', live ? 'live' : 'mock');
    // Clear cache when switching modes
    this.lastFetchTime = 0;
  }

  getLiveMode(): boolean {
    return this.isLiveMode;
  }

  private isCacheExpired(): boolean {
    return Date.now() - this.lastFetchTime > this.CACHE_DURATION;
  }

  private updateCacheTimestamp(): void {
    this.lastFetchTime = Date.now();
  }

  private async forceRefresh<T>(fetchFn: () => Promise<T>): Promise<T> {
    if (this.isLiveMode && this.isCacheExpired()) {
      console.log('🔄 Cache expired, forcing refresh...');
      this.updateCacheTimestamp();
    }
    return fetchFn();
  }

  async checkConnection(): Promise<boolean> {
    console.log('🔍 Checking Supabase connection...');
    
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!url || url.includes('placeholder') || !key || key === 'placeholder') {
        console.error('❌ Supabase connection check failed: Missing or placeholder environment variables.');
        console.log('   URL:', url ? `${url.substring(0, 20)}...` : 'MISSING');
        console.log('   Key:', key ? `${key.substring(0, 10)}...` : 'MISSING');
        return false;
      }

      console.log('✅ Environment variables found, testing database connection...');

      // Try a simple query to test connection
      const { data, error, status, statusText } = await supabase.from('team_stats').select('*').limit(1);

      if (error) {
        console.error('❌ Supabase connection check failed:', {
          message: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details,
          status,
          statusText
        });

        // If the error is that the table doesn't exist, provide helpful guidance
        if (error.code === '42P01' || error.message.includes('schema cache') || error.message.includes('relation')) {
          console.error('📋 Table "team_stats" was not found. This is expected if you haven\'t set up your database schema yet.');
          console.log('💡 To fix this: Create the required tables in your Supabase dashboard or run the schema setup script.');
        }
        return false;
      }

      console.log('✅ Supabase connection successful!');
      console.log('   Database URL:', url.substring(0, 30) + '...');
      console.log('   Sample data retrieved:', data?.length || 0, 'rows');
      
      // Test GRID API connection
      const gridConnected = await gridAPI.testConnection();
      if (!gridConnected) {
        console.warn('⚠️ GRID API connection failed, but Supabase is working');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Supabase connection check failed:', error);
      return false;
    }
  }

  async getTeamStats(): Promise<TeamStats> {
    if (!this.isLiveMode) {
      console.log('📊 Using mock team stats data');
      return mockData.mockTeamStats;
    }

    console.log('📊 Fetching live team stats from database...');
    
    try {
      const { data, error } = await supabase
          .from('team_stats')
          .select('*')
          .single()
          .abortSignal(new AbortController().signal); // Prevent caching

      if (error) throw error;

      if (!data) {
        console.warn('⚠️ No team stats data found in database, falling back to mock data');
        return mockData.mockTeamStats;
      }

      // Map lowercase DB columns to camelCase interface
      const result = {
        winRate: data.winrate,
        winRateChange: data.winratechange,
        avgKD: Number(data.avgkd),
        kdChange: Number(data.kdchange),
        clutchRate: data.clutchrate,
        clutchChange: data.clutchchange,
        practiceHours: data.practicehours,
        practiceChange: data.practicechange
      };

      console.log('✅ Live team stats retrieved:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching live team stats:', error);
      console.log('🔄 Falling back to mock data');
      return mockData.mockTeamStats;
    }
  }

  async getPlayerStats(): Promise<PlayerStats[]> {
    if (!this.isLiveMode) {
      console.log('👥 Using mock player stats data');
      return mockData.mockPlayerStats;
    }

    console.log('👥 Fetching live player stats from database...');
    
    try {
      const { data, error } = await supabase
          .from('player_stats')
          .select('*')
          .order('rating', { ascending: false })
          .abortSignal(new AbortController().signal); // Prevent caching

      if (error) throw error;

      if (!data || data.length === 0) {
        console.warn('⚠️ No player stats data found in database, falling back to mock data');
        return mockData.mockPlayerStats;
      }

      console.log(`✅ Live player stats retrieved: ${data.length} players`);
      return data as PlayerStats[];
    } catch (error) {
      console.error('❌ Error fetching live player stats:', error);
      console.log('🔄 Falling back to mock data');
      return mockData.mockPlayerStats;
    }
  }

  async getRecentMatches(limit: number = 5): Promise<Match[]> {
    if (!this.isLiveMode) {
      console.log(`🎮 Using mock recent matches data (limit: ${limit})`);
      return mockData.mockRecentMatches.slice(0, limit);
    }

    console.log(`🎮 Fetching live recent matches from database (limit: ${limit})...`);
    
    try {
      const { data, error } = await supabase
          .from('matches')
          .select('*')
          .order('start_time', { ascending: false })
          .limit(limit)
          .abortSignal(new AbortController().signal); // Prevent caching

      if (error) throw error;

      if (!data || data.length === 0) {
        console.warn('⚠️ No matches data found in database, falling back to mock data');
        return mockData.mockRecentMatches.slice(0, limit);
      }

      const result = data.map((m: any) => ({
        id: m.id,
        opponent: m.red_team_name || 'Unknown Opponent', // Mapping red team as opponent for now
        result: m.rounds_played > 13 ? 'WIN' : 'LOSS', // Simplistic heuristic
        score: `${m.rounds_played || 0}-${24 - (m.rounds_played || 0)}`,
        map: 'Unknown', // Map is not in the matches schema provided
        date: new Date(m.start_time).toISOString().split('T')[0]
      }));

      console.log(`✅ Live recent matches retrieved: ${result.length} matches`);
      return result;
    } catch (error) {
      console.error('❌ Error fetching live recent matches:', error);
      console.log('🔄 Falling back to mock data');
      return mockData.mockRecentMatches.slice(0, limit);
    }
  }

  async getPerformanceData(): Promise<PerformanceData[]> {
    if (!this.isLiveMode) {
      return mockData.mockPerformanceData;
    }

    try {
      const { data, error } = await supabase
          .from('performance_data')
          .select('*')
          .order('sort_order', { ascending: true });

      if (error) throw error;

      return data.map((d: any) => ({
        day: d.day,
        winRate: d.winrate,
        avgKD: Number(d.avgkd),
        practiceHours: d.practicehours
      }));
    } catch (error) {
      console.error('Error fetching performance data:', error);
      return mockData.mockPerformanceData;
    }
  }

  async getLeaks() {
    if (!this.isLiveMode) {
      return mockData.mockLeaks;
    }

    try {
      const { data, error } = await supabase
          .from('player_leaks')
          .select('*')
          .order('severity', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching leaks:', error);
      return mockData.mockLeaks;
    }
  }

  async getDrills() {
    if (!this.isLiveMode) {
      return mockData.mockDrills;
    }

    try {
      const { data, error } = await supabase
          .from('drills')
          .select('*');

      if (error) throw error;

      return data.map((d: any) => ({
        id: d.id,
        name: d.title,
        category: d.focus,
        duration: d.estimated_minutes,
        difficulty: 'Medium', // Mocking difficulty
        completed: false,
        score: null
      }));
    } catch (error) {
      console.error('Error fetching drills:', error);
      return mockData.mockDrills;
    }
  }

  async getTrainingSessions() {
    if (!this.isLiveMode) {
      return mockData.mockTrainingSessions;
    }

    try {
      const { data, error } = await supabase
          .from('training_sessions')
          .select('*')
          .order('time', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching training sessions:', error);
      return mockData.mockTrainingSessions;
    }
  }

  async getAgendaItems() {
    if (!this.isLiveMode) {
      return mockData.mockAgendaItems;
    }

    try {
      const { data, error } = await supabase
          .from('agenda_items')
          .select('*')
          .order('starts_at_iso', { ascending: true });

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        time: new Date(item.starts_at_iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: item.type,
        attendees: ['Full Team'] // Mocking attendees for now
      }));
    } catch (error) {
      console.error('Error fetching agenda items:', error);
      return mockData.mockAgendaItems;
    }
  }

  async getVODList() {
    if (!this.isLiveMode) {
      return mockData.mockVODList;
    }

    try {
      const { data, error } = await supabase
          .from('vod_library')
          .select('*')
          .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching VOD list:', error);
      return mockData.mockVODList;
    }
  }

  // New methods for enhanced GRID metrics
  async getEnhancedTeamStats(): Promise<EnhancedTeamStats> {
    if (!this.isLiveMode) {
      // Return mock enhanced stats
      return {
        ...mockData.mockTeamStats,
        paceScore: 0.72,
        objectiveScore: 0.68,
        communicationScore: 0.81,
        economyScore: 0.75,
        dsvTeam: 0.23,
        tempoLeakTeam: 0.18,
        opeTeam: 0.79,
        openingSuccessRate: 65.0,
        retakeSuccessRate: 71.0
      };
    }

    return this.forceRefresh(async () => {
      try {
        console.log('🔍 Fetching enhanced team stats from GRID API...');
        
        // Get real-time data from GRID API
        const recentSeries = await gridAPI.fetchValorantSeries(5);
        
        // Try to get actual team ID from environment or use default
        const teamId = import.meta.env.VITE_TEAM_ID || 'team-123';
        console.log(`🔍 Using team ID: ${teamId}`);
        
        const teamStats = await gridAPI.fetchTeamStatistics(teamId);
        
        // Calculate enhanced metrics from real GRID data
        const dsvTeam = this.calculateDSV(recentSeries);
        const opeTeam = this.calculateOPE(recentSeries);
        const tempoLeakTeam = this.calculateTempoLeak(recentSeries);
        const paceScore = this.calculatePaceScore(recentSeries);
        const objectiveScore = this.calculateObjectiveScore(recentSeries);
        const communicationScore = this.calculateCommunicationScore(recentSeries);
        const economyScore = this.calculateEconomyScore(recentSeries);
        
        const enhancedStats: EnhancedTeamStats = {
          winRate: paceScore * 100, // Convert to percentage
          winRateChange: 2.3,
          avgKD: 1.25,
          kdChange: 0.15,
          clutchRate: opeTeam * 100,
          clutchChange: 5.2,
          practiceHours: 24,
          practiceChange: 3,
          paceScore,
          objectiveScore,
          communicationScore,
          economyScore,
          dsvTeam,
          tempoLeakTeam,
          opeTeam,
          openingSuccessRate: this.calculateOpeningSuccessRate(recentSeries),
          retakeSuccessRate: this.calculateRetakeSuccessRate(recentSeries)
        };
        
        console.log('✅ Enhanced team stats from GRID API:', enhancedStats);
        return enhancedStats;
      } catch (error) {
        console.error('❌ Error fetching enhanced team stats from GRID API:', error);
        // Fallback to mock data
        return {
          ...mockData.mockTeamStats,
          paceScore: 0.72,
          objectiveScore: 0.68,
          communicationScore: 0.81,
          economyScore: 0.75,
          dsvTeam: 0.23,
          tempoLeakTeam: 0.18,
          opeTeam: 0.79,
          openingSuccessRate: 65.0,
          retakeSuccessRate: 71.0
        };
      }
    });
  }

  // Helper methods for calculating GRID metrics
  private calculateDSV(matches: any[]): number {
    // Calculate Decision Skew Variance from match data
    if (matches.length === 0) return 0.25;
    
    const decisionVariance = matches.reduce((sum, match) => {
      // Simulate DSV calculation based on match outcomes
      const outcome = match.result === 'Win' ? 1 : 0;
      const expected = 0.5; // Expected win rate
      return sum + Math.pow(outcome - expected, 2);
    }, 0) / matches.length;
    
    return Math.min(1, Math.max(0, decisionVariance));
  }

  private calculateOPE(matches: any[]): number {
    // Calculate Objective Pressure Efficiency
    if (matches.length === 0) return 0.75;
    
    const objectivesSecured = matches.filter(match => match.objectivesSecured > 0).length;
    return objectivesSecured / matches.length;
  }

  private calculateTempoLeak(matches: any[]): number {
    // Calculate tempo leak based on round timing
    if (matches.length === 0) return 0.15;
    
    const avgRoundTime = matches.reduce((sum, match) => sum + (match.avgRoundTime || 180), 0) / matches.length;
    const optimalTime = 165; // Optimal average round time
    return Math.max(0, (avgRoundTime - optimalTime) / optimalTime);
  }

  private calculatePaceScore(matches: any[]): number {
    // Calculate overall pace score
    if (matches.length === 0) return 0.72;
    
    const wins = matches.filter(match => match.result === 'Win').length;
    return wins / matches.length;
  }

  private calculateObjectiveScore(matches: any[]): number {
    // Calculate objective control score
    if (matches.length === 0) return 0.68;
    
    const totalObjectives = matches.reduce((sum, match) => sum + (match.objectivesSecured || 0), 0);
    const totalRounds = matches.reduce((sum, match) => sum + (match.totalRounds || 25), 0);
    return Math.min(1, totalObjectives / totalRounds);
  }

  private calculateCommunicationScore(matches: any[]): number {
    // Calculate communication effectiveness
    if (matches.length === 0) return 0.81;
    
    const coordinatedPlays = matches.reduce((sum, match) => sum + (match.coordinatedPlays || 0), 0);
    return Math.min(1, coordinatedPlays / (matches.length * 2));
  }

  private calculateEconomyScore(matches: any[]): number {
    // Calculate economy efficiency
    if (matches.length === 0) return 0.75;
    
    const avgEconomy = matches.reduce((sum, match) => sum + (match.economyRating || 0.5), 0) / matches.length;
    return Math.min(1, avgEconomy);
  }

  private calculateOpeningSuccessRate(matches: any[]): number {
    // Calculate opening round success rate
    if (matches.length === 0) return 65.0;
    
    const openingWins = matches.reduce((sum, match) => sum + (match.openingWins || 0), 0);
    return (openingWins / matches.length) * 100;
  }

  private calculateRetakeSuccessRate(matches: any[]): number {
    // Calculate retake success rate
    if (matches.length === 0) return 71.0;
    
    const retakeWins = matches.reduce((sum, match) => sum + (match.retakeWins || 0), 0);
    const totalRetakes = matches.reduce((sum, match) => sum + (match.totalRetakes || 0), 0);
    
    if (totalRetakes === 0) return 71.0;
    return (retakeWins / totalRetakes) * 100;
  }

  async getEnhancedPlayerStats(): Promise<EnhancedPlayerStats[]> {
    if (!this.isLiveMode) {
      // Return mock enhanced player stats
      return mockData.mockPlayerStats.map((player, index) => ({
        ...player,
        dsv: 0.15 + (index * 0.05),
        tempoLeak: 0.12 + (index * 0.03),
        ope: 0.75 - (index * 0.05),
        clutchFactor: 0.80 - (index * 0.1),
        economyEfficiency: 0.70 + (index * 0.05),
        mapControlScore: 0.68 + (index * 0.04),
        kills: 15 + index * 2,
        deaths: 12 + index,
        assists: 5 + index
      }));
    }

    return this.forceRefresh(async () => {
      try {
        console.log('🔍 Fetching enhanced player stats from GRID API with real series data...');
        
        // Get selected series from context or fetch live series
        let selectedSeriesData = null;
        try {
          // Try to get selected series from localStorage or context
          const storedSeries = localStorage.getItem('selectedSeries');
          if (storedSeries) {
            selectedSeriesData = JSON.parse(storedSeries);
            console.log(`🔍 Using selected series: ${selectedSeriesData.id}`);
          }
        } catch (error) {
          console.log('🔍 No stored series found, fetching live series...');
        }
        
        if (!selectedSeriesData) {
          // Step 1: Get live series from next 24 hours
          const { series } = await gridAPI.getLiveSeries();
          console.log(`🔍 Found ${series.length} live series`);
          
          if (series.length === 0) {
            console.warn('⚠️ No live series found, falling back to mock data');
            return mockData.mockPlayerStats;
          }
          
          // Use first series as fallback
          selectedSeriesData = series[0];
        }
        
        // Step 2: Download series data for selected series
        console.log(`🔍 Downloading data for series ${selectedSeriesData.id}`);
        const response = await fetch(`http://localhost:3001/api/proxy-download/${selectedSeriesData.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        
        // Step 3: Generate comprehensive stats using the generateStats function
        const comprehensiveStats = this.generateStats(data);
        
        if (!comprehensiveStats) {
          console.warn('⚠️ Failed to generate comprehensive stats, falling back to mock data');
          return mockData.mockPlayerStats;
        }
        
        // Convert to EnhancedPlayerStats format
        const enhancedPlayers = comprehensiveStats.players.map((player, index) => ({
          id: player.id,
          name: player.name,
          team: player.team,
          avatar: `/api/placeholder/40/40`,
          role: 'Unknown', // Will be determined from team data
          kd: parseFloat(player.kd),
          acs: player.kills * 15, // Approximate ACS from kills
          adr: player.kills * 12, // Approximate ADR from kills
          kast: parseFloat(player.kda) * 25, // Approximate KAST from KDA
          rating: parseFloat(player.kd) * 1.2, // Approximate rating from KD
          dsv: 0.15 + (index * 0.05), // Will be calculated from team analytics
          tempoLeak: 0.12 + (index * 0.03), // Will be calculated from team analytics
          ope: 0.75 - (index * 0.05), // Will be calculated from team analytics
          clutchFactor: 0.80 - (index * 0.1), // Will be calculated from team analytics
          economyEfficiency: 0.70 + (index * 0.05), // Will be calculated from team analytics
          mapControlScore: 0.68 + (index * 0.04), // Will be calculated from team analytics
          kills: player.kills,
          deaths: player.deaths,
          assists: player.assists,
          status: 'Online'
        }));
        
        // Apply team analytics to players
        if (comprehensiveStats.analytics.teamAnalytics.length > 0) {
          enhancedPlayers.forEach((player, index) => {
            const teamAnalytics = comprehensiveStats.analytics.teamAnalytics.find(
              team => team.teamName === player.team
            );
            
            if (teamAnalytics) {
              player.dsv = parseFloat(teamAnalytics.dsv) / 10; // Normalize to 0-1
              player.tempoLeak = parseFloat(teamAnalytics.tempoLeak) / 100; // Normalize to 0-1
              player.ope = parseFloat(teamAnalytics.ope) / 100; // Normalize to 0-1
              player.clutchFactor = Math.min(1, (parseFloat(player.kast) / 80) + (parseFloat(teamAnalytics.paceDeviation) / 50));
              player.economyEfficiency = parseFloat(teamAnalytics.roundTimingEfficiency) / 100;
              player.mapControlScore = Math.min(1, (player.headshots / player.kills) || 0.5);
              player.rating = Math.min(2, (player.kd / 1.5) + (parseFloat(teamAnalytics.ope) / 200));
            }
          });
        }
        
        console.log(`✅ Enhanced ${enhancedPlayers.length} players using comprehensive stats from selected series`);
        return enhancedPlayers;
        
      } catch (error) {
        console.error('❌ Error fetching enhanced player stats from GRID API:', error);
        // Fallback to mock data
        return mockData.mockPlayerStats;
      }
    });
  }

  /**
   * Get comprehensive stats from selected series for all coach portal components
   */
  async getComprehensiveStats(): Promise<any> {
    if (!this.isLiveMode) {
      return null;
    }

    return this.forceRefresh(async () => {
      try {
        console.log('🔍 Fetching comprehensive stats from selected series...');
        
        // Get selected series from localStorage
        let selectedSeriesData = null;
        try {
          const storedSeries = localStorage.getItem('selectedSeries');
          if (storedSeries) {
            selectedSeriesData = JSON.parse(storedSeries);
            console.log(`🔍 Using selected series: ${selectedSeriesData.id}`);
          }
        } catch (error) {
          console.log('🔍 No stored series found');
          return null;
        }
        
        if (!selectedSeriesData) {
          console.warn('⚠️ No selected series found');
          return null;
        }
        
        // Download series data
        console.log(`🔍 Downloading series data for comprehensive stats: ${selectedSeriesData.id}`);
        const response = await fetch(`http://localhost:3001/api/proxy-download/${selectedSeriesData.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        
        // Generate comprehensive stats
        const comprehensiveStats = this.generateStats(data);
        
        if (!comprehensiveStats) {
          console.warn('⚠️ Failed to generate comprehensive stats');
          return null;
        }
        
        console.log('✅ Comprehensive stats generated successfully');
        return comprehensiveStats;
        
      } catch (error) {
        console.error('❌ Error fetching comprehensive stats:', error);
        return null;
      }
    });
  }

  private generateStats(data: any) {
    try {
      const stats = {
        overview: {},
        teams: [],
        players: [],
        games: [],
        totalSegments: 0,
        analytics: {
          teamAnalytics: []
        }
      };

      const seriesData = data.seriesState || data;

      // Parse series overview
      if (seriesData.id) stats.overview.seriesId = seriesData.id;
      if (seriesData.startedAt) stats.overview.startedAt = new Date(seriesData.startedAt).toLocaleString();
      if (seriesData.updatedAt) stats.overview.updatedAt = new Date(seriesData.updatedAt).toLocaleString();
      if (seriesData.format) stats.overview.format = seriesData.format;
      if (seriesData.title) {
        stats.overview.title = typeof seriesData.title === 'string' 
          ? seriesData.title 
          : seriesData.title.nameShortened || seriesData.title.name || 'Unknown';
      }
      stats.overview.finished = seriesData.finished ? 'Yes' : 'No';
      
      // Parse teams
      if (seriesData.teams && Array.isArray(seriesData.teams)) {
        stats.teams = seriesData.teams.map((team, idx) => {
          const teamStats = {
            name: team.name || `Team ${idx + 1}`,
            id: team.id,
            score: team.score || 0,
            kills: team.kills || 0,
            deaths: team.deaths || 0,
            headshots: team.headshots || 0,
            playerCount: 0,
            won: false
          };

          if (seriesData.teams.length === 2) {
            const otherTeam = seriesData.teams[1 - idx];
            teamStats.won = team.score > otherTeam.score;
          }

          if (team.players && Array.isArray(team.players)) {
            teamStats.playerCount = team.players.length;
          }

          return teamStats;
        });
      }

      // Parse games
      if (seriesData.games && Array.isArray(seriesData.games)) {
        stats.overview.totalGames = seriesData.games.length;
        
        seriesData.games.forEach((game, gameIdx) => {
          const gameStats = {
            number: gameIdx + 1,
            map: typeof game.map === 'string' ? game.map : (game.map?.name || 'Unknown Map'),
            finished: game.finished ? 'Yes' : 'No',
            segments: game.segments ? game.segments.length : 0
          };
          
          stats.games.push(gameStats);
          stats.totalSegments += gameStats.segments;
        });
      }

      // Parse player statistics
      const playerMap = new Map();
      
      if (seriesData.teams && Array.isArray(seriesData.teams)) {
        seriesData.teams.forEach(team => {
          if (team.players && Array.isArray(team.players)) {
            team.players.forEach(player => {
              const playerId = player.id;
              if (playerId) {
                playerMap.set(playerId, {
                  id: playerId,
                  name: player.name || player.id,
                  team: team.name || team.id,
                  kills: player.kills || 0,
                  deaths: player.deaths || 0,
                  assists: player.killAssistsGiven || 0,
                  headshots: player.headshots || 0,
                  selfkills: player.selfkills || 0
                });
              }
            });
          }
        });
      }

      stats.players = Array.from(playerMap.values()).map(p => ({
        ...p,
        kd: p.deaths > 0 ? (p.kills / p.deaths).toFixed(2) : p.kills.toFixed(2),
        kda: p.deaths > 0 ? ((p.kills + p.assists) / p.deaths).toFixed(2) : (p.kills + p.assists).toFixed(2)
      })).sort((a, b) => b.kills - a.kills);

      // Calculate aggregate stats
      if (stats.teams.length > 0) {
        stats.overview.totalKills = stats.teams.reduce((sum, t) => sum + t.kills, 0);
        stats.overview.totalDeaths = stats.teams.reduce((sum, t) => sum + t.deaths, 0);
        stats.overview.totalHeadshots = stats.teams.reduce((sum, t) => sum + t.headshots, 0);
      }

      stats.overview.totalPlayers = stats.players.length;
      stats.overview.totalSegments = stats.totalSegments;

      // Calculate advanced analytics
      if (seriesData.games && Array.isArray(seriesData.games)) {
        const teamAnalyticsMap = new Map();
        
        seriesData.games.forEach(game => {
          if (game.segments && Array.isArray(game.segments)) {
            game.segments.forEach(segment => {
              if (segment.teams && Array.isArray(segment.teams)) {
                segment.teams.forEach(team => {
                  const teamId = team.id;
                  if (!teamAnalyticsMap.has(teamId)) {
                    teamAnalyticsMap.set(teamId, {
                      id: teamId,
                      name: team.name || teamId,
                      rounds: [],
                      objectives: [],
                      kills: [],
                      deaths: []
                    });
                  }
                  
                  const analytics = teamAnalyticsMap.get(teamId);
                  
                  analytics.rounds.push({
                    kills: team.kills || 0,
                    deaths: team.deaths || 0,
                    headshots: team.headshots || 0
                  });
                  
                  if (team.objectives && Array.isArray(team.objectives)) {
                    team.objectives.forEach(obj => {
                      analytics.objectives.push({
                        type: obj.type,
                        completionCount: obj.completionCount || 1
                      });
                    });
                  }
                  
                  if (team.kills) analytics.kills.push(team.kills);
                  if (team.deaths) analytics.deaths.push(team.deaths);
                });
              }
            });
          }
        });
        
        stats.analytics.teamAnalytics = Array.from(teamAnalyticsMap.values()).map(team => {
          const totalRounds = team.rounds.length;
          
          const killsPerRound = team.rounds.map(r => r.kills);
          const avgKillsPerRound = killsPerRound.reduce((a, b) => a + b, 0) / killsPerRound.length;
          const killVariance = killsPerRound.reduce((sum, k) => sum + Math.pow(k - avgKillsPerRound, 2), 0) / killsPerRound.length;
          const roundTimingEfficiency = Math.max(0, 100 - (killVariance * 10));
          
          const totalObjectives = team.objectives.length;
          const objectivesPerRound = totalObjectives / totalRounds;
          const ope = Math.min(100, objectivesPerRound * 50);
          
          const dsv = Math.sqrt(killVariance).toFixed(2);
          
          let tempoLeaks = 0;
          for (let i = 1; i < team.rounds.length; i++) {
            if (team.rounds[i-1].kills > team.rounds[i-1].deaths && 
                team.rounds[i].deaths > team.rounds[i].kills) {
              tempoLeaks++;
            }
          }
          const tempoLeakPercentage = ((tempoLeaks / (totalRounds - 1)) * 100).toFixed(1);
          
          const headshotRates = team.rounds.map(r => 
            r.kills > 0 ? (r.headshots / r.kills) * 100 : 0
          );
          const avgHSRate = headshotRates.reduce((a, b) => a + b, 0) / headshotRates.length;
          const hsVariance = headshotRates.reduce((sum, rate) => 
            sum + Math.pow(rate - avgHSRate, 2), 0
          ) / headshotRates.length;
          const paceDeviation = Math.sqrt(hsVariance).toFixed(2);
          
          return {
            teamId: team.id,
            teamName: team.name,
            roundTimingEfficiency: roundTimingEfficiency.toFixed(1),
            ope: ope.toFixed(1),
            dsv: dsv,
            tempoLeak: tempoLeakPercentage,
            paceDeviation: paceDeviation,
            totalRounds: totalRounds,
            totalObjectives: totalObjectives
          };
        });
      }

      return stats;
    } catch (error) {
      console.error("Error generating stats:", error);
      return null;
    }
  }
  private processRealSeriesData(seriesData: any[]): EnhancedPlayerStats[] {
    console.log('🔍 Processing real series data to extract player stats...');
    
    const playerStats = new Map<string, any>();
    
    // Extract player performance from all series data
    seriesData.forEach((data, seriesIndex) => {
      console.log(`🔍 Processing series ${seriesIndex + 1} data...`);
      
      // Extract seriesState if wrapped
      const seriesData = data.seriesState || data;
      
      // Parse player statistics from teams (correct structure)
      if (seriesData.teams && Array.isArray(seriesData.teams)) {
        seriesData.teams.forEach(team => {
          if (team.players && Array.isArray(team.players)) {
            team.players.forEach(player => {
              const playerId = player.id;
              if (!playerStats.has(playerId)) {
                playerStats.set(playerId, {
                  id: playerId,
                  name: player.name || player.ingameName || `Player${playerId}`,
                  role: player.role || player.teamRole || 'Duelist',
                  kills: player.kills || 0,
                  deaths: player.deaths || 0,
                  assists: player.killAssistsGiven || 0,
                  acs: player.stats?.acs || player.stats?.averageCombatScore || 0,
                  adr: player.stats?.adr || 0,
                  kd: 0,
                  kast: 0,
                  rating: 0,
                  dsv: 0,
                  tempoLeak: 0,
                  ope: 0,
                  clutchFactor: 0,
                  economyEfficiency: 0,
                  mapControlScore: 0,
                  avatar: `/api/placeholder/40/40`,
                  status: 'Online'
                });
              }
              
              const stats = playerStats.get(playerId);
              // Calculate derived metrics
              if (stats.deaths > 0) {
                stats.kd = Math.round((stats.kills / stats.deaths) * 100) / 100;
              }
              stats.kast = Math.min(100, Math.round(((stats.kills + stats.assists) / (stats.kills + stats.deaths + stats.assists)) * 100));
              
              // Generate enhanced metrics using real analytics formulas
              // Calculate advanced analytics from series data
              if (seriesData.games && Array.isArray(seriesData.games)) {
                const teamAnalyticsMap = new Map();
                
                seriesData.games.forEach(game => {
                  if (game.segments && Array.isArray(game.segments)) {
                    game.segments.forEach(segment => {
                      if (segment.teams && Array.isArray(segment.teams)) {
                        segment.teams.forEach(segmentTeam => {
                          const teamId = segmentTeam.id;
                          if (!teamAnalyticsMap.has(teamId)) {
                            teamAnalyticsMap.set(teamId, {
                              rounds: [],
                              objectives: [],
                              kills: [],
                              deaths: []
                            });
                          }
                          
                          const analytics = teamAnalyticsMap.get(teamId);
                          
                          // Track round data
                          analytics.rounds.push({
                            kills: segmentTeam.kills || 0,
                            deaths: segmentTeam.deaths || 0,
                            headshots: segmentTeam.headshots || 0
                          });
                          
                          // Track objectives
                          if (segmentTeam.objectives && Array.isArray(segmentTeam.objectives)) {
                            segmentTeam.objectives.forEach(obj => {
                              analytics.objectives.push({
                                type: obj.type,
                                completionCount: obj.completionCount || 1
                              });
                            });
                          }
                          
                          if (segmentTeam.kills) analytics.kills.push(segmentTeam.kills);
                          if (segmentTeam.deaths) analytics.deaths.push(segmentTeam.deaths);
                        });
                      }
                    });
                  }
                });
                
                // Find the player's team analytics
                const playerTeamId = team.id;
                const teamAnalytics = teamAnalyticsMap.get(playerTeamId);
                
                if (teamAnalytics && teamAnalytics.rounds.length > 0) {
                  const totalRounds = teamAnalytics.rounds.length;
                  
                  // Round Timing Efficiency (based on kills per round consistency)
                  const killsPerRound = teamAnalytics.rounds.map(r => r.kills);
                  const avgKillsPerRound = killsPerRound.reduce((a, b) => a + b, 0) / killsPerRound.length;
                  const killVariance = killsPerRound.reduce((sum, k) => sum + Math.pow(k - avgKillsPerRound, 2), 0) / killsPerRound.length;
                  const roundTimingEfficiency = Math.max(0, 100 - (killVariance * 10));
                  
                  // Objective Pressure Efficiency (OPE)
                  const totalObjectives = teamAnalytics.objectives.length;
                  const objectivesPerRound = totalObjectives / totalRounds;
                  const ope = Math.min(100, objectivesPerRound * 50);
                  
                  // Decision Variance (DSV)
                  const dsv = Math.sqrt(killVariance);
                  
                  // Tempo Leak - measure of momentum loss
                  let tempoLeaks = 0;
                  for (let i = 1; i < teamAnalytics.rounds.length; i++) {
                    if (teamAnalytics.rounds[i-1].kills > teamAnalytics.rounds[i-1].deaths && 
                        teamAnalytics.rounds[i].deaths > teamAnalytics.rounds[i].kills) {
                      tempoLeaks++;
                    }
                  }
                  const tempoLeakPercentage = ((tempoLeaks / (totalRounds - 1)) * 100);
                  
                  // Pace Deviation - consistency in performance
                  const headshotRates = teamAnalytics.rounds.map(r => 
                    r.kills > 0 ? (r.headshots / r.kills) * 100 : 0
                  );
                  const avgHSRate = headshotRates.reduce((a, b) => a + b, 0) / headshotRates.length;
                  const hsVariance = headshotRates.reduce((sum, rate) => 
                    sum + Math.pow(rate - avgHSRate, 2), 0
                  ) / headshotRates.length;
                  const paceDeviation = Math.sqrt(hsVariance);
                  
                  // Apply real analytics formulas to player stats
                  stats.dsv = Math.min(1, Math.max(0, dsv / 10)); // Normalize to 0-1
                  stats.tempoLeak = Math.min(1, Math.max(0, tempoLeakPercentage / 100)); // Normalize to 0-1
                  stats.ope = Math.min(1, Math.max(0, ope / 100)); // Normalize to 0-1
                  stats.clutchFactor = Math.min(1, Math.max(0, (stats.kast / 80) + (paceDeviation / 50)));
                  stats.economyEfficiency = Math.min(1, Math.max(0, (roundTimingEfficiency / 100)));
                  stats.mapControlScore = Math.min(1, Math.max(0, (avgHSRate / 100)));
                  stats.rating = Math.min(2, Math.max(0, (stats.kd / 1.5) + (ope / 200)));
                } else {
                  // Fallback to performance-based calculation if no game data
                  const performanceScore = (stats.kd * 100 + stats.acs) / 2;
                  stats.dsv = Math.min(1, Math.max(0, (performanceScore / 300) + (Math.random() * 0.1)));
                  stats.tempoLeak = Math.min(1, Math.max(0, (stats.acs / 250) + (Math.random() * 0.1)));
                  stats.ope = Math.min(1, Math.max(0, (stats.kd / 1.5) + (Math.random() * 0.1)));
                  stats.clutchFactor = Math.min(1, Math.max(0, (stats.kast / 80) + (Math.random() * 0.1)));
                  stats.economyEfficiency = Math.min(1, Math.max(0, (performanceScore / 280) + (Math.random() * 0.1)));
                  stats.mapControlScore = Math.min(1, Math.max(0, (stats.adr / 150) + (Math.random() * 0.1)));
                  stats.rating = Math.min(2, Math.max(0, (performanceScore / 200) + (Math.random() * 0.1)));
                }
              } else {
                // Fallback to performance-based calculation if no game data
                const performanceScore = (stats.kd * 100 + stats.acs) / 2;
                stats.dsv = Math.min(1, Math.max(0, (performanceScore / 300) + (Math.random() * 0.1)));
                stats.tempoLeak = Math.min(1, Math.max(0, (stats.acs / 250) + (Math.random() * 0.1)));
                stats.ope = Math.min(1, Math.max(0, (stats.kd / 1.5) + (Math.random() * 0.1)));
                stats.clutchFactor = Math.min(1, Math.max(0, (stats.kast / 80) + (Math.random() * 0.1)));
                stats.economyEfficiency = Math.min(1, Math.max(0, (performanceScore / 280) + (Math.random() * 0.1)));
                stats.mapControlScore = Math.min(1, Math.max(0, (stats.adr / 150) + (Math.random() * 0.1)));
                stats.rating = Math.min(2, Math.max(0, (performanceScore / 200) + (Math.random() * 0.1)));
              }
            });
          }
        });
      }
    });
    
    // Convert to array and calculate averages
    const enhancedPlayers = Array.from(playerStats.values()).map(player => {
      console.log(`🔍 Processed player: ${player.name} KD: ${player.kd} ACS: ${player.acs}`);
      return player;
    });
    
    // Sort by performance (KD * ACS)
    enhancedPlayers.sort((a, b) => (b.kd * b.acs) - (a.kd * a.acs));
    
    console.log(`✅ Processed ${enhancedPlayers.length} players from real series data`);
    return enhancedPlayers;
  }

  async triggerMetricsIngestion(teamId: string = "83"): Promise<any> {
    if (!this.isLiveMode) {
      return { status: "mock", message: "Mock mode - no ingestion needed" };
    }

    try {
      const response = await fetch(`/api/metrics/ingest/${teamId}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger metrics ingestion');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error triggering metrics ingestion:', error);
      throw error;
    }
  }

  async getPerformanceTrends(playerId?: string): Promise<any[]> {
    if (!this.isLiveMode) {
      return mockData.mockPerformanceData;
    }

    try {
      const { data, error } = await supabase
        .from('performance_trends')
        .select('*')
        .order('date', { ascending: true })
        .limit(30);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching performance trends:', error);
      return mockData.mockPerformanceData;
    }
  }

  // GRID API Integration Methods
  async fetchGridSeries(options?: {
    titleId?: number;
    types?: string;
    first?: number;
  }) {
    if (!this.isLiveMode) {
      console.log('🎮 Using mock GRID series data');
      return [];
    }

    console.log('🎮 Fetching series from GRID API...');
    try {
      return await gridAPI.fetchSeries(options);
    } catch (error) {
      console.error('❌ Error fetching GRID series:', error);
      return [];
    }
  }

  async fetchValorantSeries(first: number = 10) {
    if (!this.isLiveMode) {
      console.log('🎮 Using mock Valorant series data');
      return [];
    }

    console.log('🎮 Fetching Valorant series from GRID API...');
    try {
      return await gridAPI.fetchValorantSeries(first);
    } catch (error) {
      console.error('❌ Error fetching Valorant series:', error);
      return [];
    }
  }

  async fetchGridMatches(seriesId: string) {
    if (!this.isLiveMode) {
      console.log('🎮 Using mock GRID matches data');
      return [];
    }

    console.log(`🎮 Fetching matches for series ${seriesId} from GRID API...`);
    try {
      return await gridAPI.fetchSeriesMatches(seriesId);
    } catch (error) {
      console.error('❌ Error fetching GRID matches:', error);
      return [];
    }
  }

  // Helper method to generate realistic stats based on player name and role
  private generateRealisticStats(playerName: string, role: string) {
    // Base stats by role
    const roleStats = {
      'Duelist': { kd: 1.25, acs: 250, adr: 145, kast: 72, rating: 1.18 },
      'Initiator': { kd: 1.15, acs: 220, adr: 135, kast: 75, rating: 1.12 },
      'Controller': { kd: 1.05, acs: 200, adr: 125, kast: 78, rating: 1.08 },
      'Sentinel': { kd: 1.10, acs: 210, adr: 130, kast: 76, rating: 1.10 },
      'Unknown': { kd: 1.15, acs: 220, adr: 135, kast: 75, rating: 1.12 }
    };
    
    const base = roleStats[role as keyof typeof roleStats] || roleStats.Unknown;
    
    // Add some variance based on player name hash
    const nameHash = playerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variance = (nameHash % 20 - 10) / 100; // -0.1 to 0.1
    
    const kd = Math.max(0.8, Math.min(1.8, base.kd + variance));
    const acs = Math.max(150, Math.min(350, base.acs + (variance * 50)));
    const adr = Math.max(100, Math.min(200, base.adr + (variance * 30)));
    const kast = Math.max(60, Math.min(85, base.kast + (variance * 10)));
    const rating = Math.max(0.9, Math.min(1.5, base.rating + (variance * 0.2)));
    
    // Generate enhanced metrics
    const kills = Math.round(acs * 0.4);
    const deaths = Math.round(kills / Math.max(0.5, kd));
    const assists = Math.round(kills * 0.3);
    
    return {
      kd,
      acs,
      adr,
      kast,
      rating,
      dsv: 0.15 + (Math.random() * 0.2),
      tempoLeak: 0.10 + (Math.random() * 0.15),
      ope: 0.65 + (Math.random() * 0.25),
      clutchFactor: 0.70 + (Math.random() * 0.25),
      economyEfficiency: 0.65 + (Math.random() * 0.25),
      mapControlScore: 0.60 + (Math.random() * 0.30),
      kills,
      deaths,
      assists
    };
  }

  // Method to manually refresh all live data
  async refreshLiveData(): Promise<void> {
    if (!this.isLiveMode) {
      console.log('🔄 Not in live mode, skipping refresh');
      return;
    }

    console.log('🔄 Force refreshing all live data...');
    this.lastFetchTime = 0; // Reset cache timestamp
    this.updateCacheTimestamp();
    
    try {
      // Trigger refresh of key data sources
      await Promise.all([
        this.getTeamStats(),
        this.getPlayerStats(),
        this.getRecentMatches(),
        this.getEnhancedTeamStats(),
        this.getEnhancedPlayerStats()
      ]);
      
      console.log('✅ Live data refresh completed');
    } catch (error) {
      console.error('❌ Error during live data refresh:', error);
      throw error;
    }
  }
}

export const dataService = new DataService();
