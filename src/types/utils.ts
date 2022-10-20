import { Database } from 'types/database.types';

export type MakeDatabaseKeysRequired<TInput extends Record<string, unknown>> = {
  [TKey in keyof TInput]-?: NonNullable<TInput[TKey]>;
};

export type DatabaseInsertValues<
  TKey extends keyof Database['public']['Tables']
> = MakeDatabaseKeysRequired<Database['public']['Tables'][TKey]['Insert']>;

export type Post = Database['public']['Tables']['posts']['Row'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];
export type Wishlist = Database['public']['Tables']['wishlists']['Row'];
