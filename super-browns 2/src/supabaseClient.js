import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wxizssdougtfudgylzpz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aXpzc2RvdWd0ZnVkZ3lsenB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTU0NTcsImV4cCI6MjA5NjUzMTQ1N30.jbc-SxmlxgpezX6jZ_JSDMyAu2mv5i6HrWmdIvE-xQ0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
