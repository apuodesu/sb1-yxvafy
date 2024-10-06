import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uxwdoehfsetvxlaooskl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4d2RvZWhmc2V0dnhsYW9vc2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MTc0ODUsImV4cCI6MjA0MzI5MzQ4NX0.5pqNJ7VuYBn0sWFbblAQOxSwzsNI8FVTK5qBGHELH_k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)