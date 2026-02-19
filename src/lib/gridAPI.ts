// GRID API Integration Service
// This service connects to GRID's Central Data API for live esports data


export interface GridMatch {
  id: string;
  seriesId: string;
  teams: {
    id: string;
    name: string;
  }[];
  startTimeScheduled: string;
  status: string;
}

export interface GridPlayer {
  id: string;
  name: string;
  handle: string;
  teamId: string;
  role?: string;
  nickname?: string;
  title?: {
    name: string;
  };
}

export interface GridTeam {
  id: string;
  name: string;
  baseInfo?: {
    name: string;
  };
  scoreAdvantage?: number;
}

export interface GridOrganization {
  id: string;
  name: string;
  teams: {
    name: string;
  }[];
}

export interface GridTournament {
  id: string;
  name: string;
  nameShortened?: string;
}

export interface GridSeries {
  id: string;
  title?: {
    nameShortened?: string;
  };
  tournament?: {
    nameShortened?: string;
  };
  startTimeScheduled?: string;
  format?: {
    name?: string;
    nameShortened?: string;
  };
  teams?: {
    baseInfo?: {
      name?: string;
    };
    scoreAdvantage?: number;
  }[];
}

export interface GridMatch {
  id: string;
  seriesId: string;
  teams: {
    id: string;
    name: string;
  }[];
  startTimeScheduled: string;
  status: string;
}

export interface GridTeamStatistics {
  id: string;
  aggregationSeriesIds: string[];
  series: {
    count: number;
    kills: {
      sum: number;
      min: number;
      max: number;
      avg: number;
    };
  };
  game: {
    count: number;
    wins: {
      value: number;
      count: number;
      percentage: number;
      streak: {
        min: number;
        max: number;
        current: number;
      };
    };
  };
  segment: {
    type: string;
    count: number;
    deaths: {
      sum: number;
      min: number;
      max: number;
      avg: number;
    };
  }[];
}

class GridAPIService {
  private readonly CENTRAL_DATA_URL = 'https://api-op.grid.gg/central-data/graphql';
  private readonly STATISTICS_FEED_URL = 'https://api-op.grid.gg/statistics-feed/graphql';
  private readonly LIVE_DATA_URL = 'https://api.grid.gg/live-data/graphql';
  
  // Game title IDs from GRID API
  readonly TITLE_IDS = {
    VALORANT: 6,
    LOL: 3,
    RAINBOW_6: 25
  } as const;

  // Series types
  readonly SERIES_TYPES = {
    ESPORTS: 'ESPORTS',
    SCRIM: 'SCRIM',
    COMPETITIVE: 'COMPETITIVE'
  } as const;

  /**
   * Check if GRID API credentials are available
   */
  private hasCredentials(): boolean {
    const apiKey = import.meta.env.VITE_GRID_API_KEY;
    console.log('🔑 Checking API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
    console.log('🔑 All env vars:', {
      VITE_GRID_API_KEY: apiKey ? 'SET' : 'NOT SET',
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET',
      VITE_TEAM_ID: import.meta.env.VITE_TEAM_ID || 'NOT SET'
    });
    return !!(apiKey && apiKey !== 'placeholder');
  }

  /**
   * Check if GRID API credentials are available and have proper permissions
   */
  private async checkPermissions(): Promise<{ hasCredentials: boolean; hasPermissions: boolean }> {
    if (!this.hasCredentials()) {
      return { hasCredentials: false, hasPermissions: false };
    }

    try {
      // Test with the actual API key to check permissions
      const response = await fetch(this.CENTRAL_DATA_URL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          query: `query GetPlayers($first: Int) { players(first: $first) { edges { node { id nickname } } } }`,
          variables: { first: 1 }
        }),
      });

      if (!response.ok) {
        console.log('❌ API test failed - network error');
        return { hasCredentials: true, hasPermissions: false };
      }

      const result = await response.json();
      
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions?.errorType === 'UNAUTHENTICATED') {
          console.log('❌ API key authentication failed');
          return { hasCredentials: true, hasPermissions: false };
        } else {
          console.log('❌ API key lacks permissions for player data');
          return { hasCredentials: true, hasPermissions: false };
        }
      }

      if (result.data && result.data.players) {
        console.log('✅ API key has full player data access permissions');
        return { hasCredentials: true, hasPermissions: true };
      }

      console.log('⚠️ API key works but not for player data (teams/orgs only)');
      return { hasCredentials: true, hasPermissions: false };
      
    } catch (error) {
      console.error('❌ Error during permission check:', error);
      return { hasCredentials: true, hasPermissions: false };
    }
  }

  /**
   * Get authorization headers for GRID API
   */
  private getAuthHeaders(): Record<string, string> {
    const apiKey = import.meta.env.VITE_GRID_API_KEY;
    if (!apiKey || apiKey === 'placeholder') {
      throw new Error('GRID API key is missing. Please add VITE_GRID_API_KEY to your environment variables.');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-API-Key': apiKey
    };
  }

  /**
   * Fetch teams from GRID API
   */
  async fetchTeams(first: number = 10, after?: string | null): Promise<{ teams: GridTeam[]; totalCount: number }> {
    const permissions = await this.checkPermissions();
    
    if (!permissions.hasCredentials) {
      console.warn('⚠️ GRID API credentials not found, returning empty results');
      console.log('💡 To enable GRID API: Add VITE_GRID_API_KEY to your environment variables');
      return { teams: [], totalCount: 0 };
    }
    
    if (!permissions.hasPermissions) {
      console.warn('⚠️ GRID API credentials found but lack data access permissions');
      console.log('💡 Your API key is valid but may need additional permissions for data access');
      return { teams: [], totalCount: 0 };
    }

    const query = `query GetTeams($first: Int, $after: String) { teams(first: $first, after: $after) { totalCount pageInfo { hasPreviousPage hasNextPage startCursor endCursor } edges { cursor node { id name scoreAdvantage } } } }`;

    try {
      console.log('🔍 Fetching teams from GRID API...');
      
      const response = await fetch(this.CENTRAL_DATA_URL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ 
          query,
          variables: { first, after }
        }),
      });

      if (!response.ok) {
        throw new Error(`GRID API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL Error: ${result.errors[0].message}`);
      }

      const teams = result.data.teams.edges.map((edge: any) => edge.node);
      
      console.log(`✅ Retrieved ${teams.length} teams from GRID API`);
      return {
        teams,
        totalCount: result.data.teams.totalCount
      };
      
    } catch (error) {
      console.error('❌ Error fetching teams from GRID API:', error);
      throw error;
    }
  }

  /**
   * Fetch players from GRID API
   */
  async fetchPlayers(first: number = 10, teamId?: string): Promise<{ players: GridPlayer[]; totalCount: number }> {
    console.log('🔍 fetchPlayers called with first:', first, 'teamId:', teamId);
    
    // Use Central Data API with authentication for player queries
    // Statistics Feed API is for statistics, not player roster data
    const permissions = await this.checkPermissions();
    
    if (!permissions.hasCredentials) {
      console.warn('⚠️ GRID API credentials not found, returning empty results');
      console.log('💡 To enable GRID API: Add VITE_GRID_API_KEY to your environment variables');
      console.log('💡 Your current API key works for statistics but needs player data access');
      return { players: [], totalCount: 0 };
    }
    
    if (!permissions.hasPermissions) {
      console.warn('⚠️ GRID API credentials found but lack data access permissions');
      console.log('💡 Your API key works for statistics but needs player data access');
      console.log('💡 Contact Grid support to get player data permissions added to your API key');
      return { players: [], totalCount: 0 };
    }

    // Use exact working query from GraphQL playground
    const query = teamId 
      ? `query GetTeamRoster { players(filter: {teamIdFilter: {id: "${teamId}"}}) { edges { node { ...playerFields } } pageInfo { hasNextPage hasPreviousPage } }`
      : `query GetPlayers($first: Int) { players(first: $first) { edges { node { ...playerFields } } } }`;

    // Add fragment definition
    const fragment = `fragment playerFields on Player { id nickname title { name } }`;

    try {
      console.log('🔍 Fetching players from Central Data API with authentication...');
      
      const response = await fetch(this.CENTRAL_DATA_URL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ 
          query: query + fragment,
          variables: teamId ? {} : { first }
        }),
      });

      if (!response.ok) {
        throw new Error(`GRID API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        console.error('❌ GraphQL Errors:', result.errors);
        if (result.errors[0]?.extensions?.errorType === 'UNAUTHENTICATED') {
          console.error('❌ Authentication failed - check your VITE_GRID_API_KEY');
        }
        throw new Error(`GraphQL Error: ${result.errors[0].message}`);
      }

      if (result.data && result.data.players) {
        const players = result.data.players.edges.map((edge: any) => edge.node);
        console.log(`✅ Retrieved ${players.length} players from authenticated Central Data API (total: ${result.data.players.totalCount})`);
        console.log('🔍 Sample players:', players.slice(0, 3).map(p => ({ nickname: p.nickname, role: p.title?.name })));
        return {
          players,
          totalCount: result.data.players.totalCount || players.length
        };
      } else {
        console.warn('⚠️ No player data found in Central Data API response');
        console.log('🔍 Full response:', result);
        return { players: [], totalCount: 0 };
      }
      
    } catch (error) {
      console.error('❌ Error fetching players from Central Data API:', error);
      
      if (error.message.includes('UNAUTHENTICATED') || error.message.includes('unauthorized')) {
        console.error('❌ Authentication Error: Please check your VITE_GRID_API_KEY environment variable');
        console.error('💡 Your API key works for statistics but needs player data permissions');
        console.error('💡 Contact Grid support or get a new API key with player data access');
      }
      
      return { players: [], totalCount: 0 };
    }
  }

  /**
   * Fetch tournaments from GRID API
   */
  async fetchTournaments(): Promise<{ tournaments: GridTournament[] }> {
    const permissions = await this.checkPermissions();
    
    if (!permissions.hasCredentials || !permissions.hasPermissions) {
      console.warn('⚠️ GRID API not available, returning empty results');
      return { tournaments: [] };
    }

    const query = `query GetTournaments { tournaments { pageInfo { hasPreviousPage hasNextPage startCursor endCursor } totalCount edges { cursor node { id name nameShortened } } } }`;

    try {
      console.log('🔍 Fetching tournaments from GRID API...');
      
      const response = await fetch(this.CENTRAL_DATA_URL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`GRID API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL Error: ${result.errors[0].message}`);
      }

      const tournaments = result.data.tournaments.edges.map((edge: any) => edge.node);
      
      console.log(`✅ Retrieved ${tournaments.length} tournaments from GRID API`);
      return { tournaments };
      
    } catch (error) {
      console.error('❌ Error fetching tournaments from GRID API:', error);
      throw error;
    }
  }

  /**
   * Fetch series from GRID API (updated with working query)
   */
  async fetchSeries(options: {
    titleId?: number;
    types?: string;
    startTimeScheduled?: {
      gte?: string;
      lte?: string;
    };
    first?: number;
    productServiceLevels?: {
      productName: string;
      serviceLevel: string;
    };
  } = {}): Promise<{ series: GridSeries[]; totalCount: number }> {
    const permissions = await this.checkPermissions();
    
    if (!permissions.hasCredentials || !permissions.hasPermissions) {
      console.warn('⚠️ GRID API not available, returning empty results');
      return { series: [], totalCount: 0 };
    }

    const query = `query GetAllSeriesInNext24Hours($filter: SeriesFilter) { allSeries(filter: $filter, orderBy: StartTimeScheduled) { totalCount pageInfo { hasPreviousPage hasNextPage startCursor endCursor } edges { cursor node { id title { nameShortened } tournament { nameShortened } startTimeScheduled format { name nameShortened } teams { baseInfo { name } scoreAdvantage } } } }`;
    
    if (options.startTimeScheduled) {
      variables.filter = {
        startTimeScheduled: options.startTimeScheduled
      };
    }

    try {
      console.log('🔍 Fetching series from GRID API...');
      
      const response = await fetch(this.CENTRAL_DATA_URL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`GRID API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL Error: ${result.errors[0].message}`);
      }

      const series = result.data.allSeries.edges.map((edge: any) => edge.node);
      
      console.log(`✅ Retrieved ${series.length} series from GRID API`);
      return {
        series,
        totalCount: result.data.allSeries.totalCount
      };
      
    } catch (error) {
      console.error('❌ Error fetching series from GRID API:', error);
      throw error;
    }
  }

  /**
   * Fetch team statistics from GRID API
   */
  async fetchTeamStatistics(teamId: string, filter?: {
    timeWindow?: string;
    tournamentIds?: {
      in: string[];
    };
  }): Promise<GridTeamStatistics> {
    const permissions = await this.checkPermissions();
    
    if (!permissions.hasCredentials || !permissions.hasPermissions) {
      console.warn('⚠️ GRID API not available, returning empty results');
      throw new Error('GRID API not available');
    }

    const query = filter?.tournamentIds 
      ? `query TeamStatisticsForChosenTournaments($teamId: ID!, $tournamentIds: [ID!]) { teamStatistics(teamId: $teamId, filter: { tournamentIds: { in: $tournamentIds } }) { id aggregationSeriesIds series { count kills { sum min max avg } } game { count wins { value count percentage streak { min max current } } } segment { type count deaths { sum min max avg } } } }`
      : `query TeamStatisticsForLastThreeMonths($teamId: ID!) { teamStatistics(teamId: $teamId, filter: { timeWindow: LAST_3_MONTHS }) { id aggregationSeriesIds series { count kills { sum min max avg } } game { count wins { value count percentage streak { min max current } } } segment { type count deaths { sum min max avg } } } }`;

    try {
      console.log(`🔍 Fetching team statistics for team ${teamId} from GRID API...`);
      
      const response = await fetch(this.STATISTICS_FEED_URL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ 
          query,
          variables: filter?.tournamentIds 
            ? { teamId, tournamentIds: filter.tournamentIds.in }
            : { teamId }
        }),
      });

      if (!response.ok) {
        throw new Error(`GRID API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL Error: ${result.errors[0].message}`);
      }

      console.log(`✅ Retrieved team statistics from GRID API`);
      return result.data.teamStatistics;
      
    } catch (error) {
      console.error('❌ Error fetching team statistics from GRID API:', error);
      throw error;
    }
  }

  /**
   * Fetch recent Valorant esports series
   */
  async fetchValorantSeries(first: number = 10): Promise<GridSeries[]> {
    return this.fetchSeries({
      titleId: this.TITLE_IDS.VALORANT,
      types: this.SERIES_TYPES.ESPORTS,
      first,
      productServiceLevels: {
        productName: 'liveDataFeed',
        serviceLevel: 'FULL'
      }
    }).then(result => result.series);
  }

  /**
   * Fetch matches for a specific series
   */
  async fetchSeriesMatches(seriesId: string): Promise<GridMatch[]> {
    const query = `
      query allSeriesMatches(
        filter: {
          seriesId: "${seriesId}"
        }
        orderBy: StartTimeScheduled
        orderDirection: DESC
      ) {
        edges {
          node {
            id
            seriesId
            teams {
              id
              name
            }
            startTimeScheduled
            status
          }
        }
      }
    `;

    try {
      console.log(`🔍 Fetching matches for series ${seriesId}...`);
      
      const response = await fetch(this.CENTRAL_DATA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`GRID API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL Error: ${result.errors[0].message}`);
      }

      const matches = result.data.allSeriesMatches.edges.map((edge: any) => edge.node);
      
      console.log(`✅ Retrieved ${matches.length} matches for series ${seriesId}`);
      return matches;
      
    } catch (error) {
      console.error('❌ Error fetching matches from GRID API:', error);
      throw error;
    }
  }

  /**
   * Fetch live data for a match
   */
  async fetchLiveMatchData(matchId: string): Promise<any> {
    const query = `
      query liveMatchData(
        matchId: "${matchId}"
      ) {
        liveMatchData {
          gameState
          currentRound
          teams {
            id
            name
            score
            players {
              id
              name
              handle
              role
              stats {
                kills
                deaths
                assists
                economy
              }
            }
          }
        }
      }
    `;

    try {
      console.log(`🔍 Fetching live data for match ${matchId}...`);
      
      const response = await fetch(this.LIVE_DATA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`GRID API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL Error: ${result.errors[0].message}`);
      }

      console.log(`✅ Retrieved live data for match ${matchId}`);
      return result.data.liveMatchData;
      
    } catch (error) {
      console.error('❌ Error fetching live data from GRID API:', error);
      throw error;
    }
  }

  /**
   * Test connection to GRID API
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing GRID API connection (open access)...');
      
      // Test with the open access endpoint - no authentication needed
      const response = await fetch(this.CENTRAL_DATA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query { teams(first: 1) { totalCount } }`
        }),
      });

      if (!response.ok) {
        console.error('❌ GRID API connection failed:', response.status, response.statusText);
        return false;
      }

      const result = await response.json();
      
      if (result.errors) {
        console.error('❌ GraphQL Error:', result.errors[0].message);
        return false;
      }

      console.log('✅ GRID API connection successful! (Open Access)');
      return true;
      
    } catch (error) {
      console.error('❌ GRID API connection failed:', error);
      return false;
    }
  }

  /**
   * Get live series from the next 24 hours
   */
  async getLiveSeries(): Promise<{ series: GridSeries[]; totalCount: number }> {
    console.log('🔍 Fetching live series from next 24 hours...');
    
    const permissions = await this.checkPermissions();
    
    if (!permissions.hasCredentials) {
      console.warn('⚠️ GRID API credentials not found, returning empty series');
      return { series: [], totalCount: 0 };
    }
    
    if (!permissions.hasPermissions) {
      console.warn('⚠️ GRID API credentials lack permissions for series data');
      return { series: [], totalCount: 0 };
    }

    // Use exact working query from GraphQL playground
    const query = `query GetAllSeriesInNext24Hours { allSeries(filter: { startTimeScheduled: { gte: "2024-04-24T15:00:07+02:00" lte: "2024-04-25T15:00:07+02:00" } } orderBy: StartTimeScheduled) { totalCount pageInfo { hasPreviousPage hasNextPage startCursor endCursor } edges { cursor node { ...seriesFields } } } } fragment seriesFields on Series { id title { nameShortened } tournament { nameShortened } startTimeScheduled format { name nameShortened } teams { baseInfo { name } scoreAdvantage } }`;

    try {
      console.log('🔍 Fetching live series from Central Data API...');
      
      const response = await fetch(this.CENTRAL_DATA_URL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`GRID API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        console.error('❌ GraphQL Errors:', result.errors);
        throw new Error(`GraphQL Error: ${result.errors[0].message}`);
      }

      if (result.data && result.data.allSeries) {
        const series = result.data.allSeries.edges.map((edge: any) => edge.node);
        console.log(`✅ Retrieved ${series.length} live series (total: ${result.data.allSeries.totalCount})`);
        console.log('🔍 Sample series:', series.slice(0, 2).map(s => ({ id: s.id, title: s.title?.nameShortened, tournament: s.tournament?.nameShortened })));
        return {
          series,
          totalCount: result.data.allSeries.totalCount || series.length
        };
      } else {
        console.warn('⚠️ No series data found in Central Data API response');
        return { series: [], totalCount: 0 };
      }
      
    } catch (error) {
      console.error('❌ Error fetching live series from Central Data API:', error);
      return { series: [], totalCount: 0 };
    }
  }

  /**
   * Download series data file using File Download API
   */
  async downloadSeriesData(seriesId: string): Promise<any> {
    console.log('🔍 Downloading series data for seriesId:', seriesId);
    
    const permissions = await this.checkPermissions();
    
    if (!permissions.hasCredentials) {
      console.warn('⚠️ GRID API credentials not found, cannot download series data');
      throw new Error('API credentials required for file download');
    }
    
    if (!permissions.hasPermissions) {
      console.warn('⚠️ GRID API credentials lack permissions for file download');
      throw new Error('API key lacks file download permissions');
    }

    try {
      console.log('🔍 Downloading series file from File Download API...');
      
      const response = await fetch(`https://api.grid.gg/file-download/end-state/grid/series/${seriesId}`, {
        method: 'GET',
        headers: {
          'x-api-key': import.meta.env.VITE_GRID_API_KEY,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`File Download API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Downloaded series data for series ${seriesId}, size: ${JSON.stringify(data).length} bytes`);
      
      return data;
      
    } catch (error) {
      console.error('❌ Error downloading series data:', error);
      throw error;
    }
  }
}

export const gridAPI = new GridAPIService();
