import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://thzfluofcwgkwooydecd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoemZsdW9mY3dna3dvb3lkZWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk3Nzg3MzAsImV4cCI6MjAyNTM1NDczMH0.R9SkcU1J5ohlZKxZ76y_oP8k1TF5bX0FxOQURX2JjC4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };