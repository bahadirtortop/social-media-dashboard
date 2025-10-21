import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Post = {
  id: number
  country_id: number
  topic_id: number
  content_title: string
  content_text: string
  image_url: string | null
  story_image_url: string | null
  status: string
  feed_status: string
  story_status: string
  shared_to_facebook: boolean
  shared_at: string | null
  story_shared_to_facebook: boolean
  story_shared_at: string | null
  facebook_post_id: string | null
  story_facebook_id: string | null
  created_at: string
}

export type Country = {
  id: number
  name: string
  flag_emoji: string
  active: boolean
  daily_limit: number
  usage_count: number
  last_reset: string
}

export type Topic = {
  id: number
  title: string
  active: boolean
  daily_limit: number
  usage_count: number
  last_reset: string
}

export type DashboardStats = {
  total_posts: number
  pending_posts: number
  approved_posts: number
  published_posts: number
  failed_posts: number
  today_posts: number
  active_countries: number
  active_topics: number
}
