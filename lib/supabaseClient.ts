import Constants from 'expo-constants';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const { extra } = Constants.expoConfig ?? {};

const supabaseUrl = extra?.supabaseUrl as string | undefined;
const supabaseAnonKey = extra?.supabaseAnonKey as string | undefined;

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabaseConfigErrorMessage =
  'Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_ANON_KEY in your environment.';

if (!isSupabaseConfigured) {
  console.warn(supabaseConfigErrorMessage);
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
