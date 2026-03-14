export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_user_id: string
          email: string
          display_name: string
          avatar_url: string | null
          family_info: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          email: string
          display_name: string
          avatar_url?: string | null
          family_info?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          email?: string
          display_name?: string
          avatar_url?: string | null
          family_info?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          title: string
          area: string
          target_ages: string | null
          is_public: boolean
          movie_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          area: string
          target_ages?: string | null
          is_public?: boolean
          movie_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          area?: string
          target_ages?: string | null
          is_public?: boolean
          movie_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trip_spots: {
        Row: {
          id: string
          trip_id: string
          place_name: string
          type: string
          icon: string | null
          latitude: number | null
          longitude: number | null
          start_time: string | null
          end_time: string | null
          order_index: number
          positive_comment: string | null
          failure_alert: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          place_name: string
          type?: string
          icon?: string | null
          latitude?: number | null
          longitude?: number | null
          start_time?: string | null
          end_time?: string | null
          order_index: number
          positive_comment?: string | null
          failure_alert?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          place_name?: string
          type?: string
          icon?: string | null
          latitude?: number | null
          longitude?: number | null
          start_time?: string | null
          end_time?: string | null
          order_index?: number
          positive_comment?: string | null
          failure_alert?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
    }
  }
}
