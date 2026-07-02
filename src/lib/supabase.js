import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://homvyhpvnrhccmqsiuzx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbXZ5aHB2bnJoY2NtcXNpdXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMTEwNTUsImV4cCI6MjA5ODU4NzA1NX0.D86k-mr43KZe-tOwuaKrfr71cxccz_6vIwPlbYkvjko'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
