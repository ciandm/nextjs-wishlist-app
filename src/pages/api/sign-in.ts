import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'types/database.types';

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,
    res,
  });
  const { email, password } = req.body;

  const { data, error } = await supabaseServerClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) return res.status(401).json({ error: error.message });

  return res.status(200).json({ user: data.user });
}
