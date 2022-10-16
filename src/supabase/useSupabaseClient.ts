import { useSupabaseClient as _useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from 'types/database.types';

export const useSupabaseClient = () => {
  const supabaseClient = _useSupabaseClient<Database>();

  return {
    auth: supabaseClient.auth,
    posts: supabaseClient.from('posts'),
    posts_claimed: supabaseClient.from('posts_claimed'),
    user_post: supabaseClient.from('user_post'),
    wishlists: supabaseClient.from('wishlists'),
    wishlist_post: supabaseClient.from('wishlist_post'),
    users: supabaseClient.from('users'),
    user_wishlist: supabaseClient.from('user_wishlist'),
  };
};
