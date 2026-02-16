import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Users, 
  Target, 
  Activity, 
  Brain, 
  Gauge, 
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield
} from 'lucide-react';
import { gridAPI } from '@/lib/gridAPI';

interface LiveSeries {
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
  };
  teams?: {
    baseInfo?: {
      name?: string;
    };
    scoreAdvantage?: number;
  }[];
}

interface Team {
  id: string;
  name: string;
  score: number;
  kills: number;
  deaths: number;
  headshots: number;
  players: Player[];
  won: boolean;
}

interface Player {
  id: string;
  name: string;
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  kd: string;
  kda: string;
}

interface TeamAnalytics {
  teamId: string;
  teamName: string;
  roundTimingEfficiency: string;
  ope: string;
  dsv: string;
  tempoLeak: string;
  paceDeviation: string;
  totalRounds: number;
  totalObjectives: number;
}

interface LiveModeData {
  selectedSeries: LiveSeries | null;
  selectedTeam: Team | null;
  seriesData: any;
  analytics: {
    overview: any;
    teams: Team[];
    players: Player[];
    teamAnalytics: TeamAnalytics[];
  } | null;
}

export default function LiveModeCard() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'loading' | 'series-selection' | 'team-selection' | 'analytics'>('loading');
  const [liveSeries, setLiveSeries] = useState<LiveSeries[]>([]);
  const [liveData, setLiveData] = useState<LiveModeData>({
    selectedSeries: null,
    selectedTeam: null,
    seriesData: null,
    analytics: null
  });

  useEffect(() => {
    if (step === 'loading') {
      fetchLiveSeries();
    }
  }, [step]);

  const fetchLiveSeries = async () => {
    setLoading(true);
    try {
      const { series } = await gridAPI.getLiveSeries();
      setLiveSeries(series);
      setStep('series-selection');
    } catch (error) {
      console.error('Error fetching live series:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectSeries = async (series: LiveSeries) => {
    setLoading(true);
    try {
      // Download series data
      const response = await fetch(`http://localhost:3001/api/proxy-download/${series.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      // Generate analytics
      const analytics = generateStats(data);
      
      setLiveData({
        selectedSeries: series,
        selectedTeam: null,
        seriesData: data,
        analytics
      });
      setStep('team-selection');
    } catch (error) {
      console.error('Error downloading series:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectTeam = (team: Team) => {
    setLiveData(prev => ({
      ...prev,
      selectedTeam: team
    }));
    setStep('analytics');
  };

  const generateStats = (data: any) => {
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

      // Extract seriesState if wrapped
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
        stats.teams = seriesData.teams.map((team: any, idx: number) => {
          const teamStats = {
            name: team.name || `Team ${idx + 1}`,
            id: team.id,
            score: team.score || 0,
            kills: team.kills || 0,
            deaths: team.deaths || 0,
            headshots: team.headshots || 0,
            playerCount: 0,
            won: false,
            players: []
          };

          // Determine winner
          if (seriesData.teams.length === 2) {
            const otherTeam = seriesData.teams[1 - idx];
            teamStats.won = team.score > otherTeam.score;
          }

          // Count players and extract player data
          if (team.players && Array.isArray(team.players)) {
            teamStats.playerCount = team.players.length;
            teamStats.players = team.players.map((player: any) => ({
              id: player.id,
              name: player.name || player.id,
              kills: player.kills || 0,
              deaths: player.deaths || 0,
              assists: player.killAssistsGiven || 0,
              headshots: player.headshots || 0,
              selfkills: player.selfkills || 0,
              kd: player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills.toFixed(2),
              kda: player.deaths > 0 ? ((player.kills + player.assists) / player.deaths).toFixed(2) : (player.kills + player.assists).toFixed(2)
            }));
          }

          return teamStats;
        });
      }

      // Parse games
      if (seriesData.games && Array.isArray(seriesData.games)) {
        stats.overview.totalGames = seriesData.games.length;
        
        seriesData.games.forEach((game: any, gameIdx: number) => {
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

      // Parse player statistics from teams
      const playerMap = new Map();
      
      if (seriesData.teams && Array.isArray(seriesData.teams)) {
        seriesData.teams.forEach((team: any) => {
          if (team.players && Array.isArray(team.players)) {
            team.players.forEach((player: any) => {
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

      stats.players = Array.from(playerMap.values()).map((p: any) => ({
        ...p,
        kd: p.deaths > 0 ? (p.kills / p.deaths).toFixed(2) : p.kills.toFixed(2),
        kda: p.deaths > 0 ? ((p.kills + p.assists) / p.deaths).toFixed(2) : (p.kills + p.assists).toFixed(2)
      })).sort((a: any, b: any) => b.kills - a.kills);

      // Calculate aggregate stats
      if (stats.teams.length > 0) {
        stats.overview.totalKills = stats.teams.reduce((sum: number, t: any) => sum + t.kills, 0);
        stats.overview.totalDeaths = stats.teams.reduce((sum: number, t: any) => sum + t.deaths, 0);
        stats.overview.totalHeadshots = stats.teams.reduce((sum: number, t: any) => sum + t.headshots, 0);
      }

      stats.overview.totalPlayers = stats.players.length;
      stats.overview.totalSegments = stats.totalSegments;

      // Calculate advanced analytics
      if (seriesData.games && Array.isArray(seriesData.games)) {
        const teamAnalyticsMap = new Map();
        
        seriesData.games.forEach((game: any) => {
          if (game.segments && Array.isArray(game.segments)) {
            game.segments.forEach((segment: any) => {
              if (segment.teams && Array.isArray(segment.teams)) {
                segment.teams.forEach((team: any) => {
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
                  
                  // Track round data
                  analytics.rounds.push({
                    kills: team.kills || 0,
                    deaths: team.deaths || 0,
                    headshots: team.headshots || 0
                  });
                  
                  // Track objectives
                  if (team.objectives && Array.isArray(team.objectives)) {
                    team.objectives.forEach((obj: any) => {
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
        
        // Calculate metrics for each team
        stats.analytics.teamAnalytics = Array.from(teamAnalyticsMap.values()).map((team: any) => {
          const totalRounds = team.rounds.length;
          
          // Round Timing Efficiency (based on kills per round consistency)
          const killsPerRound = team.rounds.map((r: any) => r.kills);
          const avgKillsPerRound = killsPerRound.reduce((a: number, b: number) => a + b, 0) / killsPerRound.length;
          const killVariance = killsPerRound.reduce((sum: number, k: number) => sum + Math.pow(k - avgKillsPerRound, 2), 0) / killsPerRound.length;
          const roundTimingEfficiency = Math.max(0, 100 - (killVariance * 10)); // Higher is better
          
          // Objective Pressure Efficiency (OPE)
          const totalObjectives = team.objectives.length;
          const objectivesPerRound = totalObjectives / totalRounds;
          const ope = Math.min(100, objectivesPerRound * 50); // Normalized to 100
          
          // Decision Variance (DSV) - based on kill pattern consistency
          const dsv = Math.sqrt(killVariance).toFixed(2);
          
          // Tempo Leak - measure of momentum loss (deaths after kills)
          let tempoLeaks = 0;
          for (let i = 1; i < team.rounds.length; i++) {
            if (team.rounds[i-1].kills > team.rounds[i-1].deaths && 
                team.rounds[i].deaths > team.rounds[i].kills) {
              tempoLeaks++;
            }
          }
          const tempoLeakPercentage = ((tempoLeaks / (totalRounds - 1)) * 100).toFixed(1);
          
          // Pace Deviation - consistency in performance (lower is better)
          const headshotRates = team.rounds.map((r: any) => 
            r.kills > 0 ? (r.headshots / r.kills) * 100 : 0
          );
          const avgHSRate = headshotRates.reduce((a: number, b: number) => a + b, 0) / headshotRates.length;
          const hsVariance = headshotRates.reduce((sum: number, rate: number) => 
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
  };

  if (step === 'loading') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Loading Live Series Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-center text-muted-foreground">
              Fetching available live series from GRID API...
            </p>
            <Progress value={66} className="w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'series-selection') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Select Live Series
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {liveSeries.map((series) => (
              <Card key={series.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => selectSeries(series)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {series.title?.nameShortened || `Series ${series.id}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {series.tournament?.nameShortened || 'Unknown Tournament'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {series.format?.name || 'Best of 3'}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{series.id}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(series.startTimeScheduled || '').toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {series.teams && series.teams.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {series.teams.map((team, idx) => (
                        <Badge key={idx} variant="outline">
                          {team.baseInfo?.name || `Team ${idx + 1}`}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'team-selection') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Select Team for Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <h3 className="font-semibold">{liveData.selectedSeries?.title?.nameShortened || `Series ${liveData.selectedSeries?.id}`}</h3>
            <p className="text-sm text-muted-foreground">
              {liveData.analytics?.overview.format} • {liveData.analytics?.overview.totalGames} games
            </p>
          </div>
          <div className="grid gap-4">
            {liveData.analytics?.teams.map((team) => (
              <Card key={team.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => selectTeam(team)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{team.name}</h3>
                      <div className="flex gap-4 mt-2">
                        <span className="text-sm">K: {team.kills}</span>
                        <span className="text-sm">D: {team.deaths}</span>
                        <span className="text-sm">HS: {team.headshots}</span>
                        <span className="text-sm">Players: {team.playerCount}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={team.won ? "default" : "secondary"}>
                        {team.won ? "Winner" : "Score: " + team.score}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'analytics' && liveData.selectedTeam && liveData.analytics) {
    const teamAnalytics = liveData.analytics.analytics.teamAnalytics.find(
      (ta: any) => ta.teamId === liveData.selectedTeam?.id
    );

    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            {liveData.selectedTeam.name} - Live Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Team Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Round Timing Efficiency</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-500">
                    {teamAnalytics?.roundTimingEfficiency || 0}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Objective Pressure Efficiency</span>
                  </div>
                  <p className="text-2xl font-bold text-green-500">
                    {teamAnalytics?.ope || 0}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Decision Variance</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-500">
                    {teamAnalytics?.dsv || 0}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">Tempo Leak</span>
                  </div>
                  <p className="text-2xl font-bold text-red-500">
                    {teamAnalytics?.tempoLeak || 0}%
                  </p>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Players Grid - Show all 10 players */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Players Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveData.selectedTeam.players.map((player) => (
                  <Card key={player.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold">{player.name}</h4>
                        <Badge variant="outline">{player.id}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Kills:</span>
                          <span className="font-medium">{player.kills}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deaths:</span>
                          <span className="font-medium">{player.deaths}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Assists:</span>
                          <span className="font-medium">{player.assists}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Headshots:</span>
                          <span className="font-medium">{player.headshots}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>K/D:</span>
                          <span className="font-medium">{player.kd}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>K/D+A:</span>
                          <span className="font-medium">{player.kda}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Advanced Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Advanced Team Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Performance Consistency</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Rounds:</span>
                        <span className="font-medium">{teamAnalytics?.totalRounds || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Objectives Secured:</span>
                        <span className="font-medium">{teamAnalytics?.totalObjectives || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pace Deviation:</span>
                        <span className="font-medium">{teamAnalytics?.paceDeviation || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Match Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Final Score:</span>
                        <span className="font-medium">{liveData.selectedTeam.score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Kills:</span>
                        <span className="font-medium">{liveData.selectedTeam.kills}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Deaths:</span>
                        <span className="font-medium">{liveData.selectedTeam.deaths}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
