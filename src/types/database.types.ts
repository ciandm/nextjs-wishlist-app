export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          created_at: string | null
          name: string | null
          user_id: string | null
          price: string | null
          url: string | null
          description: string | null
          is_favorited: boolean | null
          is_purchased: boolean | null
          wishlist_id: string
        }
        Insert: {
          id?: string
          created_at?: string | null
          name?: string | null
          user_id?: string | null
          price?: string | null
          url?: string | null
          description?: string | null
          is_favorited?: boolean | null
          is_purchased?: boolean | null
          wishlist_id: string
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string | null
          user_id?: string | null
          price?: string | null
          url?: string | null
          description?: string | null
          is_favorited?: boolean | null
          is_purchased?: boolean | null
          wishlist_id?: string
        }
      }
      posts_claimed: {
        Row: {
          user_id: string
          post_id: string
        }
        Insert: {
          user_id: string
          post_id: string
        }
        Update: {
          user_id?: string
          post_id?: string
        }
      }
      user_wishlist: {
        Row: {
          user_id: string
          wishlist_id: string
        }
        Insert: {
          user_id: string
          wishlist_id: string
        }
        Update: {
          user_id?: string
          wishlist_id?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string | null
          name: string | null
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
        }
      }
      wishlists: {
        Row: {
          id: string
          created_at: string | null
          name: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          name?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string | null
          user_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

