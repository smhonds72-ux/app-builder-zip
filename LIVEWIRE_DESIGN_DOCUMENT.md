# Livewire – Software Design Document
## Project Peter Brand: AI Assistant Coach & Predictive Analytics Platform

**Version:** 1.0  
**Date:** January 30, 2026  
**Hackathon:** Cloud9 x JetBrains "Sky's the Limit"  
**Target:** Category 1 – Comprehensive Assistant Coach

---

## Table of Contents

1. [Design Philosophy & Vision](#1-design-philosophy--vision)
2. [System Architecture](#2-system-architecture)
3. [Database Schema & Data Models](#3-database-schema--data-models)
4. [Advanced Metrics Engine](#4-advanced-metrics-engine)
5. [API Layer Design](#5-api-layer-design)
6. [Frontend Architecture](#6-frontend-architecture)
7. [3D Experience Layer (Coach Henry)](#7-3d-experience-layer-coach-henry)
8. [UI/UX Design System](#8-uiux-design-system)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Real-time & State Management](#10-real-time--state-management)
11. [Implementation Tiers & Roadmap](#11-implementation-tiers--roadmap)
12. [Technical Risk Mitigation](#12-technical-risk-mitigation)

---

## 1. Design Philosophy & Vision

### 1.1 Core Differentiators

**Livewire is NOT another stats dashboard.** It's an **Active Strategy Modeling Engine** that transforms Cloud9's competitive workflow:

- **From:** Manual 10-hour VOD reviews → **To:** AI-curated 30-minute strategic sessions
- **From:** Subjective "feel-based" feedback → **To:** Quantified Win Probability Deltas
- **From:** Static post-game stats → **To:** Predictive "what-if" simulations
- **From:** Spreadsheet chaos → **To:** 3D immersive analytics experience

### 1.2 Judge-Winning Elements

1. **3D AI Coach (Henry)** - Not a chatbot, a fully animated R3F character with context-aware animations
2. **What-If Simulator** - Real predictive modeling, not just replays
3. **Cross-Game Architecture** - Unified platform for LoL & VALORANT with game-specific metrics
4. **Production-Grade Polish** - Glassmorphic cyberpunk UI that looks like a AAA game interface
5. **Complete Feature Set** - From auth to drills to voice queries, every promised feature works

### 1.3 Aesthetic Direction: "Tactical Hologram Command Center"

**Tone:** Futuristic military strategy room meets esports energy  
**Mood:** Precise, powerful, professional, slightly intimidating  
**Reference Vibes:** Halo's Cortana interface + Minority Report holograms + Cyberpunk 2077 netrunning

**Key Visual Elements:**
- Dark navy/charcoal base with electric teal/cyan accents (Cloud9 colors)
- Frosted glass panels with subtle grid patterns
- Animated scanlines and data streams
- Holographic projections for metrics
- Sharp, angular geometric shapes
- Depth through layered transparencies and glow effects

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │   Next.js App    │  │  React Three     │  │  Web Speech   │ │
│  │   (App Router)   │  │  Fiber (Henry)   │  │  API (Voice)  │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Next.js API     │  │  Supabase Edge   │  │   FastAPI     │ │
│  │  Routes          │  │  Functions       │  │   (Metrics)   │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA & SERVICES LAYER                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Supabase        │  │  GRID Esports    │  │  OpenAI GPT   │ │
│  │  (Postgres)      │  │  API             │  │  (LLM)        │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADVANCED METRICS ENGINE                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  DSV Calculator │ Tempo Leak │ OPE │ Win Prob Model    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack Breakdown

#### Frontend
- **Framework:** Next.js 14 (App Router) with TypeScript
- **3D Graphics:** React Three Fiber + Drei + @react-spring/three
- **UI Components:** Custom components + shadcn/ui foundation
- **Styling:** Tailwind CSS with custom design tokens
- **Charts:** Recharts + custom Canvas/SVG for radar charts
- **Animations:** Framer Motion + CSS animations
- **State:** Zustand + React Query (TanStack Query)
- **Forms:** React Hook Form + Zod validation

#### Backend
- **Primary API:** Next.js API Routes (serverless)
- **Metrics Engine:** FastAPI (Python) microservice
- **Database:** Supabase (Postgres + Auth + Realtime)
- **Edge Functions:** Supabase Edge Functions (Deno)
- **Cache:** Redis (for GRID API response caching)

#### External Services
- **Esports Data:** GRID API (official LoL & VALORANT data)
- **Auth:** NextAuth.js with Google OAuth
- **LLM:** OpenAI GPT-4 (for Henry's narration & voice queries)
- **Voice:** Web Speech API (synthesis) + potentially ElevenLabs
- **Deployment:** Vercel (frontend) + Railway/Fly.io (FastAPI)

#### Development Tools
- **IDE:** JetBrains WebStorm/IntelliJ + AI Assistant
- **Version Control:** Git + GitHub
- **API Testing:** Postman/Thunder Client
- **3D Modeling:** Blender (for Henry's model export)

---

## 3. Database Schema & Data Models

### 3.1 Core Tables

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('player', 'coach', 'admin')),
  team_id UUID REFERENCES teams(id),
  player_ign TEXT, -- In-game name for players
  player_role TEXT, -- e.g., 'jungle', 'duelist'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_team ON users(team_id);
```

#### `teams`
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  game TEXT NOT NULL CHECK (game IN ('lol', 'valorant', 'both')),
  region TEXT,
  logo_url TEXT,
  grid_team_id TEXT, -- GRID's team identifier
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `matches`
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grid_match_id TEXT UNIQUE NOT NULL,
  team_id UUID REFERENCES teams(id),
  opponent_name TEXT NOT NULL,
  game TEXT NOT NULL CHECK (game IN ('lol', 'valorant')),
  match_date TIMESTAMPTZ NOT NULL,
  result TEXT CHECK (result IN ('win', 'loss')),
  map_name TEXT, -- For VALORANT
  duration_seconds INTEGER,
  
  -- Aggregated metrics
  team_win_probability DECIMAL(5,2),
  avg_dsv DECIMAL(10,2),
  total_tempo_leak DECIMAL(10,2),
  
  -- Raw GRID data
  grid_data_raw JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_matches_team ON matches(team_id);
CREATE INDEX idx_matches_date ON matches(match_date DESC);
CREATE INDEX idx_matches_grid ON matches(grid_match_id);
```

#### `match_events`
```sql
CREATE TABLE match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'kill', 'objective', 'baron', 'plant', etc.
  game_time_seconds INTEGER NOT NULL,
  
  -- Players involved
  actor_player_id UUID REFERENCES users(id),
  target_player_id UUID REFERENCES users(id),
  
  -- Event details
  position_x DECIMAL,
  position_y DECIMAL,
  position_z DECIMAL, -- For VALORANT height
  
  -- Impact metrics
  dsv DECIMAL(10,2), -- Decision Swing Value for this event
  win_prob_before DECIMAL(5,2),
  win_prob_after DECIMAL(5,2),
  tempo_leak DECIMAL(10,2),
  
  -- Raw event data
  event_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_match ON match_events(match_id);
CREATE INDEX idx_events_type ON match_events(event_type);
CREATE INDEX idx_events_time ON match_events(match_id, game_time_seconds);
CREATE INDEX idx_events_actor ON match_events(actor_player_id);
```

#### `player_metrics`
```sql
CREATE TABLE player_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES users(id),
  
  -- Advanced Metrics
  dsv_contribution DECIMAL(10,2),
  tempo_leak_score DECIMAL(10,2),
  objective_participation_efficiency DECIMAL(5,2),
  objective_gravity DECIMAL(5,2), -- LoL
  utility_efficiency DECIMAL(5,2), -- VALORANT
  
  -- Basic Stats
  kills INTEGER,
  deaths INTEGER,
  assists INTEGER,
  cs INTEGER, -- LoL creep score
  gold_earned INTEGER, -- LoL
  damage_dealt INTEGER,
  damage_taken INTEGER,
  vision_score INTEGER, -- LoL
  
  -- VALORANT specific
  acs DECIMAL(5,2), -- Average Combat Score
  first_bloods INTEGER,
  plants INTEGER,
  defuses INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_player_metrics_match ON player_metrics(match_id);
CREATE INDEX idx_player_metrics_player ON player_metrics(player_id);
```

#### `review_agendas`
```sql
CREATE TABLE review_agendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id),
  created_by UUID REFERENCES users(id),
  
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'completed')),
  scheduled_at TIMESTAMPTZ,
  
  -- Agenda items as JSON array
  items JSONB NOT NULL DEFAULT '[]',
  /* Example item structure:
  {
    "priority": 1,
    "title": "Baron contest at 28:30",
    "dsv": -18.5,
    "event_id": "uuid",
    "timestamp": 1710,
    "notes": "Coach notes here",
    "video_url": "timestamp link"
  }
  */
  
  attendees UUID[], -- Array of user IDs
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agendas_match ON review_agendas(match_id);
CREATE INDEX idx_agendas_status ON review_agendas(status);
```

#### `drills`
```sql
CREATE TABLE drills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  
  title TEXT NOT NULL,
  description TEXT,
  drill_type TEXT NOT NULL, -- 'pathing', 'mechanics', 'decision_making', etc.
  game TEXT NOT NULL CHECK (game IN ('lol', 'valorant')),
  
  -- Linked to specific leak/metric
  related_metric TEXT, -- 'tempo_leak', 'ope', etc.
  related_match_id UUID REFERENCES matches(id),
  
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_minutes INTEGER,
  
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  
  -- Drill instructions/resources
  instructions JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drills_assigned ON drills(assigned_to);
CREATE INDEX idx_drills_status ON drills(status);
```

#### `vod_sessions`
```sql
CREATE TABLE vod_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id),
  agenda_id UUID REFERENCES review_agendas(id),
  
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  
  attendees UUID[], -- Array of user IDs
  host_id UUID REFERENCES users(id),
  
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  
  notes TEXT,
  recording_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vod_sessions_match ON vod_sessions(match_id);
CREATE INDEX idx_vod_sessions_scheduled ON vod_sessions(scheduled_at);
```

#### `what_if_scenarios`
```sql
CREATE TABLE what_if_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id),
  event_id UUID REFERENCES match_events(id),
  created_by UUID REFERENCES users(id),
  
  scenario_name TEXT NOT NULL,
  description TEXT,
  
  -- Original decision
  actual_decision TEXT,
  actual_win_prob DECIMAL(5,2),
  
  -- Alternative decision
  alternative_decision TEXT,
  predicted_win_prob DECIMAL(5,2),
  
  -- Delta
  win_prob_delta DECIMAL(5,2),
  
  -- Simulation details
  simulation_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scenarios_match ON what_if_scenarios(match_id);
CREATE INDEX idx_scenarios_event ON what_if_scenarios(event_id);
```

### 3.2 Supporting Tables

#### `notifications`
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  type TEXT NOT NULL, -- 'drill_assigned', 'vod_scheduled', 'agenda_ready', etc.
  title TEXT NOT NULL,
  message TEXT,
  
  link_url TEXT,
  link_text TEXT,
  
  read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = FALSE;
```

#### `user_preferences`
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  
  theme TEXT DEFAULT 'dark',
  henry_voice_enabled BOOLEAN DEFAULT TRUE,
  henry_personality TEXT DEFAULT 'professional', -- 'professional', 'casual', 'motivational'
  
  notification_settings JSONB DEFAULT '{}',
  dashboard_layout JSONB DEFAULT '{}',
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Row-Level Security (RLS) Policies

```sql
-- Users can only see their own data and their team's data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own team"
  ON users FOR SELECT
  USING (
    auth.uid() = id OR
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
  );

-- Matches visible to team members
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team sees own matches"
  ON matches FOR SELECT
  USING (
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
  );

-- Similar policies for all tables...
```

---

## 4. Advanced Metrics Engine

### 4.1 Architecture

The **Advanced Metrics Engine** is a separate FastAPI microservice that:
1. Receives raw GRID match data via webhook or batch processing
2. Calculates all Advanced Metrics using statistical models
3. Stores results back to Supabase
4. Provides real-time query endpoints for "what-if" scenarios

### 4.2 Decision Swing Value (DSV) Calculation

**Definition:** Quantifies the change in win probability caused by a specific decision.

**Algorithm:**

```python
def calculate_dsv(event: MatchEvent, match_state: MatchState) -> float:
    """
    DSV = (Win_Prob_After - Win_Prob_Before) * Decision_Weight
    """
    
    # 1. Extract match state features at event time
    features = extract_state_features(match_state, event.timestamp)
    # Features: gold_diff, dragon_count, tower_diff, level_diff, baron_alive, etc.
    
    # 2. Calculate baseline win probability BEFORE event
    win_prob_before = win_probability_model.predict(features)
    
    # 3. Update features with event outcome
    features_after = apply_event_outcome(features, event)
    
    # 4. Calculate win probability AFTER event
    win_prob_after = win_probability_model.predict(features_after)
    
    # 5. Calculate raw delta
    delta = win_prob_after - win_prob_before
    
    # 6. Apply decision weight based on event type
    decision_weight = get_decision_weight(event.type)
    # Major objectives (Baron, Elder): 1.5x
    # Teamfights: 1.2x
    # Solo kills: 1.0x
    # CS advantages: 0.8x
    
    dsv = delta * decision_weight * 100  # Convert to percentage points
    
    return round(dsv, 2)
```

**Win Probability Model:**
- **Type:** Gradient Boosted Trees (XGBoost or LightGBM)
- **Training Data:** Historical professional LoL/VAL matches with known outcomes
- **Features (LoL):**
  - Gold differential
  - Tower differential
  - Dragon/Baron control
  - Level advantage
  - CS differential
  - Game time (normalized)
  - Champion composition strength (if available)
  
- **Features (VALORANT):**
  - Round score differential
  - Economy advantage (credits)
  - Ultimate availability count
  - Spike plant status
  - Map control (sites)
  - Agent composition strength

**Output:** Win probability from 0.0 to 1.0

### 4.3 Tempo Leak Score

**Definition:** Measures "wasted" gold/pressure due to inefficiencies.

**Algorithm:**

```python
def calculate_tempo_leak(player_stats: PlayerStats, match_events: List[Event]) -> float:
    """
    Tempo Leak = Sum of weighted inefficiency scores
    """
    leak_score = 0.0
    
    # 1. Solo death penalty
    solo_deaths = count_solo_deaths(player_stats, match_events)
    leak_score += solo_deaths * 150  # ~150 gold per solo death
    
    # 2. CS deficit vs expected
    expected_cs = calculate_expected_cs(player_stats.role, player_stats.game_time)
    cs_deficit = max(0, expected_cs - player_stats.cs)
    leak_score += cs_deficit * 20  # ~20 gold per CS
    
    # 3. Wasted summoner spells (LoL)
    wasted_spells = count_wasted_summoners(match_events, player_stats.player_id)
    leak_score += wasted_spells * 100
    
    # 4. Bad recall timings (missed waves)
    missed_waves = detect_inefficient_recalls(match_events, player_stats)
    leak_score += missed_waves * 120  # ~gold per wave
    
    # 5. Utility waste (VALORANT)
    if game == 'valorant':
        wasted_utility = count_wasted_utility(match_events, player_stats)
        leak_score += wasted_utility * 50  # Per wasted ability
    
    return round(leak_score, 2)
```

### 4.4 Objective Participation Efficiency (OPE)

**Definition:** How effectively a player contributes to contested objectives.

**Algorithm:**

```python
def calculate_ope(player_stats: PlayerStats, objective_events: List[ObjectiveEvent]) -> float:
    """
    OPE = (Player_Contribution_Score / Team_Total_Score) * Presence_Factor
    """
    
    ope_scores = []
    
    for obj_event in objective_events:
        # 1. Check if player was present (within radius)
        if not is_player_present(player_stats.player_id, obj_event):
            ope_scores.append(0)
            continue
        
        # 2. Calculate contribution components
        damage_score = player_damage_in_event(player_stats, obj_event) / obj_event.total_damage
        cc_score = player_cc_in_event(player_stats, obj_event) / obj_event.total_cc
        vision_score = player_vision_contribution(player_stats, obj_event)
        
        # 3. Weighted contribution
        contribution = (
            damage_score * 0.4 +
            cc_score * 0.3 +
            vision_score * 0.3
        )
        
        # 4. Normalize by team size (usually 5)
        ope_scores.append(contribution * 5)
    
    # Average across all contested objectives
    return round(mean(ope_scores) * 100, 2) if ope_scores else 0.0
```

### 4.5 Objective Gravity (LoL) / Utility Efficiency (VAL)

**Objective Gravity (LoL):**

```python
def calculate_objective_gravity(player_stats: PlayerStats, objective_events: List[ObjectiveEvent]) -> float:
    """
    Measures presence/impact around neutral objectives relative to team
    """
    
    player_gravity = 0.0
    
    for obj in objective_events:
        # Distance-weighted presence
        distance = calculate_distance(player_stats.position, obj.position)
        
        if distance < 2000:  # Within objective radius
            proximity_score = 1.0 - (distance / 2000)
            
            # Multiply by actions taken
            actions = count_player_actions_near_objective(player_stats, obj)
            player_gravity += proximity_score * actions
    
    # Normalize by team average
    team_avg_gravity = calculate_team_avg_gravity(player_stats.team_id, objective_events)
    
    relative_gravity = player_gravity / team_avg_gravity if team_avg_gravity > 0 else 0
    
    return round(relative_gravity * 100, 2)
```

**Utility Efficiency (VALORANT):**

```python
def calculate_utility_efficiency(player_stats: PlayerStats, utility_events: List[UtilityEvent]) -> float:
    """
    Value generated per credit spent on utility
    """
    
    total_value = 0.0
    total_cost = 0.0
    
    for util in utility_events:
        if util.player_id != player_stats.player_id:
            continue
        
        # Get utility cost (smoke = 200, flash = 250, etc.)
        cost = UTILITY_COSTS[util.ability_name]
        total_cost += cost
        
        # Calculate value generated
        value = 0.0
        
        # Value from kills enabled
        value += util.kills_enabled * 200
        
        # Value from plants enabled
        value += util.plants_enabled * 300
        
        # Value from denies
        value += util.site_denies * 150
        
        # Value from duration of effect
        value += util.duration_seconds * 10
        
        total_value += value
    
    efficiency = (total_value / total_cost) if total_cost > 0 else 0
    
    return round(efficiency, 2)
```

### 4.6 FastAPI Endpoints

```python
# metrics_service/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

class MatchDataInput(BaseModel):
    grid_match_id: str
    grid_data: Dict

class MetricsOutput(BaseModel):
    match_id: str
    player_metrics: List[Dict]
    match_events: List[Dict]

@app.post("/calculate-metrics", response_model=MetricsOutput)
async def calculate_match_metrics(data: MatchDataInput):
    """
    Main endpoint: receives GRID data, returns all calculated metrics
    """
    # 1. Parse GRID data
    parsed_data = parse_grid_data(data.grid_data)
    
    # 2. Calculate win probability timeline
    win_prob_timeline = calculate_win_probability_timeline(parsed_data)
    
    # 3. Calculate DSV for each event
    events_with_dsv = calculate_all_dsv(parsed_data.events, win_prob_timeline)
    
    # 4. Calculate player metrics
    player_metrics = []
    for player in parsed_data.players:
        metrics = {
            "player_id": player.id,
            "dsv_contribution": calculate_player_dsv_sum(player, events_with_dsv),
            "tempo_leak_score": calculate_tempo_leak(player, parsed_data.events),
            "ope": calculate_ope(player, parsed_data.objective_events),
            "objective_gravity": calculate_objective_gravity(player, parsed_data.objectives),
            # ... other metrics
        }
        player_metrics.append(metrics)
    
    # 5. Return results
    return MetricsOutput(
        match_id=data.grid_match_id,
        player_metrics=player_metrics,
        match_events=events_with_dsv
    )

class WhatIfInput(BaseModel):
    match_state: Dict
    event_id: str
    alternative_decision: str

@app.post("/what-if-simulate")
async def simulate_what_if(data: WhatIfInput):
    """
    What-if simulator: predicts outcome of alternative decision
    """
    # 1. Load match state at event time
    state = MatchState.from_dict(data.match_state)
    
    # 2. Apply alternative decision
    alt_state = apply_alternative(state, data.alternative_decision)
    
    # 3. Predict new win probability
    baseline_wp = win_probability_model.predict(state.features)
    alternative_wp = win_probability_model.predict(alt_state.features)
    
    delta = alternative_wp - baseline_wp
    
    # 4. Generate narrative
    narrative = generate_what_if_narrative(
        data.alternative_decision,
        baseline_wp,
        alternative_wp,
        delta
    )
    
    return {
        "baseline_win_prob": round(baseline_wp * 100, 2),
        "alternative_win_prob": round(alternative_wp * 100, 2),
        "delta": round(delta * 100, 2),
        "narrative": narrative
    }
```

---

## 5. API Layer Design

### 5.1 Next.js API Routes

**Authentication Routes** (`/api/auth/*`)
- Handled by NextAuth.js
- `/api/auth/[...nextauth]` - OAuth callback, session management

**Match Routes** (`/api/matches/*`)
```typescript
// GET /api/matches
// Returns paginated matches for user's team
export async function GET(request: Request) {
  const session = await getServerSession();
  const user = await getUserWithTeam(session.user.id);
  
  const matches = await supabase
    .from('matches')
    .select('*, player_metrics(*)')
    .eq('team_id', user.team_id)
    .order('match_date', { ascending: false })
    .limit(20);
  
  return Response.json(matches);
}

// GET /api/matches/[id]
// Returns full match details with events
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const match = await supabase
    .from('matches')
    .select(`
      *,
      match_events(*),
      player_metrics(*, users(*))
    `)
    .eq('id', params.id)
    .single();
  
  return Response.json(match);
}

// POST /api/matches/sync
// Trigger sync of new matches from GRID
export async function POST(request: Request) {
  const { teamId } = await request.json();
  
  // Call GRID API
  const gridMatches = await fetchGridMatches(teamId);
  
  // Process each match through metrics engine
  for (const match of gridMatches) {
    await processMatchThroughEngine(match);
  }
  
  return Response.json({ synced: gridMatches.length });
}
```

**Agenda Routes** (`/api/agendas/*`)
```typescript
// POST /api/agendas/generate
// Auto-generate review agenda for a match
export async function POST(request: Request) {
  const { matchId } = await request.json();
  
  // 1. Get all events with high DSV magnitude
  const criticalEvents = await supabase
    .from('match_events')
    .select('*')
    .eq('match_id', matchId)
    .or('dsv.gt.10,dsv.lt.-10')
    .order('abs(dsv)', { ascending: false })
    .limit(10);
  
  // 2. Build agenda items
  const items = criticalEvents.map((event, i) => ({
    priority: i + 1,
    title: generateEventTitle(event),
    dsv: event.dsv,
    event_id: event.id,
    timestamp: event.game_time_seconds,
    notes: generateAutoNotes(event)
  }));
  
  // 3. Create agenda
  const agenda = await supabase
    .from('review_agendas')
    .insert({
      match_id: matchId,
      title: `Auto-Generated Review - ${new Date().toLocaleDateString()}`,
      items: JSON.stringify(items)
    })
    .select()
    .single();
  
  return Response.json(agenda);
}
```

**Drill Routes** (`/api/drills/*`)
```typescript
// POST /api/drills
// Create and assign a drill
export async function POST(request: Request) {
  const session = await getServerSession();
  const drillData = await request.json();
  
  const drill = await supabase
    .from('drills')
    .insert({
      created_by: session.user.id,
      assigned_to: drillData.playerId,
      title: drillData.title,
      description: drillData.description,
      drill_type: drillData.type,
      game: drillData.game,
      related_metric: drillData.metric,
      instructions: drillData.instructions
    })
    .select()
    .single();
  
  // Send notification
  await createNotification({
    user_id: drillData.playerId,
    type: 'drill_assigned',
    title: 'New Training Drill',
    message: `Your coach assigned: ${drillData.title}`,
    link_url: `/player/drills/${drill.id}`
  });
  
  return Response.json(drill);
}
```

**Voice Query Route** (`/api/henry/query`)
```typescript
// POST /api/henry/query
// Process natural language query via LLM
export async function POST(request: Request) {
  const { query, context } = await request.json();
  
  // 1. Send to OpenAI with context
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are Coach Henry, a tactical esports AI assistant. 
                  User context: ${JSON.stringify(context)}.
                  Parse the user's query and return structured data.`
      },
      {
        role: "user",
        content: query
      }
    ],
    functions: [
      {
        name: "filter_events",
        description: "Filter match events by criteria",
        parameters: {
          type: "object",
          properties: {
            event_type: { type: "string" },
            player_id: { type: "string" },
            time_range: { type: "array" }
          }
        }
      },
      {
        name: "explain_metric",
        description: "Explain a specific metric",
        parameters: {
          type: "object",
          properties: {
            metric_name: { type: "string" }
          }
        }
      }
    ]
  });
  
  // 2. Execute the parsed action
  const response = completion.choices[0].message;
  
  if (response.function_call) {
    const result = await executeHenryAction(
      response.function_call.name,
      JSON.parse(response.function_call.arguments)
    );
    
    return Response.json({
      type: 'data',
      data: result,
      narration: response.content
    });
  }
  
  return Response.json({
    type: 'text',
    narration: response.content
  });
}
```

### 5.2 Supabase Edge Functions

**Real-time Match Updates** (`supabase/functions/match-webhook`)
```typescript
// Receives webhook from GRID when new match data available
Deno.serve(async (req) => {
  const payload = await req.json();
  
  // 1. Validate webhook signature
  if (!validateGridWebhook(req.headers, payload)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // 2. Forward to metrics engine
  const metricsResponse = await fetch(
    `${METRICS_ENGINE_URL}/calculate-metrics`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grid_match_id: payload.match_id,
        grid_data: payload.data
      })
    }
  );
  
  const metrics = await metricsResponse.json();
  
  // 3. Store in Supabase
  await storeMatchMetrics(metrics);
  
  // 4. Trigger real-time updates to connected clients
  await supabaseClient
    .from('matches')
    .select('*')
    .eq('grid_match_id', payload.match_id)
    .single();
  
  return new Response('OK', { status: 200 });
});
```

---

## 6. Frontend Architecture

### 6.1 App Router Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── callback/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx                    # Shared dashboard shell
│   ├── coach/
│   │   ├── page.tsx                  # Analytics Overview
│   │   ├── agenda/
│   │   │   ├── page.tsx              # Agenda List
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Agenda Detail
│   │   ├── vod/
│   │   │   ├── page.tsx              # VOD Sessions List
│   │   │   └── [matchId]/
│   │   │       └── page.tsx          # 3D VOD Player
│   │   ├── simulator/
│   │   │   └── page.tsx              # What-If Simulator
│   │   └── training/
│   │       └── page.tsx              # Training Scheduler
│   └── player/
│       ├── page.tsx                  # Performance Overview
│       ├── drills/
│       │   ├── page.tsx              # Drills List
│       │   └── [id]/
│       │       └── page.tsx          # Drill Detail
│       ├── team/
│       │   └── page.tsx              # Coordination Gaps
│       ├── benchmarks/
│       │   └── page.tsx              # Personal Benchmarks
│       └── matches/
│           ├── page.tsx              # Matches List
│           └── [id]/
│               └── page.tsx          # Match Detail
├── api/
│   ├── auth/[...nextauth]/
│   │   └── route.ts
│   ├── matches/
│   │   ├── route.ts
│   │   ├── [id]/
│   │   │   └── route.ts
│   │   └── sync/
│   │       └── route.ts
│   ├── agendas/
│   │   ├── route.ts
│   │   └── generate/
│   │       └── route.ts
│   ├── drills/
│   │   └── route.ts
│   └── henry/
│       └── query/
│           └── route.ts
└── layout.tsx                        # Root layout
```

### 6.2 Component Architecture

**Core Design System Components** (`components/ui/`)

```typescript
// components/ui/glass-card.tsx
// Glassmorphic card with tactical grid overlay
export function GlassCard({ 
  children, 
  variant = 'default',
  glow = false 
}: GlassCardProps) {
  return (
    <div className={cn(
      "relative rounded-lg backdrop-blur-xl border overflow-hidden",
      "bg-gradient-to-br from-slate-900/40 to-slate-800/20",
      "border-cyan-500/20",
      glow && "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
      "before:absolute before:inset-0",
      "before:bg-[url('/grid-pattern.svg')] before:opacity-5"
    )}>
      {children}
    </div>
  );
}

// components/ui/metric-display.tsx
// Animated metric display with holographic effect
export function MetricDisplay({
  value,
  label,
  trend,
  format = 'number'
}: MetricDisplayProps) {
  const formattedValue = formatMetric(value, format);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="text-5xl font-bold font-display text-cyan-400">
        <AnimatedNumber value={value} />
        {format === 'percentage' && '%'}
      </div>
      <div className="text-sm text-slate-400 mt-1">{label}</div>
      {trend && <TrendIndicator value={trend} />}
      
      {/* Holographic scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 animate-scan" />
    </motion.div>
  );
}
```

**Advanced Components** (`components/features/`)

```typescript
// components/features/performance-radar.tsx
// Cross-game radar chart with shadow comparison
export function PerformanceRadar({
  playerMetrics,
  comparisonData,
  game
}: PerformanceRadarProps) {
  const metrics = game === 'lol' 
    ? ['OPE', 'DSV Contrib', 'Obj Gravity', 'Tempo Leak (inv)', 'Mechanical']
    : ['OPE', 'DSV Contrib', 'Util Efficiency', 'Tempo Leak (inv)', 'ACS'];
  
  const chartData = metrics.map(metric => ({
    metric,
    player: normalizeMetric(playerMetrics[metric]),
    baseline: normalizeMetric(comparisonData[metric])
  }));
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="#1e293b" />
        <PolarAngleAxis 
          dataKey="metric" 
          tick={{ fill: '#94a3b8', fontSize: 12 }}
        />
        <PolarRadiusAxis angle={90} domain={[0, 100]} />
        
        {/* Shadow baseline */}
        <Radar
          name="Pro Baseline"
          dataKey="baseline"
          stroke="#64748b"
          fill="#64748b"
          fillOpacity={0.2}
        />
        
        {/* Player data */}
        <Radar
          name="Player"
          dataKey="player"
          stroke="#06b6d4"
          fill="#06b6d4"
          fillOpacity={0.5}
        />
        
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// components/features/win-prob-timeline.tsx
// Interactive timeline showing win probability + DSV events
export function WinProbTimeline({
  matchId,
  events
}: WinProbTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  return (
    <GlassCard glow>
      <div className="p-6">
        <h3 className="text-xl font-display text-cyan-400 mb-4">
          Win Probability Timeline
        </h3>
        
        {/* Main timeline chart */}
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={generateTimelineData(events)}>
            <defs>
              <linearGradient id="winProb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatGameTime}
              stroke="#64748b"
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="#64748b"
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="winProb"
              stroke="#06b6d4"
              fill="url(#winProb)"
            />
            
            {/* Critical event markers */}
            {events.filter(e => Math.abs(e.dsv) > 10).map(event => (
              <ReferenceDot
                key={event.id}
                x={event.game_time_seconds}
                y={event.win_prob_after}
                r={6}
                fill={event.dsv > 0 ? "#10b981" : "#ef4444"}
                stroke="#fff"
                strokeWidth={2}
                onClick={() => setSelectedEvent(event)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Selected event detail */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-cyan-500/20"
          >
            <EventDetail event={selectedEvent} />
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
}

// components/features/vod-scrubber.tsx
// Color-coded VOD timeline with DSV markers
export function VODScrubber({
  matchId,
  events,
  onSeek
}: VODScrubberProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const duration = Math.max(...events.map(e => e.game_time_seconds));
  
  // Group events into 10-second segments
  const segments = useMemo(() => {
    const segmentSize = 10;
    const numSegments = Math.ceil(duration / segmentSize);
    
    return Array.from({ length: numSegments }, (_, i) => {
      const start = i * segmentSize;
      const end = start + segmentSize;
      
      const segmentEvents = events.filter(
        e => e.game_time_seconds >= start && e.game_time_seconds < end
      );
      
      const avgDSV = segmentEvents.length > 0
        ? segmentEvents.reduce((sum, e) => sum + e.dsv, 0) / segmentEvents.length
        : 0;
      
      return {
        start,
        end,
        avgDSV,
        color: getDSVColor(avgDSV)
      };
    });
  }, [events, duration]);
  
  return (
    <div className="relative h-16 bg-slate-900 rounded-lg overflow-hidden">
      {/* Segment visualization */}
      <div className="flex h-full">
        {segments.map((segment, i) => (
          <div
            key={i}
            className="flex-1 cursor-pointer transition-all hover:brightness-125"
            style={{
              backgroundColor: segment.color,
              borderRight: '1px solid rgba(0,0,0,0.2)'
            }}
            onClick={() => onSeek(segment.start)}
          >
            <div className="w-full h-full relative">
              {/* Hover tooltip */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="text-xs font-bold text-white drop-shadow-lg">
                  {formatGameTime(segment.start)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Playhead */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{
          left: `${(currentTime / duration) * 100}%`
        }}
        animate={{ left: `${(currentTime / duration) * 100}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-white rounded-full shadow-lg" />
      </motion.div>
    </div>
  );
}
```

### 6.3 State Management

**Zustand Stores**

```typescript
// stores/match-store.ts
interface MatchState {
  currentMatch: Match | null;
  matches: Match[];
  loading: boolean;
  
  fetchMatches: () => Promise<void>;
  selectMatch: (matchId: string) => Promise<void>;
  syncNewMatches: () => Promise<void>;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  currentMatch: null,
  matches: [],
  loading: false,
  
  fetchMatches: async () => {
    set({ loading: true });
    const response = await fetch('/api/matches');
    const matches = await response.json();
    set({ matches, loading: false });
  },
  
  selectMatch: async (matchId) => {
    set({ loading: true });
    const response = await fetch(`/api/matches/${matchId}`);
    const match = await response.json();
    set({ currentMatch: match, loading: false });
  },
  
  syncNewMatches: async () => {
    await fetch('/api/matches/sync', { method: 'POST' });
    get().fetchMatches();
  }
}));

// stores/henry-store.ts
interface HenryState {
  animation: 'idle' | 'thinking' | 'pointing' | 'tilt';
  speaking: boolean;
  currentNarration: string | null;
  
  setAnimation: (animation: HenryState['animation']) => void;
  speak: (text: string) => Promise<void>;
  query: (question: string) => Promise<void>;
}

export const useHenryStore = create<HenryState>((set) => ({
  animation: 'idle',
  speaking: false,
  currentNarration: null,
  
  setAnimation: (animation) => set({ animation }),
  
  speak: async (text) => {
    set({ speaking: true, currentNarration: text });
    
    // Use Web Speech API
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
      set({ speaking: false, currentNarration: null });
    };
    
    speechSynthesis.speak(utterance);
  },
  
  query: async (question) => {
    set({ animation: 'thinking' });
    
    const response = await fetch('/api/henry/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: question })
    });
    
    const result = await response.json();
    
    set({ animation: 'pointing' });
    await get().speak(result.narration);
    set({ animation: 'idle' });
  }
}));
```

**React Query Setup**

```typescript
// lib/queries/matches.ts
export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const response = await fetch('/api/matches');
      return response.json();
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useMatch(matchId: string) {
  return useQuery({
    queryKey: ['matches', matchId],
    queryFn: async () => {
      const response = await fetch(`/api/matches/${matchId}`);
      return response.json();
    },
    enabled: !!matchId
  });
}

export function useGenerateAgenda(matchId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/agendas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendas', matchId] });
    }
  });
}
```

---

## 7. 3D Experience Layer (Coach Henry)

### 7.1 Henry Character Design

**Model Specifications:**
- **Format:** GLTF/GLB with embedded animations
- **Polycount:** ~15k triangles (optimized for web)
- **Rig:** Mixamo-compatible humanoid skeleton
- **Textures:** 2K PBR materials (albedo, normal, metallic/roughness)

**Appearance:**
- Professional tactical gear aesthetic
- Cloud9 team colors (navy, cyan accents)
- Holographic visor/glasses with data readouts
- Subtle sci-fi elements (tech panels on clothing)

**Animations (FBX exports from Mixamo):**
1. **Idle:** Standing with tablet, occasional clipboard checks, glasses adjustment
2. **Thinking:** Hand on chin, head tilt, contemplative
3. **Pointing:** Extends arm toward holograms, gestural emphasis
4. **Tilt:** Concerned expression, head shake, defensive posture (for high Tempo Leaks)
5. **Celebrating:** Fist pump, nod of approval (for positive DSV moments)

### 7.2 React Three Fiber Implementation

```typescript
// components/henry/henry-character.tsx
import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useHenryStore } from '@/stores/henry-store';

export function HenryCharacter() {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/henry.glb');
  const { actions, mixer } = useAnimations(animations, group);
  
  const animation = useHenryStore(state => state.animation);
  
  // Switch animations based on state
  useEffect(() => {
    const current = actions[animation];
    if (current) {
      current.reset().fadeIn(0.2).play();
      
      return () => {
        current.fadeOut(0.2);
      };
    }
  }, [animation, actions]);
  
  return (
    <group ref={group}>
      <primitive object={scene} scale={1.8} position={[0, -1, 0]} />
      
      {/* Subtle rim light for holographic effect */}
      <pointLight position={[2, 3, 2]} intensity={0.3} color="#06b6d4" />
      <pointLight position={[-2, 3, 2]} intensity={0.3} color="#3b82f6" />
    </group>
  );
}

// components/henry/henry-scene.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

export function HenryScene() {
  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 50 }}
        shadows
      >
        {/* Environment */}
        <Environment preset="night" />
        <ambientLight intensity={0.2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          castShadow
        />
        
        {/* Henry */}
        <HenryCharacter />
        
        {/* Floor shadow */}
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
        />
        
        {/* Interactive controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Speech bubble overlay */}
      <HenrySpeechBubble />
    </div>
  );
}

// components/henry/speech-bubble.tsx
export function HenrySpeechBubble() {
  const { currentNarration, speaking } = useHenryStore();
  
  if (!currentNarration) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute bottom-4 left-4 right-4"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 animate-pulse" />
          <p className="text-slate-100 text-sm leading-relaxed">
            {currentNarration}
          </p>
        </div>
        
        {speaking && (
          <div className="mt-2 flex gap-1">
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

### 7.3 Holographic Data Visualization

```typescript
// components/henry/holographic-metrics.tsx
// Floating 3D metrics display in Henry's scene
export function HolographicMetrics({ metrics }: { metrics: PlayerMetrics[] }) {
  return (
    <group position={[2, 0.5, 0]}>
      {metrics.map((metric, i) => (
        <HoloMetricCard
          key={metric.id}
          data={metric}
          position={[0, i * 0.4, 0]}
          rotation={[0, -Math.PI / 6, 0]}
        />
      ))}
    </group>
  );
}

function HoloMetricCard({ data, position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Glass panel */}
      <mesh>
        <planeGeometry args={[2, 0.3]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.2}
          transmission={0.9}
          roughness={0.2}
          color="#06b6d4"
        />
      </mesh>
      
      {/* Text */}
      <Text
        position={[-0.8, 0, 0.01]}
        fontSize={0.1}
        color="#06b6d4"
        anchorX="left"
      >
        {data.label}
      </Text>
      
      <Text
        position={[0.8, 0, 0.01]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="right"
        font="/fonts/orbitron-bold.ttf"
      >
        {data.value}
      </Text>
      
      {/* Animated edge glow */}
      <Edges color="#06b6d4" />
    </group>
  );
}
```

---

## 8. UI/UX Design System

### 8.1 Design Tokens

```typescript
// config/design-tokens.ts
export const designTokens = {
  colors: {
    // Base
    background: {
      primary: '#0a0e1a',    // Deep space navy
      secondary: '#131825',  // Slightly lighter
      tertiary: '#1e293b',   // Slate 800
    },
    
    // Cloud9 Brand
    brand: {
      cyan: '#06b6d4',       // Primary accent
      blue: '#3b82f6',       // Secondary accent
      navy: '#1e40af',       // Deep brand
    },
    
    // Status
    status: {
      success: '#10b981',    // Positive DSV
      warning: '#f59e0b',    // Caution
      danger: '#ef4444',     // Negative DSV
      info: '#06b6d4',       // Neutral
    },
    
    // Text
    text: {
      primary: '#f1f5f9',    // Slate 100
      secondary: '#94a3b8',  // Slate 400
      muted: '#64748b',      // Slate 500
    },
    
    // Glass effects
    glass: {
      background: 'rgba(15, 23, 42, 0.4)',
      border: 'rgba(6, 182, 212, 0.2)',
      glow: 'rgba(6, 182, 212, 0.15)',
    }
  },
  
  typography: {
    fonts: {
      display: 'var(--font-orbitron)',   // Headers, metrics
      body: 'var(--font-inter)',         // Body text
      mono: 'var(--font-jetbrains-mono)', // Code, timestamps
    },
    
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    }
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  effects: {
    glassBorder: '1px solid rgba(6, 182, 212, 0.2)',
    glassBlur: 'blur(20px)',
    glow: '0 0 30px rgba(6, 182, 212, 0.15)',
    glowStrong: '0 0 50px rgba(6, 182, 212, 0.3)',
    shadowSoft: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    shadowMedium: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
  },
  
  animations: {
    scanline: 'scan 2s linear infinite',
    dataStream: 'stream 3s linear infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  }
};
```

### 8.2 Global Styles & Animations

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --font-orbitron: 'Orbitron', sans-serif;
  --font-inter: 'Inter', sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', monospace;
}

@keyframes scan {
  0%, 100% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(100%);
  }
}

@keyframes stream {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

@keyframes glitch {
  0%, 100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
}

/* Grid pattern background */
.grid-pattern {
  background-image: 
    linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Scanline overlay */
.scanline-overlay {
  position: relative;
  overflow: hidden;
}

.scanline-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(6, 182, 212, 0.1) 50%,
    transparent 100%
  );
  animation: scan 2s linear infinite;
  pointer-events: none;
}

/* Holographic text effect */
.holo-text {
  background: linear-gradient(
    90deg,
    #06b6d4,
    #3b82f6,
    #06b6d4
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: stream 3s linear infinite;
}

/* Glass morphism utility */
.glass {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(6, 182, 212, 0.2);
}

/* Data stream background */
.data-stream {
  background: 
    linear-gradient(
      45deg,
      transparent 30%,
      rgba(6, 182, 212, 0.05) 50%,
      transparent 70%
    );
  background-size: 200% 200%;
  animation: stream 3s linear infinite;
}
```

### 8.3 Typography System

```typescript
// config/typography.ts
export const typographyClasses = {
  // Display (Orbitron - for headers, metrics)
  displayLarge: 'font-display text-6xl font-black tracking-tight',
  displayMedium: 'font-display text-4xl font-bold tracking-tight',
  displaySmall: 'font-display text-2xl font-bold tracking-tight',
  
  // Headings (Orbitron)
  h1: 'font-display text-3xl font-bold text-cyan-400',
  h2: 'font-display text-2xl font-bold text-slate-100',
  h3: 'font-display text-xl font-semibold text-slate-100',
  h4: 'font-display text-lg font-semibold text-slate-200',
  
  // Body (Inter)
  bodyLarge: 'font-body text-lg text-slate-200 leading-relaxed',
  bodyMedium: 'font-body text-base text-slate-300 leading-relaxed',
  bodySmall: 'font-body text-sm text-slate-400 leading-relaxed',
  
  // Monospace (JetBrains Mono - for timestamps, code)
  monoLarge: 'font-mono text-base text-cyan-400 tracking-wide',
  monoMedium: 'font-mono text-sm text-cyan-400 tracking-wide',
  monoSmall: 'font-mono text-xs text-cyan-400 tracking-wide',
  
  // Special effects
  metricValue: 'font-display text-5xl font-black text-cyan-400 holo-text',
  label: 'font-display text-xs uppercase tracking-wider text-slate-500',
};
```

### 8.4 Page-Specific UI Patterns

**Coach Analytics Overview**

```typescript
// app/(dashboard)/coach/page.tsx
export default function CoachAnalyticsPage() {
  return (
    <div className="min-h-screen bg-background-primary p-6">
      {/* Top stats bar */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <MetricCard
          value={73.2}
          label="Avg OPE"
          trend={+5.2}
          format="percentage"
        />
        <MetricCard
          value={-12.5}
          label="Avg DSV"
          trend={-3.1}
          format="number"
        />
        <MetricCard
          value={1247}
          label="Total Tempo Leak"
          trend={-120}
          format="number"
        />
        <MetricCard
          value={85.3}
          label="Obj Gravity"
          trend={+8.7}
          format="percentage"
        />
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Henry scene - takes 2 columns */}
        <div className="col-span-2">
          <GlassCard glow className="h-full">
            <HenryScene />
          </GlassCard>
        </div>
        
        {/* Recent matches sidebar */}
        <div>
          <GlassCard>
            <div className="p-6">
              <h3 className={typographyClasses.h3}>Recent Matches</h3>
              <MatchList limit={5} />
            </div>
          </GlassCard>
        </div>
        
        {/* Full-width agenda preview */}
        <div className="col-span-3">
          <AgendaPreviewCard />
        </div>
      </div>
    </div>
  );
}
```

**3D VOD Player**

```typescript
// app/(dashboard)/coach/vod/[matchId]/page.tsx
export default function VODPlayerPage({ params }) {
  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Left: 3D minimap replay */}
        <div className="col-span-2">
          <GlassCard glow className="h-[600px]">
            <VOD3DReplay matchId={params.matchId} />
          </GlassCard>
          
          {/* VOD scrubber */}
          <div className="mt-4">
            <VODScrubber matchId={params.matchId} />
          </div>
        </div>
        
        {/* Right: Event timeline */}
        <div>
          <GlassCard className="h-[600px] overflow-y-auto">
            <EventTimeline matchId={params.matchId} />
          </GlassCard>
        </div>
      </div>
      
      {/* Henry at bottom for commentary */}
      <div className="mt-6">
        <GlassCard>
          <div className="p-4 flex items-center gap-4">
            <div className="w-32 h-32">
              <HenryAvatar animation="pointing" />
            </div>
            <div className="flex-1">
              <HenryCommentary />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
```

**What-If Simulator**

```typescript
// app/(dashboard)/coach/simulator/page.tsx
export default function SimulatorPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [scenario, setScenario] = useState(null);
  
  return (
    <div className="min-h-screen bg-background-primary p-6">
      <h1 className={typographyClasses.h1 + ' mb-8'}>
        What-If Simulator
      </h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Select event */}
        <GlassCard>
          <div className="p-6">
            <h3 className={typographyClasses.h3 + ' mb-4'}>
              Select Critical Event
            </h3>
            <CriticalEventSelector onSelect={setSelectedEvent} />
          </div>
        </GlassCard>
        
        {/* Right: Define alternative */}
        <GlassCard>
          <div className="p-6">
            <h3 className={typographyClasses.h3 + ' mb-4'}>
              Alternative Decision
            </h3>
            <AlternativeDecisionForm 
              event={selectedEvent}
              onSubmit={setScenario}
            />
          </div>
        </GlassCard>
        
        {/* Full-width: Results comparison */}
        {scenario && (
          <div className="col-span-2">
            <GlassCard glow>
              <div className="p-6">
                <h3 className={typographyClasses.h2 + ' mb-6'}>
                  Simulation Results
                </h3>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Baseline */}
                  <div className="text-center">
                    <div className={typographyClasses.label + ' mb-2'}>
                      Actual Decision
                    </div>
                    <div className={typographyClasses.metricValue}>
                      {scenario.baseline_win_prob}%
                    </div>
                    <p className="text-slate-400 mt-2">
                      {scenario.actual_decision}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl text-cyan-400"
                    >
                      →
                    </motion.div>
                  </div>
                  
                  {/* Alternative */}
                  <div className="text-center">
                    <div className={typographyClasses.label + ' mb-2'}>
                      Alternative Decision
                    </div>
                    <div className={typographyClasses.metricValue}>
                      {scenario.alternative_win_prob}%
                    </div>
                    <p className="text-slate-400 mt-2">
                      {scenario.alternative_decision}
                    </p>
                  </div>
                  
                  {/* Delta */}
                  <div className="col-span-2 text-center">
                    <div className={typographyClasses.label + ' mb-2'}>
                      Win Probability Delta
                    </div>
                    <div className={cn(
                      typographyClasses.displayLarge,
                      scenario.delta > 0 ? 'text-green-400' : 'text-red-400'
                    )}>
                      {scenario.delta > 0 ? '+' : ''}{scenario.delta}%
                    </div>
                  </div>
                </div>
                
                {/* Henry's explanation */}
                <div className="border-t border-cyan-500/20 pt-6">
                  <HenryNarration text={scenario.narrative} />
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 9. Authentication & Authorization

### 9.1 NextAuth Configuration

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          hd: 'cloud9.gg', // Restrict to Cloud9 domain
        },
      },
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow @cloud9.gg emails
      if (!user.email?.endsWith('@cloud9.gg')) {
        return false;
      }
      
      // Create or update user in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (!existingUser) {
        // Auto-detect role from email pattern
        const role = detectRoleFromEmail(user.email);
        
        await supabase.from('users').insert({
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          role,
        });
      }
      
      return true;
    },
    
    async session({ session, token }) {
      // Fetch user with team data
      const { data: user } = await supabase
        .from('users')
        .select('*, teams(*)')
        .eq('email', session.user.email)
        .single();
      
      session.user = {
        ...session.user,
        id: user.id,
        role: user.role,
        team: user.teams,
      };
      
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

function detectRoleFromEmail(email: string): 'player' | 'coach' | 'admin' {
  if (email.includes('coach')) return 'coach';
  if (email.includes('admin')) return 'admin';
  return 'player';
}
```

### 9.2 Protected Routes Middleware

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Role-based route protection
    if (path.startsWith('/coach') && token?.role !== 'coach' && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/player', req.url));
    }
    
    if (path.startsWith('/player') && (token?.role === 'coach' || token?.role === 'admin')) {
      return NextResponse.redirect(new URL('/coach', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/coach/:path*', '/player/:path*'],
};
```

---

## 10. Real-time & State Management

### 10.1 Supabase Realtime Setup

```typescript
// lib/supabase/realtime.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function subscribeToMatchUpdates(
  teamId: string,
  callback: (payload: any) => void
) {
  const channel = supabase
    .channel(`team:${teamId}:matches`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'matches',
        filter: `team_id=eq.${teamId}`,
      },
      callback
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToDrillUpdates(
  userId: string,
  callback: (payload: any) => void
) {
  const channel = supabase
    .channel(`user:${userId}:drills`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'drills',
        filter: `assigned_to=eq.${userId}`,
      },
      callback
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}
```

### 10.2 React Hook Integration

```typescript
// hooks/use-realtime-matches.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { subscribeToMatchUpdates } from '@/lib/supabase/realtime';

export function useRealtimeMatches(teamId: string) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const unsubscribe = subscribeToMatchUpdates(teamId, (payload) => {
      // Invalidate matches query to refetch
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      
      // Show toast notification
      toast.success('New match data available!');
    });
    
    return unsubscribe;
  }, [teamId, queryClient]);
}
```

---

## 11. Live VOD Session Layer (Hybrid AI-Augmented Review)

### 11.1 Architecture Overview

**Concept:** Transform traditional VOD review into **AI-augmented coaching sessions** where real-time emotional/voice analysis enhances strategic insights.

**Flow:**
1. Coach schedules VOD session (match + time)
2. Players join via **integrated video call** (Teams-like interface)
3. **3D match replay** plays synchronized for all attendees
4. **Azure AI analyzes** participant emotions/voice in real-time
5. **Henry responds** to both match events AND team dynamics
6. Session auto-generates review notes with emotional context

```
┌─────────────────────────────────────────────────────────────────┐
│                    LIVE VOD SESSION                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │   Video Grid     │  │  3D Match        │  │  Henry AI     │ │
│  │   (Coach +       │  │  Replay          │  │  Analysis     │ │
│  │   Players)       │  │  (Synced)        │  │  Overlay      │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
│           ▼                     ▼                     ▼          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         AI ANALYSIS LAYER                                │   │
│  │  • Azure Face API (emotion detection)                    │   │
│  │  • Microsoft Speech (voice tone/stress)                  │   │
│  │  • Groq/OpenAI (context generation)                      │   │
│  │  • Supermemory (session memory)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│           ▼                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         HENRY REAL-TIME RESPONSES                        │   │
│  │  "I notice JAX seems frustrated during this fight.       │   │
│  │   Let's discuss the pathing decision calmly."            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Technology Stack

**Video Infrastructure:**
- **WebRTC:** Peer-to-peer video/audio (via LiveKit or Agora)
- **Fallback:** Microsoft Azure Communication Services

**AI Analysis Services:**
- **Emotion Detection:** Azure Face API
  - Detects: happiness, neutral, sadness, anger, surprise, fear, contempt
  - Real-time frame analysis (1fps sample rate)
  
- **Voice Analysis:** Microsoft Speech Services
  - Sentiment analysis from speech
  - Stress/frustration detection
  - Fallback: Deepgram / Google Speech-to-Text
  
- **Text-to-Speech:** ElevenLabs
  - Expressive synthesis for Henry
  - Multiple voice profiles (professional, motivational, casual)
  
- **LLM Processing:** Groq (fast inference) / OpenAI GPT-4
  - Contextual response generation
  - Combines match data + emotional context
  
- **Session Memory:** Supermemory.ai (opt-in)
  - Stores coaching patterns
  - Recalls previous discussions
  - Privacy-preserving local storage option

**On-Device Privacy Options:**
- **TensorFlow Lite / ONNX Runtime**
  - Local emotion detection (no cloud API calls)
  - Edge inference for sensitive teams

### 11.3 Live Session Components

#### Video Grid Component

```typescript
// components/vod-session/video-grid.tsx
import { useEffect, useRef, useState } from 'react';
import { LiveKitRoom, VideoTrack, AudioTrack } from '@livekit/react';
import { AzureFaceAnalyzer } from '@/lib/azure/face-api';

export function VODSessionVideoGrid({ 
  sessionId, 
  participants 
}: VODSessionVideoGridProps) {
  const [emotionData, setEmotionData] = useState<EmotionMap>({});
  const faceAnalyzer = useRef(new AzureFaceAnalyzer());
  
  // Analyze video frames for emotions
  const analyzeParticipantEmotion = async (
    participantId: string, 
    videoElement: HTMLVideoElement
  ) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Capture frame
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx?.drawImage(videoElement, 0, 0);
    
    // Convert to blob and send to Azure
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8);
    });
    
    const emotions = await faceAnalyzer.current.analyzeEmotion(blob);
    
    setEmotionData(prev => ({
      ...prev,
      [participantId]: emotions
    }));
    
    // Notify Henry if strong negative emotion detected
    if (emotions.anger > 0.6 || emotions.sadness > 0.5) {
      notifyHenryOfEmotionalState(participantId, emotions);
    }
  };
  
  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={sessionToken}
      onConnected={handleConnected}
    >
      <div className="grid grid-cols-3 gap-4 p-4">
        {participants.map(participant => (
          <ParticipantVideo
            key={participant.id}
            participant={participant}
            emotions={emotionData[participant.id]}
            onFrameCapture={(videoEl) => 
              analyzeParticipantEmotion(participant.id, videoEl)
            }
          />
        ))}
      </div>
    </LiveKitRoom>
  );
}

// components/vod-session/participant-video.tsx
export function ParticipantVideo({ 
  participant, 
  emotions,
  onFrameCapture 
}: ParticipantVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Capture frame every 1 second for emotion analysis
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        onFrameCapture(videoRef.current);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [onFrameCapture]);
  
  return (
    <div className="relative rounded-lg overflow-hidden bg-slate-900">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      
      {/* Emotion overlay */}
      {emotions && (
        <div className="absolute bottom-2 left-2 right-2">
          <EmotionIndicator emotions={emotions} />
        </div>
      )}
      
      {/* Name tag */}
      <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur px-2 py-1 rounded text-xs font-display text-cyan-400">
        {participant.name}
      </div>
    </div>
  );
}

// components/vod-session/emotion-indicator.tsx
export function EmotionIndicator({ emotions }: { emotions: EmotionData }) {
  const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
    a[1] > b[1] ? a : b
  );
  
  const emotionColor = {
    happiness: 'bg-green-500',
    neutral: 'bg-slate-500',
    anger: 'bg-red-500',
    sadness: 'bg-blue-500',
    surprise: 'bg-yellow-500',
    fear: 'bg-purple-500',
  }[dominantEmotion[0]];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 bg-slate-900/90 backdrop-blur rounded px-2 py-1"
    >
      <div className={`w-2 h-2 rounded-full ${emotionColor}`} />
      <span className="text-xs text-slate-300 capitalize">
        {dominantEmotion[0]}
      </span>
      <span className="text-xs text-slate-500">
        {Math.round(dominantEmotion[1] * 100)}%
      </span>
    </motion.div>
  );
}
```

#### Voice Analysis Integration

```typescript
// lib/azure/speech-analysis.ts
import { SpeechConfig, AudioConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

export class VoiceAnalyzer {
  private recognizer: SpeechRecognizer;
  
  constructor(subscriptionKey: string, region: string) {
    const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region);
    speechConfig.enableAudioLogging();
    
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    this.recognizer = new SpeechRecognizer(speechConfig, audioConfig);
  }
  
  async analyzeSentiment(audioStream: MediaStream): Promise<VoiceSentiment> {
    return new Promise((resolve) => {
      this.recognizer.recognized = (s, e) => {
        if (e.result.reason === ResultReason.RecognizedSpeech) {
          // Analyze prosody (tone, pitch, rate)
          const prosody = this.extractProsody(e.result);
          
          // Detect stress indicators
          const stressLevel = this.detectStress(prosody);
          
          resolve({
            text: e.result.text,
            sentiment: prosody.sentiment,
            stressLevel,
            confidence: e.result.confidence
          });
        }
      };
      
      this.recognizer.startContinuousRecognitionAsync();
    });
  }
  
  private extractProsody(result: any) {
    // Analyze pitch variance, speaking rate, volume
    const pitchVariance = result.pitchVariance || 0;
    const speakingRate = result.speakingRate || 1.0;
    const volume = result.volume || 0.5;
    
    // High pitch + fast rate + high volume = likely frustrated/stressed
    const sentiment = this.calculateSentiment(pitchVariance, speakingRate, volume);
    
    return { sentiment, pitchVariance, speakingRate, volume };
  }
  
  private detectStress(prosody: any): number {
    // Stress indicators:
    // - High pitch variance
    // - Fast speaking rate
    // - Volume spikes
    
    let stressScore = 0;
    
    if (prosody.pitchVariance > 50) stressScore += 0.3;
    if (prosody.speakingRate > 1.5) stressScore += 0.4;
    if (prosody.volume > 0.8) stressScore += 0.3;
    
    return Math.min(stressScore, 1.0);
  }
  
  private calculateSentiment(pitch: number, rate: number, volume: number): 'positive' | 'neutral' | 'negative' {
    const score = (pitch / 100) + (rate - 1) + (volume - 0.5);
    
    if (score > 0.5) return 'positive';
    if (score < -0.5) return 'negative';
    return 'neutral';
  }
}
```

#### Henry's Contextual Response System

```typescript
// lib/henry/contextual-responder.ts
import { EmotionData, VoiceSentiment } from '@/types';

export class HenryContextualResponder {
  async generateResponse(context: SessionContext): Promise<HenryResponse> {
    const { 
      matchEvent, 
      participantEmotions, 
      voiceSentiments,
      sessionHistory 
    } = context;
    
    // Combine all context
    const emotionalState = this.analyzeTeamEmotions(participantEmotions);
    const conversationTone = this.analyzeVoiceTones(voiceSentiments);
    
    // Generate contextual prompt
    const prompt = this.buildPrompt({
      event: matchEvent,
      emotions: emotionalState,
      tone: conversationTone,
      history: sessionHistory
    });
    
    // Get LLM response
    const response = await this.getLLMResponse(prompt);
    
    // Determine Henry's delivery style
    const deliveryStyle = this.selectDeliveryStyle(emotionalState);
    
    return {
      text: response,
      animation: this.selectAnimation(emotionalState, matchEvent),
      voiceProfile: deliveryStyle,
      priority: this.calculatePriority(emotionalState, matchEvent)
    };
  }
  
  private analyzeTeamEmotions(emotions: Record<string, EmotionData>) {
    const allEmotions = Object.values(emotions);
    
    const avgAnger = allEmotions.reduce((sum, e) => sum + (e.anger || 0), 0) / allEmotions.length;
    const avgSadness = allEmotions.reduce((sum, e) => sum + (e.sadness || 0), 0) / allEmotions.length;
    const avgHappiness = allEmotions.reduce((sum, e) => sum + (e.happiness || 0), 0) / allEmotions.length;
    
    return {
      overall: avgAnger > 0.5 || avgSadness > 0.5 ? 'negative' : 
               avgHappiness > 0.6 ? 'positive' : 'neutral',
      tension: avgAnger,
      frustration: avgSadness,
      engagement: avgHappiness
    };
  }
  
  private selectDeliveryStyle(emotionalState: TeamEmotionalState): VoiceProfile {
    if (emotionalState.overall === 'negative') {
      return 'calm_reassuring'; // Slow, steady, supportive
    }
    
    if (emotionalState.tension > 0.6) {
      return 'de_escalation'; // Measured, authoritative
    }
    
    if (emotionalState.engagement > 0.7) {
      return 'enthusiastic'; // Energetic, positive
    }
    
    return 'professional'; // Default balanced tone
  }
  
  private buildPrompt(context: any): string {
    return `You are Coach Henry, an AI tactical advisor for a professional esports team.

CURRENT SITUATION:
Match Event: ${context.event.type} at ${context.event.timestamp}
DSV Impact: ${context.event.dsv}
Team Emotional State: ${context.emotions.overall}
- Tension: ${(context.emotions.tension * 100).toFixed(0)}%
- Frustration: ${(context.emotions.frustration * 100).toFixed(0)}%
- Engagement: ${(context.emotions.engagement * 100).toFixed(0)}%

Conversation Tone: ${context.tone}

Recent Discussion:
${context.history.slice(-3).map(h => `${h.speaker}: ${h.message}`).join('\n')}

YOUR TASK:
1. Acknowledge the team's emotional state if it's relevant
2. Provide tactical insight on the match event
3. Keep the review constructive and focused
4. If tension is high, help de-escalate while maintaining authority
5. Keep response under 50 words

Respond as Coach Henry:`;
  }
  
  private async getLLMResponse(prompt: string): Promise<string> {
    // Use Groq for fast inference
    const response = await fetch(process.env.GROQ_API_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 100
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
}
```

#### Synchronized Replay System

```typescript
// components/vod-session/synchronized-replay.tsx
import { useEffect, useState } from 'react';
import { VOD3DReplay } from '@/components/vod/vod-3d-replay';
import { useRealtimeChannel } from '@/hooks/use-realtime-channel';

export function SynchronizedReplay({ 
  sessionId, 
  matchId,
  isHost 
}: SynchronizedReplayProps) {
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  
  const channel = useRealtimeChannel(`vod-session:${sessionId}`);
  
  // Host broadcasts playback state
  useEffect(() => {
    if (isHost) {
      channel.send({
        type: 'broadcast',
        event: 'playback-update',
        payload: { time: playbackTime, playing }
      });
    }
  }, [playbackTime, playing, isHost]);
  
  // Participants listen for playback updates
  useEffect(() => {
    if (!isHost) {
      channel.on('playback-update', (payload) => {
        setPlaybackTime(payload.time);
        setPlaying(payload.playing);
      });
    }
  }, [isHost]);
  
  return (
    <div className="relative">
      <VOD3DReplay
        matchId={matchId}
        currentTime={playbackTime}
        playing={playing}
        onTimeUpdate={isHost ? setPlaybackTime : undefined}
      />
      
      {/* Playback controls (host only) */}
      {isHost && (
        <PlaybackControls
          playing={playing}
          onPlayPause={() => setPlaying(!playing)}
          onSeek={setPlaybackTime}
        />
      )}
    </div>
  );
}
```

### 11.4 Session Flow & UX

**Pre-Session:**
1. Coach creates VOD session via Training Scheduler
2. Selects match, time slot, attendees
3. System generates unique session link
4. Participants receive calendar invite + notification

**During Session:**
1. All participants join video call
2. Coach shares screen with 3D replay (or uses synchronized replay)
3. Azure AI begins analyzing emotions/voice in background
4. Henry's avatar appears in corner, listening
5. When critical moment occurs OR emotional tension detected:
   - Henry interrupts with insight
   - "I notice the team seems frustrated. Let's break down this Baron call objectively..."
6. Coach can ask Henry questions:
   - "Henry, what was our win probability before this fight?"
   - Henry responds with voice + data visualization
7. Session auto-generates notes with:
   - Timestamps of key discussions
   - Emotional context ("Team showed frustration during midlane discussion")
   - Action items
   - Follow-up drills

**Post-Session:**
1. Recording saved to cloud (opt-in)
2. AI-generated summary sent to all participants
3. Drill assignments auto-created based on discussion topics
4. Supermemory stores session context for future reference

### 11.5 Privacy & Compliance

**User Controls:**
- **Opt-in emotion tracking** (default: off)
- **Local-only processing** option (TensorFlow Lite instead of Azure)
- **Recording consent** required from all participants
- **Data retention** settings (auto-delete after 30 days)
- **Anonymization** for any shared analytics

**Compliance:**
- GDPR-compliant data handling
- SOC 2 Type II for video infrastructure
- End-to-end encryption for video streams
- Zero-knowledge architecture for sensitive teams

### 11.6 API Endpoints for Live Sessions

```typescript
// app/api/vod-sessions/[id]/join/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  
  // Generate LiveKit token for participant
  const token = await generateLiveKitToken({
    sessionId: params.id,
    userId: session.user.id,
    username: session.user.name,
    permissions: {
      canPublish: true,
      canSubscribe: true,
      canPublishData: session.user.role === 'coach'
    }
  });
  
  // Initialize Azure Face API client if enabled
  const faceApiEnabled = await checkUserPreference(
    session.user.id, 
    'emotion_tracking_enabled'
  );
  
  return Response.json({
    token,
    sessionConfig: {
      faceApiEnabled,
      voiceAnalysisEnabled: true,
      henryEnabled: true
    }
  });
}

// app/api/vod-sessions/[id]/emotion/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { participantId, imageBlob } = await request.json();
  
  // Call Azure Face API
  const emotions = await analyzeFaceEmotions(imageBlob);
  
  // Store in session context
  await storeEmotionData(params.id, participantId, emotions);
  
  // Check if Henry should respond
  const shouldRespond = await checkHenryResponseTrigger(
    params.id,
    emotions
  );
  
  if (shouldRespond) {
    const response = await generateHenryResponse({
      sessionId: params.id,
      trigger: 'emotion',
      emotionData: emotions
    });
    
    // Broadcast to session
    await broadcastToSession(params.id, {
      type: 'henry-response',
      data: response
    });
  }
  
  return Response.json({ success: true });
}
```

### 11.7 Implementation Priority

**Tier 1 (MVP):**
- Basic video grid (LiveKit integration)
- Synchronized replay playback
- Simple emotion display (no AI yet)

**Tier 2 (AI Integration):**
- Azure Face API emotion detection
- Voice sentiment analysis
- Henry contextual responses

**Tier 3 (Advanced):**
- Supermemory session history
- Auto-generated review notes
- Privacy-preserving local processing

---

## 12. Implementation Tiers & Roadmap

### 12.1 Tier 1: Core Foundation (Days 1-2)

**Priority:** Must-have for basic demo

1. ✅ **Project Setup**
   - Initialize Next.js with TypeScript
   - Configure Tailwind + design tokens
   - Set up Supabase project
   - Install core dependencies

2. ✅ **Authentication**
   - NextAuth with Google OAuth
   - User role detection
   - Protected routes

3. ✅ **Database Schema**
   - Create all tables
   - Set up RLS policies
   - Seed test data

4. ✅ **GRID API Integration**
   - Fetch match data
   - Parse into internal format
   - Store in Supabase

5. ✅ **Basic Metrics Engine**
   - FastAPI service skeleton
   - DSV calculation (simplified)
   - Win probability model (basic)

### 12.2 Tier 2: Core Features (Days 3-4)

**Priority:** Essential for judge impact

1. ✅ **Coach Dashboard**
   - Analytics overview page
   - Metric cards with live data
   - Match list

2. ✅ **Player Dashboard**
   - Performance overview
   - Personal radar chart
   - Top leaks display

3. ✅ **Henry 3D Character**
   - Model import (GLTF)
   - Basic animations (idle, thinking)
   - Scene setup with R3F

4. ✅ **Review Agenda Generator**
   - Auto-generate from DSV
   - Display agenda items
   - Export capability

5. ✅ **Win Probability Timeline**
   - Chart implementation
   - Event markers
   - Interactive tooltips

### 12.3 Tier 3: Differentiation Features (Days 5-6)

**Priority:** What makes you stand out

1. ✅ **3D VOD Replay**
   - Minimap 3D visualization
   - Event playback
   - VOD scrubber with color coding

2. ✅ **What-If Simulator**
   - Scenario input form
   - Win prob prediction
   - Results comparison UI
   - Henry narration integration

3. ✅ **Advanced Metrics Engine**
   - All metrics fully implemented
   - Tempo Leak calculation
   - OPE calculation
   - Objective Gravity / Utility Efficiency

4. ✅ **Henry Voice & Queries**
   - Text-to-speech integration
   - Natural language query parsing (LLM)
   - Context-aware responses

5. ✅ **Training Drills System**
   - Drill creation form
   - Assignment to players
   - Status tracking
   - Notifications

### 12.4 Tier 4: Polish & Wow Factor (Day 7)

**Priority:** Final touches for maximum impact

1. ✅ **UI Polish**
   - Animations everywhere
   - Holographic effects
   - Scanline overlays
   - Loading states

2. ✅ **Performance Optimization**
   - Code splitting
   - Image optimization
   - R3F performance tuning

3. ✅ **Demo Flow**
   - Pre-loaded demo data
   - Smooth transitions
   - Recorded video backup

4. ✅ **Documentation**
   - README with screenshots
   - Architecture diagram
   - Devpost submission

5. ✅ **JetBrains Integration Showcase**
   - Plugin concept mockup
   - IDE screenshot in docs
   - AI Assistant usage examples

---

## 13. Technical Risk Mitigation

### 13.1 GRID API Risks

**Risk:** API downtime or rate limits during demo  
**Mitigation:**
- Cache all API responses in Redis
- Pre-fetch demo data during dev
- Create fallback mock data generator
- Store snapshots in JSON files

**Risk:** Data format changes  
**Mitigation:**
- Abstract GRID data behind parser layer
- Version API responses
- Unit tests for parser

### 13.2 3D Performance Risks

**Risk:** Henry scene lags on judge's machine  
**Mitigation:**
- Optimize model polycount (<15k)
- Use texture compression
- Implement LOD (level of detail)
- Provide 2D fallback mode
- Record demo video as backup

**Risk:** R3F incompatibility  
**Mitigation:**
- Test on multiple browsers
- Use stable R3F version (v8.15.0)
- Avoid experimental features

### 13.3 LLM Integration Risks

**Risk:** OpenAI API costs spike  
**Mitigation:**
- Cache common queries
- Implement rate limiting
- Use GPT-3.5 for dev, GPT-4 for demo only
- Pre-generate demo narrations

**Risk:** Slow response times  
**Mitigation:**
- Async processing with loading states
- Streaming responses where possible
- Pre-compute common scenarios

### 13.4 Time Management Risks

**Risk:** Feature creep delays core functionality  
**Mitigation:**
- Strict tier prioritization
- Daily checkpoint reviews
- Feature flags for non-essential items
- Prepare demo script focusing on Tier 1-3

---

## End of Design Document

This design document provides a comprehensive blueprint for implementing Livewire with all features specified in the PRD. The architecture is scalable, the UI is distinctive, and the implementation is structured to maximize impact during the hackathon judging.

**Next Steps:**
1. Review and approve this design
2. Set up development environment
3. Begin Tier 1 implementation
4. Daily progress check-ins against tiers

Good luck building Livewire! 🚀
