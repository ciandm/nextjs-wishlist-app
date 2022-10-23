import { useSupabaseClient as _useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from 'types/database.types';

export const useSupabaseClient = () => {
  const supabaseClient = _useSupabaseClient<Database>();

  return {
    auth: supabaseClient.auth,
    posts: supabaseClient.from('posts'),
    posts_claimed: supabaseClient.from('posts_claimed'),
    wishlists: supabaseClient.from('wishlists'),
    users: supabaseClient.from('users'),
    user_wishlist: supabaseClient.from('user_wishlist'),
  };
};
