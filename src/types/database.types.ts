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
          userId: string
          postId: string
        }
        Insert: {
          userId: string
          postId: string
        }
        Update: {
          userId?: string
          postId?: string
        }
      }
      user_post: {
        Row: {
          userId: string
          postId: string
        }
        Insert: {
          userId: string
          postId: string
        }
        Update: {
          userId?: string
          postId?: string
        }
      }
      user_wishlist: {
        Row: {
          userId: string
          wishlistId: string
        }
        Insert: {
          userId: string
          wishlistId: string
        }
        Update: {
          userId?: string
          wishlistId?: string
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
          wishlistId: string
          postId: string
        }
        Insert: {
          wishlistId: string
          postId: string
        }
        Update: {
          wishlistId?: string
          postId?: string
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

