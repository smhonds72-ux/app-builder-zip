import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export async function GET(request) {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      return Response.json({ 
        error: 'Supabase connection failed', 
        details: error.message 
      }, { status: 500 });
    }
    
    return Response.json({ 
      success: true,
      message: 'Supabase connection successful',
      data: data,
      env: {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
      }
    });
  } catch (err) {
    return Response.json({ 
      error: 'Server error', 
      details: err.message 
    }, { status: 500 });
  }
}
