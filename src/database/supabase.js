
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://cypdviizsrdrirfqujss.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cGR2aWl6c3JkcmlyZnF1anNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDcxOTgsImV4cCI6MjA2NzYyMzE5OH0.26qQGdq26fEkJOTxgrTBOdyxoKyfMyjNgbG3csF3h6c'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

// THE SCHEMA OF THE TABLE IS id -> INT8  , Customer name -> TEXT, Order -> json, Ordered_At -> timestamp