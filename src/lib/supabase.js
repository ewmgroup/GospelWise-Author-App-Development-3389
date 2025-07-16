import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://avgfqqomcrhspguhsxno.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2ZxcW9tY3Joc3BndWhzeG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NjU4OTIsImV4cCI6MjA2NzE0MTg5Mn0.TkbGYWpkAwKBQhM2e198UMLZPzKsioH8NPcmsHhVFxs'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase