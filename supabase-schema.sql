-- Supabase SQL Schema for Processed GRID Metrics
-- Execute these in Supabase SQL Editor

-- Enhanced matches table with GRID integration
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grid_match_id VARCHAR(255) UNIQUE,
    grid_series_id VARCHAR(255),
    opponent VARCHAR(255),
    map VARCHAR(100),
    date TIMESTAMP WITH TIME ZONE,
    result VARCHAR(20), -- 'WIN', 'LOSS', 'DRAW'
    score VARCHAR(20), -- '13-7', '2-1', etc.
    duration_minutes INTEGER,
    source VARCHAR(20) DEFAULT 'GRID', -- 'GRID', 'MANUAL', 'MOCK'
    raw_data JSONB, -- Store raw GRID response
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player metrics table with custom calculations
CREATE TABLE IF NOT EXISTS player_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    player_id VARCHAR(255), -- GRID player ID
    player_name VARCHAR(255),
    player_nickname VARCHAR(255),
    role VARCHAR(50), -- 'Duelist', 'Controller', 'Initiator', 'Sentinel'
    team_id VARCHAR(255),
    
    -- Basic stats
    kills INTEGER,
    deaths INTEGER,
    assists INTEGER,
    kda DECIMAL(5,2),
    acs DECIMAL(8,2), -- Average Combat Score
    adr DECIMAL(8,2), -- Average Damage per Round
    
    -- Custom metrics
    dsv DECIMAL(8,3), -- Decision Skew Variance
    tempo_leak DECIMAL(8,3), -- Tempo Leak metric
    ope DECIMAL(8,3), -- Objective Pressure Efficiency
    clutch_factor DECIMAL(8,3), -- Clutch performance
    economy_efficiency DECIMAL(8,3), -- Economic management
    map_control_score DECIMAL(8,3), -- Map control effectiveness
    
    -- Advanced metrics
    first_bloods INTEGER,
    opening_duel_success_rate DECIMAL(5,2),
    postplant_success_rate DECIMAL(5,2),
    utility_usage_score DECIMAL(8,3),
    positioning_score DECIMAL(8,3),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(match_id, player_id)
);

-- Team metrics table
CREATE TABLE IF NOT EXISTS team_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    team_id VARCHAR(255),
    team_name VARCHAR(255),
    
    -- Team performance metrics
    pace_score DECIMAL(8,3), -- Overall team tempo
    objective_score DECIMAL(8,3), -- Objective conversion
    communication_score DECIMAL(8,3), -- Team coordination
    economy_score DECIMAL(8,3), -- Economic management
    
    -- Round-by-round analysis
    opening_success_rate DECIMAL(5,2),
    retake_success_rate DECIMAL(5,2),
    anti_eco_success_rate DECIMAL(5,2),
    buy_success_rate DECIMAL(5,2),
    
    -- Custom metrics
    tempo_leak_team DECIMAL(8,3), -- Team-wide tempo issues
    dsv_team DECIMAL(8,3), -- Team decision variance
    ope_team DECIMAL(8,3), -- Team objective pressure
    
    -- Aggregate stats
    total_rounds_won INTEGER,
    total_rounds_lost INTEGER,
    total_kills INTEGER,
    total_deaths INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(match_id, team_id)
);

-- Players table (enhanced)
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grid_player_id VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    nickname VARCHAR(255),
    role VARCHAR(50),
    team_id VARCHAR(255),
    team_name VARCHAR(255),
    title VARCHAR(100), -- Game title (Valorant, etc.)
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grid_team_id VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    region VARCHAR(100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance trends (for historical analysis)
CREATE TABLE IF NOT EXISTS performance_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id VARCHAR(255),
    team_id VARCHAR(255),
    date DATE,
    
    -- Trend metrics
    avg_dsv DECIMAL(8,3),
    avg_tempo_leak DECIMAL(8,3),
    avg_ope DECIMAL(8,3),
    avg_clutch_factor DECIMAL(8,3),
    avg_kda DECIMAL(5,2),
    avg_acs DECIMAL(8,2),
    
    -- Performance trajectory
    dsv_trend DECIMAL(5,3), -- Positive = improving, Negative = declining
    tempo_leak_trend DECIMAL(5,3),
    ope_trend DECIMAL(5,3),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_grid_id ON matches(grid_match_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date DESC);
CREATE INDEX IF NOT EXISTS idx_player_metrics_match_id ON player_metrics(match_id);
CREATE INDEX IF NOT EXISTS idx_player_metrics_player_id ON player_metrics(player_id);
CREATE INDEX IF NOT EXISTS idx_team_metrics_match_id ON team_metrics(match_id);
CREATE INDEX IF NOT EXISTS idx_team_metrics_team_id ON team_metrics(team_id);
CREATE INDEX IF NOT EXISTS idx_players_grid_id ON players(grid_player_id);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_teams_grid_id ON teams(grid_team_id);
CREATE INDEX IF NOT EXISTS idx_performance_trends_player_date ON performance_trends(player_id, date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_trends ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for demo - adjust for production)
CREATE POLICY "Allow all operations on matches" ON matches FOR ALL USING (true);
CREATE POLICY "Allow all operations on player_metrics" ON player_metrics FOR ALL USING (true);
CREATE POLICY "Allow all operations on team_metrics" ON team_metrics FOR ALL USING (true);
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on teams" ON teams FOR ALL USING (true);
CREATE POLICY "Allow all operations on performance_trends" ON performance_trends FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
