import { supabase } from './supabase';
import * as mockData from './mockData';

// Type definitions
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
  private isLiveMode: boolean = false;

  setLiveMode(live: boolean) {
    this.isLiveMode = live;
  }

  async getTeamStats(): Promise<TeamStats> {
    if (!this.isLiveMode) {
      return mockData.mockTeamStats;
    }

    try {
      const { data, error } = await supabase
        .from('team_stats')
        .select('*')
        .single();

      if (error) throw error;
      return data as TeamStats;
    } catch (error) {
      console.error('Error fetching team stats:', error);
      return mockData.mockTeamStats;
    }
  }

  async getPlayerStats(): Promise<PlayerStats[]> {
    if (!this.isLiveMode) {
      return mockData.mockPlayerStats;
    }

    try {
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      return data as PlayerStats[];
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return mockData.mockPlayerStats;
    }
  }

  async getRecentMatches(limit: number = 5): Promise<Match[]> {
    if (!this.isLiveMode) {
      return mockData.mockRecentMatches.slice(0, limit);
    }

    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Match[];
    } catch (error) {
      console.error('Error fetching recent matches:', error);
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
        .order('day', { ascending: true });

      if (error) throw error;
      return data as PerformanceData[];
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
      return data;
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
        .order('time', { ascending: true });

      if (error) throw error;
      return data;
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
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching VOD list:', error);
      return mockData.mockVODList;
    }
  }
}

export const dataService = new DataService();
