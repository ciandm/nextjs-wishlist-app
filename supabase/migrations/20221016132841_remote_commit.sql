-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF SECURITY DEFINER
AS $BODY$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$BODY$;

ALTER FUNCTION public.handle_new_user()
    OWNER TO supabase_admin;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_admin;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO PUBLIC;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL,
    email text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_id_fkey FOREIGN KEY (id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.users TO anon;

GRANT ALL ON TABLE public.users TO postgres;

GRANT ALL ON TABLE public.users TO supabase_admin;

GRANT ALL ON TABLE public.users TO authenticated;

GRANT ALL ON TABLE public.users TO service_role;

CREATE TABLE IF NOT EXISTS public.posts
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    name text COLLATE pg_catalog."default",
    created_by uuid,
    price text COLLATE pg_catalog."default",
    url text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    CONSTRAINT posts_pkey PRIMARY KEY (id),
    CONSTRAINT posts_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.posts
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.posts TO anon;

GRANT ALL ON TABLE public.posts TO postgres;

GRANT ALL ON TABLE public.posts TO supabase_admin;

GRANT ALL ON TABLE public.posts TO authenticated;

GRANT ALL ON TABLE public.posts TO service_role;

CREATE TABLE IF NOT EXISTS public.wishlists
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    name character varying COLLATE pg_catalog."default",
    CONSTRAINT wishlists_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.wishlists
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.wishlists TO anon;

GRANT ALL ON TABLE public.wishlists TO postgres;

GRANT ALL ON TABLE public.wishlists TO supabase_admin;

GRANT ALL ON TABLE public.wishlists TO authenticated;

GRANT ALL ON TABLE public.wishlists TO service_role;

CREATE TABLE IF NOT EXISTS public.user_post
(
    "user_id" uuid NOT NULL,
    "post_id" uuid NOT NULL,
    CONSTRAINT user_post_pkey PRIMARY KEY ("user_id", "post_id"),
    CONSTRAINT "user_post_post_id_fkey" FOREIGN KEY ("post_id")
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "user_post_user_id_fkey" FOREIGN KEY ("user_id")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.wishlist_post
(
    "wishlist_id" uuid NOT NULL,
    "post_id" uuid,
    CONSTRAINT wishlist_post_pkey PRIMARY KEY ("wishlist_id"),
    CONSTRAINT "wishlist_post_post_id_fkey" FOREIGN KEY ("post_id")
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "wishlist_post_wishlist_id_fkey" FOREIGN KEY ("wishlist_id")
        REFERENCES public.wishlists (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.wishlist_post
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.wishlist_post TO anon;

GRANT ALL ON TABLE public.wishlist_post TO postgres;

GRANT ALL ON TABLE public.wishlist_post TO supabase_admin;

GRANT ALL ON TABLE public.wishlist_post TO authenticated;

GRANT ALL ON TABLE public.wishlist_post TO service_role;

ALTER TABLE IF EXISTS public.user_post
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.user_post TO anon;

GRANT ALL ON TABLE public.user_post TO postgres;

GRANT ALL ON TABLE public.user_post TO supabase_admin;

GRANT ALL ON TABLE public.user_post TO authenticated;

GRANT ALL ON TABLE public.user_post TO service_role;

CREATE TABLE IF NOT EXISTS public.user_wishlist
(
    "user_id" uuid NOT NULL,
    "wishlist_id" uuid NOT NULL,
    CONSTRAINT user_wishlist_pkey PRIMARY KEY ("user_id", "wishlist_id"),
    CONSTRAINT "user_wishlist_user_id_fkey" FOREIGN KEY ("user_id")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "user_wishlist_wishlist_id_fkey" FOREIGN KEY ("wishlist_id")
        REFERENCES public.wishlists (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_wishlist
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.user_wishlist TO anon;

GRANT ALL ON TABLE public.user_wishlist TO postgres;

GRANT ALL ON TABLE public.user_wishlist TO supabase_admin;

GRANT ALL ON TABLE public.user_wishlist TO authenticated;

GRANT ALL ON TABLE public.user_wishlist TO service_role;

CREATE TABLE IF NOT EXISTS public.posts_claimed
(
    "user_id" uuid NOT NULL,
    "post_id" uuid NOT NULL,
    CONSTRAINT posts_claimed_pkey PRIMARY KEY ("user_id", "post_id"),
    CONSTRAINT "posts_claimed_post_id_fkey" FOREIGN KEY ("post_id")
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "posts_claimed_user_id_fkey" FOREIGN KEY ("user_id")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.posts_claimed
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.posts_claimed TO anon;

GRANT ALL ON TABLE public.posts_claimed TO postgres;

GRANT ALL ON TABLE public.posts_claimed TO supabase_admin;

GRANT ALL ON TABLE public.posts_claimed TO authenticated;

GRANT ALL ON TABLE public.posts_claimed TO service_role;