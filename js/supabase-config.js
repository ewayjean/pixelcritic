import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase Credentials provided by user
const SUPABASE_URL = 'https://cmhgfunvxgblcsyhqema.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaGdmdW52eGdibGNzeWhxZW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTM2MjUsImV4cCI6MjEwMTYyOTYyNX0.ux0lSl7qbC6GdiPM4C3e5zlvN6MTJtLK2Ww8uu3-xDE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export function getReviewsTable() {
    return 'game_reviews';
}
