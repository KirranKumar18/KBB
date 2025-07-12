
// Use dynamic import for Supabase
let supabaseInstance = null;

const initSupabase = async () => {
  if (!supabaseInstance) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = 'https://cypdviizsrdrirfqujss.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cGR2aWl6c3JkcmlyZnF1anNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDcxOTgsImV4cCI6MjA2NzYyMzE5OH0.26qQGdq26fEkJOTxgrTBOdyxoKyfMyjNgbG3csF3h6c';
      supabaseInstance = createClient(supabaseUrl, supabaseKey);
    } catch (error) {
      console.error('Error initializing Supabase:', error);
      // Create a dummy client to prevent crashes
      supabaseInstance = {
        auth: {
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          getSession: async () => ({ data: { session: null } }),
          signOut: async () => ({})
        }
      };
    }
  }
  return supabaseInstance;
};

// Export a simplified interface
const supabase = {
  auth: {
    onAuthStateChange: async (callback) => {
      const client = await initSupabase();
      return client.auth.onAuthStateChange(callback);
    },
    getSession: async () => {
      const client = await initSupabase();
      return client.auth.getSession();
    },
    signOut: async () => {
      const client = await initSupabase();
      return client.auth.signOut();
    },
    signInWithPassword: async (credentials) => {
      const client = await initSupabase();
      return client.auth.signInWithPassword(credentials);
    },
    signUp: async (credentials) => {
      const client = await initSupabase();
      return client.auth.signUp(credentials);
    },
    resend: async (options) => {
      const client = await initSupabase();
      return client.auth.resend(options);
    }
  }
};

export default supabase;

// THE SCHEMA OF THE TABLE IS id -> INT8  , Customer name -> TEXT, Order -> json, Ordered_At -> timestamp