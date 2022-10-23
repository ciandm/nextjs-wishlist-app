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
          created_by: string | null
          price: string | null
          url: string | null
          description: string | null
          is_favorited: boolean | null
          is_purchased: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          name?: string | null
          created_by?: string | null
          price?: string | null
          url?: string | null
          description?: string | null
          is_favorited?: boolean | null
          is_purchased?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string | null
          created_by?: string | null
          price?: string | null
          url?: string | null
          description?: string | null
          is_favorited?: boolean | null
          is_purchased?: boolean | null
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
      user_post: {
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
      wishlist_post: {
        Row: {
          wishlist_id: string
          post_id: string
        }
        Insert: {
          wishlist_id: string
          post_id: string
        }
        Update: {
          wishlist_id?: string
          post_id?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          created_at: string | null
          name: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          name?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string | null
          created_by?: string | null
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

