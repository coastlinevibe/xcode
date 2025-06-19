import { createClient } from '@supabase/supabase-js';

// Ensure URL has proper HTTPS protocol
const supabaseUrl = 'https://xrs1kxaerfloxavayrqg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyczFreGFlcmZsb3hhdmF5cnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4MzY5NzcsImV4cCI6MjAyNjQxMjk3N30.YF-CiWlM1lmQFmQXn7YRQqHVGdQVGZOEOXGZxL5fPxM';

// Create client with retries and timeouts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

// Initialize storage and ensure connection
export const initializeStorage = async () => {
  try {
    // Test connection first
    const { data, error } = await supabase
      .from('sprites')
      .select('count')
      .limit(1)
      .single();

    if (error) {
      console.error('Error connecting to Supabase:', error);
      throw error;
    }

    // Check/create session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No session found, creating anonymous session...');
      const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
      
      if (signInError) {
        console.error('Error signing in anonymously:', signInError);
        throw signInError;
      }
      
      console.log('Anonymous session created successfully');
    } else {
      console.log('Existing session found');
    }

    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
};

// Ensure user is authenticated with retries
export const ensureAuthenticated = async (retries = 3) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log(`Attempt ${i + 1}: No session found, creating anonymous session...`);
        const { error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
      }
      
      const userData = await supabase.auth.getUser();
      if (userData.error) throw userData.error;
      
      console.log('Authentication successful');
      return userData;
    } catch (error) {
      console.error(`Authentication attempt ${i + 1} failed:`, error);
      lastError = error;
      
      // Wait before retrying (exponential backoff)
      if (i < retries - 1) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Failed to authenticate after multiple attempts');
};

// Storage bucket for assets
export const STORAGE_BUCKET = 'sprites';

// Sign in anonymously to get access to storage
export const signInAnonymously = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.signInAnonymously();
    
    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
    
    return session;
  } catch (error) {
    console.error('Error in signInAnonymously:', error);
    throw error;
  }
}; 