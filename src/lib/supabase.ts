import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
  console.warn('⚠️ Supabase environment variables are missing or using placeholders.');
  console.log('Current URL hint:', import.meta.env.VITE_SUPABASE_URL?.substring(0, 12) + '...');
} else {
  console.log('✅ Supabase client initialized with project:', import.meta.env.VITE_SUPABASE_URL.substring(0, 20) + '...');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'coach' | 'player';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  team_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
