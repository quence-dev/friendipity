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
          email: string
          phone_number: string
          name: string
          photo_url: string | null
          is_available: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          phone_number: string
          name: string
          photo_url?: string | null
          is_available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone_number?: string
          name?: string
          photo_url?: string | null
          is_available?: boolean
          created_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          location: unknown // PostGIS geography type
          location_name: string | null
          scheduled_start_time: string | null
          start_time: string
          end_time: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          location: unknown
          location_name?: string | null
          scheduled_start_time?: string | null
          start_time?: string
          end_time: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          location?: unknown
          location_name?: string | null
          scheduled_start_time?: string | null
          start_time?: string
          end_time?: string
          is_active?: boolean
          created_at?: string
        }
      }
      activity_participants: {
        Row: {
          id: string
          activity_id: string
          user_id: string
          status: 'interested' | 'on_my_way' | 'arrived'
          created_at: string
        }
        Insert: {
          id?: string
          activity_id: string
          user_id: string
          status?: 'interested' | 'on_my_way' | 'arrived'
          created_at?: string
        }
        Update: {
          id?: string
          activity_id?: string
          user_id?: string
          status?: 'interested' | 'on_my_way' | 'arrived'
          created_at?: string
        }
      }
      push_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {
      get_mutual_friends_count: {
        Args: { user1_id: string; user2_id: string }
        Returns: number
      }
      are_friends: {
        Args: { user1_id: string; user2_id: string }
        Returns: boolean
      }
    }
    Enums: {}
  }
}