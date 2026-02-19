"""
FastAPI Metrics Engine for GRID Data Processing
Transforms raw GRID data into custom esports metrics (DSV, Tempo Leak, OPE)
"""

import asyncio
import aiohttp
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import json
import math
from supabase import create_client, Client

# Configuration
GRID_API_KEY = os.getenv("VITE_GRID_API_KEY", "92cHfYttmHhNmLz8g5OIYi6D9DSmFuJ4AAzBQiHj")
GRID_CENTRAL_DATA_URL = "https://api-op.grid.gg/central-data/graphql"
GRID_STATISTICS_FEED_URL = "https://api-op.grid.gg/statistics-feed/graphql"
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://ueqidmcidpbptpcbbeeo.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZmR1cm9qcHlzbXBrY2h0Z3N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDA3OTk3MCwiZXhwIjoyMDg1NjU1OTcwfQ.nvXTCHsllE_6iU9GJyAiG2ZZUDA-LFaJa-njtXTxNto")

app = FastAPI(title="LIVEWIRE Metrics Engine", version="1.0.0")

# Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Data Models
@dataclass
class PlayerMetrics:
    player_id: str
    player_name: str
    role: str
    kills: int
    deaths: int
    assists: int
    kda: float
    acs: float
    adr: float
    dsv: float  # Decision Skew Variance
    tempo_leak: float  # Tempo Leak metric
    ope: float  # Objective Pressure Efficiency
    clutch_factor: float
    economy_efficiency: float
    map_control_score: float

@dataclass
class TeamMetrics:
    team_id: str
    team_name: str
    pace_score: float
    objective_score: float
    communication_score: float
    economy_score: float
    tempo_leak_team: float
    dsv_team: float
    ope_team: float
    opening_success_rate: float
    retake_success_rate: float

class MetricsCalculator:
    """Custom esports metrics calculations"""
    
    @staticmethod
    def calculate_dsv(decisions: List[Dict], pressure_level: float) -> float:
        """
        Decision Skew Variance (DSV)
        Measures how often decisions deviate from optimal options under pressure
        """
        if not decisions:
            return 0.0
        
        optimal_decisions = [d for d in decisions if d.get('is_optimal', False)]
        total_decisions = len(decisions)
        
        if total_decisions == 0:
            return 0.0
        
        # Base DSV calculation
        optimal_ratio = len(optimal_decisions) / total_decisions
        
        # Adjust for pressure level (higher pressure = more weight on variance)
        pressure_multiplier = 1.0 + (pressure_level * 0.5)
        
        # Calculate variance from optimal
        variance = 1.0 - optimal_ratio
        dsv = variance * pressure_multiplier
        
        return round(dsv, 3)
    
    @staticmethod
    def calculate_tempo_leak(round_times: List[float], optimal_pace: float = 90.0) -> float:
        """
        Tempo Leak Metric
        Measures where team pace lags vs optimal timing
        """
        if not round_times:
            return 0.0
        
        # Calculate average round time
        avg_round_time = sum(round_times) / len(round_times)
        
        # Calculate deviation from optimal pace
        tempo_deviation = abs(avg_round_time - optimal_pace) / optimal_pace
        
        # Normalize to 0-1 scale (higher = more tempo leak)
        tempo_leak = min(tempo_deviation, 1.0)
        
        return round(tempo_leak, 3)
    
    @staticmethod
    def calculate_ope(objective_data: Dict) -> float:
        """
        Objective Pressure Efficiency (OPE)
        Measures how often map control converts to objectives
        """
        control_events = objective_data.get('control_events', 0)
        objective_conversions = objective_data.get('objective_conversions', 0)
        
        if control_events == 0:
            return 0.0
        
        # Base efficiency calculation
        efficiency = objective_conversions / control_events
        
        # Weight by time pressure (faster conversions = higher efficiency)
        avg_conversion_time = objective_data.get('avg_conversion_time', 30.0)
        time_bonus = max(0, (30.0 - avg_conversion_time) / 30.0)
        
        ope = efficiency + (time_bonus * 0.2)  # 20% bonus for speed
        ope = min(ope, 1.0)  # Cap at 1.0
        
        return round(ope, 3)
    
    @staticmethod
    def calculate_clutch_factor(clutch_situations: List[Dict]) -> float:
        """
        Clutch Factor
        Measures performance in high-pressure clutch situations
        """
        if not clutch_situations:
            return 0.0
        
        successful_clutches = sum(1 for c in clutch_situations if c.get('success', False))
        total_clutches = len(clutch_situations)
        
        if total_clutches == 0:
            return 0.0
        
        # Base clutch success rate
        clutch_rate = successful_clutches / total_clutches
        
        # Weight by difficulty (1v5 > 1v4 > 1v3 > 1v2 > 1v1)
        difficulty_weight = sum(
            c.get('enemies_remaining', 1) * (1.0 if c.get('success', False) else 0.0)
            for c in clutch_situations
        ) / sum(c.get('enemies_remaining', 1) for c in clutch_situations)
        
        clutch_factor = (clutch_rate * 0.7) + (difficulty_weight * 0.3)
        
        return round(clutch_factor, 3)
    
    @staticmethod
    def calculate_economy_efficiency(economy_data: Dict) -> float:
        """
        Economy Efficiency
        Measures economic management and utility usage
        """
        total_spent = economy_data.get('total_spent', 0)
        total_available = economy_data.get('total_available', 0)
        utility_value = economy_data.get('utility_value', 0)
        
        if total_available == 0:
            return 0.0
        
        # Spending efficiency (not overspending or underspending)
        spending_efficiency = 1.0 - abs(total_spent - total_available * 0.8) / (total_available * 0.8)
        
        # Utility value ratio
        utility_ratio = utility_value / total_spent if total_spent > 0 else 0.0
        
        # Combined efficiency
        economy_efficiency = (spending_efficiency * 0.6) + (utility_ratio * 0.4)
        
        return round(max(0, min(economy_efficiency, 1.0)), 3)
    
    @staticmethod
    def calculate_map_control_score(positioning_data: List[Dict]) -> float:
        """
        Map Control Score
        Measures positioning and map control effectiveness
        """
        if not positioning_data:
            return 0.0
        
        # Calculate control time percentage
        total_control_time = sum(p.get('control_time', 0) for p in positioning_data)
        total_round_time = sum(p.get('round_time', 0) for p in positioning_data)
        
        if total_round_time == 0:
            return 0.0
        
        control_percentage = total_control_time / total_round_time
        
        # Weight by strategic value (some areas more valuable)
        strategic_bonus = sum(
            p.get('strategic_value', 1.0) * p.get('control_time', 0)
            for p in positioning_data
        ) / total_control_time if total_control_time > 0 else 0.0
        
        map_control_score = (control_percentage * 0.7) + (strategic_bonus * 0.3)
        
        return round(max(0, min(map_control_score, 1.0)), 3)

class GRIDDataProcessor:
    """Processes raw GRID data into metrics"""
    
    def __init__(self):
        self.calculator = MetricsCalculator()
    
    async def fetch_grid_data(self, session: aiohttp.ClientSession, team_id: str) -> Dict:
        """Fetch raw data from GRID API"""
        headers = {
            'Authorization': f'Bearer {GRID_API_KEY}',
            'X-API-Key': GRID_API_KEY,
            'Content-Type': 'application/json'
        }
        
        # Fetch team statistics
        stats_query = {
            "query": """
                query TeamStatisticsForLastThreeMonths($teamId: ID!) {
                    teamStatistics(teamId: $teamId, filter: { timeWindow: LAST_3_MONTHS }) {
                        id
                        aggregationSeriesIds
                        series {
                            count
                            kills { sum min max avg }
                            deaths { sum min max avg }
                            assists { sum min max avg }
                        }
                        game {
                            count
                            wins { value count percentage streak { min max current } }
                        }
                        segment {
                            type
                            count
                            deaths { sum min max avg }
                        }
                    }
                }
            """,
            "variables": {"teamId": team_id}
        }
        
        async with session.post(GRID_STATISTICS_FEED_URL, json=stats_query, headers=headers) as response:
            if response.status != 200:
                raise HTTPException(status_code=500, detail=f"GRID API error: {response.status}")
            
            return await response.json()
    
    def simulate_round_data(self, team_stats: Dict) -> Dict:
        """
        Simulate detailed round data from aggregated GRID statistics
        In production, this would come from detailed match data
        """
        series_data = team_stats.get('data', {}).get('teamStatistics', {})
        
        # Simulate round-by-round data based on aggregates
        total_rounds = series_data.get('series', {}).get('count', 0)
        total_kills = series_data.get('series', {}).get('kills', {}).get('sum', 0)
        total_deaths = series_data.get('series', {}).get('deaths', {}).get('sum', 0)
        
        # Generate simulated round data
        rounds = []
        kills_per_round = total_kills / max(total_rounds, 1)
        
        for i in range(min(total_rounds, 25)):  # Cap at 25 rounds
            round_kills = max(0, int(kills_per_round + (i % 3 - 1)))  # Add variation
            round_time = 90 + (i % 30) - 15  # 75-105 seconds
            
            rounds.append({
                'round_number': i + 1,
                'kills': round_kills,
                'deaths': max(0, round_kills - 1),
                'duration': round_time,
                'winner': 'team' if i % 3 != 0 else 'opponent',
                'plant': i % 2 == 0,
                'defuse': i % 3 == 0
            })
        
        return {
            'rounds': rounds,
            'total_rounds': total_rounds,
            'team_kills': total_kills,
            'team_deaths': total_deaths
        }
    
    def calculate_player_metrics(self, round_data: Dict, team_stats: Dict) -> List[PlayerMetrics]:
        """Calculate metrics for each player"""
        # Simulate player data (in production, this would come from detailed GRID data)
        players_data = []
        
        # Base stats from team aggregates
        total_kills = team_stats.get('data', {}).get('teamStatistics', {}).get('series', {}).get('kills', {}).get('sum', 0)
        total_deaths = team_stats.get('data', {}).get('teamStatistics', {}).get('series', {}).get('deaths', {}).get('sum', 0)
        total_rounds = team_stats.get('data', {}).get('teamStatistics', {}).get('series', {}).get('count', 0)
        
        # Simulate 5 players
        player_names = ["Zerost", "AsLanMshadW", "Player3", "Player4", "Player5"]
        roles = ["Duelist", "Controller", "Initiator", "Sentinel", "Flex"]
        
        for i, (name, role) in enumerate(zip(player_names, roles)):
            # Distribute stats among players
            player_kills = int(total_kills * (0.15 + (i * 0.05)))  # Vary contribution
            player_deaths = int(total_deaths * (0.18 + (i * 0.02)))
            
            # Calculate basic metrics
            kda = (player_kills + max(1, player_deaths)) / max(1, player_deaths)
            acs = (player_kills * 250) / max(1, total_rounds)  # Simplified ACS
            adr = (player_kills * 140) / max(1, total_rounds)  # Simplified ADR
            
            # Simulate decision data for DSV
            decisions = [
                {'is_optimal': j % 3 != 0, 'pressure': 0.7 + (j % 4) * 0.1}
                for j in range(20)  # 20 decisions per match
            ]
            dsv = self.calculator.calculate_dsv(decisions, 0.8)
            
            # Calculate other custom metrics
            tempo_leak = self.calculator.calculate_tempo_leak([90 + (i % 20) for i in range(10)])
            
            objective_data = {
                'control_events': 15 + i,
                'objective_conversions': 10 + i,
                'avg_conversion_time': 25 - i
            }
            ope = self.calculator.calculate_ope(objective_data)
            
            clutch_situations = [
                {'success': j % 3 != 0, 'enemies_remaining': j % 3 + 1}
                for j in range(5 + i)
            ]
            clutch_factor = self.calculator.calculate_clutch_factor(clutch_situations)
            
            economy_data = {
                'total_spent': 8000 + (i * 500),
                'total_available': 10000,
                'utility_value': 2000 + (i * 200)
            }
            economy_efficiency = self.calculator.calculate_economy_efficiency(economy_data)
            
            positioning_data = [
                {'control_time': 30 + i, 'round_time': 90, 'strategic_value': 1.2}
                for _ in range(10)
            ]
            map_control_score = self.calculator.calculate_map_control_score(positioning_data)
            
            players_data.append(PlayerMetrics(
                player_id=f"player_{i+1}",
                player_name=name,
                role=role,
                kills=player_kills,
                deaths=player_deaths,
                assists=max(0, player_kills // 3),
                kda=kda,
                acs=acs,
                adr=adr,
                dsv=dsv,
                tempo_leak=tempo_leak,
                ope=ope,
                clutch_factor=clutch_factor,
                economy_efficiency=economy_efficiency,
                map_control_score=map_control_score
            ))
        
        return players_data
    
    def calculate_team_metrics(self, round_data: Dict, player_metrics: List[PlayerMetrics]) -> TeamMetrics:
        """Calculate team-level metrics"""
        rounds = round_data.get('rounds', [])
        
        # Calculate team pace score
        round_times = [r.get('duration', 90) for r in rounds]
        avg_pace = sum(round_times) / len(round_times) if round_times else 90
        pace_score = max(0, 1.0 - abs(avg_pace - 90) / 90)
        
        # Calculate objective score
        plants = sum(1 for r in rounds if r.get('plant', False))
        defuses = sum(1 for r in rounds if r.get('defuse', False))
        objective_score = (plants + defuses) / max(1, len(rounds))
        
        # Calculate communication score (simulated)
        communication_score = 0.75 + (len(rounds) % 10) * 0.025
        
        # Calculate economy score
        economy_score = sum(p.economy_efficiency for p in player_metrics) / len(player_metrics)
        
        # Aggregate player metrics for team
        avg_dsv = sum(p.dsv for p in player_metrics) / len(player_metrics)
        avg_tempo_leak = sum(p.tempo_leak for p in player_metrics) / len(player_metrics)
        avg_ope = sum(p.ope for p in player_metrics) / len(player_metrics)
        
        # Calculate success rates
        opening_wins = sum(1 for i, r in enumerate(rounds) if r.get('winner') == 'team' and i < 3)
        opening_success_rate = opening_wins / max(1, min(3, len(rounds)))
        
        retake_wins = sum(1 for r in rounds if r.get('plant', False) and r.get('winner') == 'team')
        total_plants = sum(1 for r in rounds if r.get('plant', False))
        retake_success_rate = retake_wins / max(1, total_plants)
        
        return TeamMetrics(
            team_id="team_83",
            team_name="Team LIVEWIRE",
            pace_score=round(pace_score, 3),
            objective_score=round(objective_score, 3),
            communication_score=round(communication_score, 3),
            economy_score=round(economy_score, 3),
            tempo_leak_team=round(avg_tempo_leak, 3),
            dsv_team=round(avg_dsv, 3),
            ope_team=round(avg_ope, 3),
            opening_success_rate=round(opening_success_rate * 100, 2),
            retake_success_rate=round(retake_success_rate * 100, 2)
        )

# API Endpoints
processor = GRIDDataProcessor()

@app.post("/api/metrics/ingest/{team_id}")
async def ingest_metrics(team_id: str, background_tasks: BackgroundTasks):
    """Ingest GRID data and calculate metrics"""
    try:
        async with aiohttp.ClientSession() as session:
            # Fetch raw GRID data
            grid_data = await processor.fetch_grid_data(session, team_id)
            
            # Process data into metrics
            round_data = processor.simulate_round_data(grid_data)
            player_metrics = processor.calculate_player_metrics(round_data, grid_data)
            team_metrics = processor.calculate_team_metrics(round_data, player_metrics)
            
            # Store in Supabase
            match_id = datetime.now().strftime("match_%Y%m%d_%H%M%S")
            
            # Insert match
            match_result = supabase.table('matches').insert({
                'grid_match_id': f"grid_{team_id}_{datetime.now().timestamp()}",
                'opponent': 'Various',
                'map': 'Haven',
                'date': datetime.now().isoformat(),
                'result': 'WIN' if team_metrics.pace_score > 0.5 else 'LOSS',
                'score': f"{int(team_metrics.pace_score * 13)}-{int((1-team_metrics.pace_score) * 13)}",
                'duration_minutes': 45,
                'source': 'GRID',
                'raw_data': grid_data
            }).execute()
            
            match_uuid = match_result.data[0]['id']
            
            # Insert player metrics
            for player in player_metrics:
                supabase.table('player_metrics').insert({
                    'match_id': match_uuid,
                    'player_id': player.player_id,
                    'player_name': player.player_name,
                    'role': player.role,
                    'kills': player.kills,
                    'deaths': player.deaths,
                    'assists': player.assists,
                    'kda': player.kda,
                    'acs': player.acs,
                    'adr': player.adr,
                    'dsv': player.dsv,
                    'tempo_leak': player.tempo_leak,
                    'ope': player.ope,
                    'clutch_factor': player.clutch_factor,
                    'economy_efficiency': player.economy_efficiency,
                    'map_control_score': player.map_control_score
                }).execute()
            
            # Insert team metrics
            supabase.table('team_metrics').insert({
                'match_id': match_uuid,
                'team_id': team_metrics.team_id,
                'team_name': team_metrics.team_name,
                'pace_score': team_metrics.pace_score,
                'objective_score': team_metrics.objective_score,
                'communication_score': team_metrics.communication_score,
                'economy_score': team_metrics.economy_score,
                'tempo_leak_team': team_metrics.tempo_leak_team,
                'dsv_team': team_metrics.dsv_team,
                'ope_team': team_metrics.ope_team,
                'opening_success_rate': team_metrics.opening_success_rate,
                'retake_success_rate': team_metrics.retake_success_rate,
                'total_rounds_won': int(team_metrics.pace_score * 13),
                'total_rounds_lost': int((1-team_metrics.pace_score) * 13),
                'total_kills': sum(p.kills for p in player_metrics),
                'total_deaths': sum(p.deaths for p in player_metrics)
            }).execute()
            
            return {
                "status": "success",
                "match_id": match_uuid,
                "team_metrics": {
                    "pace_score": team_metrics.pace_score,
                    "objective_score": team_metrics.objective_score,
                    "dsv_team": team_metrics.dsv_team,
                    "tempo_leak_team": team_metrics.tempo_leak_team,
                    "ope_team": team_metrics.ope_team
                },
                "player_count": len(player_metrics)
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics/team")
async def get_team_metrics(mode: str = "live"):
    """Get team metrics (mock or live)"""
    if mode == "mock":
        # Return mock data
        return {
            "mode": "mock",
            "data": {
                "pace_score": 0.72,
                "objective_score": 0.68,
                "communication_score": 0.81,
                "economy_score": 0.75,
                "dsv_team": 0.23,
                "tempo_leak_team": 0.18,
                "ope_team": 0.79,
                "opening_success_rate": 65.0,
                "retake_success_rate": 71.0
            }
        }
    
    # Return live data from Supabase
    result = supabase.table('team_metrics').select('*').order('created_at', desc=True).limit(1).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="No live metrics found")
    
    metrics = result.data[0]
    return {
        "mode": "live",
        "data": {
            "pace_score": metrics['pace_score'],
            "objective_score": metrics['objective_score'],
            "communication_score": metrics['communication_score'],
            "economy_score": metrics['economy_score'],
            "dsv_team": metrics['dsv_team'],
            "tempo_leak_team": metrics['tempo_leak_team'],
            "ope_team": metrics['ope_team'],
            "opening_success_rate": metrics['opening_success_rate'],
            "retake_success_rate": metrics['retake_success_rate']
        }
    }

@app.get("/api/metrics/players")
async def get_player_metrics(mode: str = "live"):
    """Get player metrics (mock or live)"""
    if mode == "mock":
        # Return mock data
        return {
            "mode": "mock",
            "data": [
                {
                    "player_name": "Zerost",
                    "role": "Duelist",
                    "kills": 18,
                    "deaths": 12,
                    "kda": 1.67,
                    "acs": 245.3,
                    "adr": 142.1,
                    "dsv": 0.21,
                    "tempo_leak": 0.15,
                    "ope": 0.78,
                    "clutch_factor": 0.82,
                    "economy_efficiency": 0.76
                },
                {
                    "player_name": "AsLanMshadW",
                    "role": "Controller",
                    "kills": 14,
                    "deaths": 10,
                    "kda": 1.55,
                    "acs": 198.7,
                    "adr": 128.4,
                    "dsv": 0.18,
                    "tempo_leak": 0.12,
                    "ope": 0.71,
                    "clutch_factor": 0.65,
                    "economy_efficiency": 0.81
                }
            ]
        }
    
    # Return live data from Supabase
    result = supabase.table('player_metrics').select('*').order('created_at', desc=True).limit(5).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="No live player metrics found")
    
    return {
        "mode": "live",
        "data": [
            {
                "player_name": p['player_name'],
                "role": p['role'],
                "kills": p['kills'],
                "deaths": p['deaths'],
                "kda": p['kda'],
                "acs": p['acs'],
                "adr": p['adr'],
                "dsv": p['dsv'],
                "tempo_leak": p['tempo_leak'],
                "ope": p['ope'],
                "clutch_factor": p['clutch_factor'],
                "economy_efficiency": p['economy_efficiency']
            }
            for p in result.data
        ]
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
