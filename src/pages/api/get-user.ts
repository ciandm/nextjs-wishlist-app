import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'types/database.types';

export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,
    res,
  });
  const user = await supabaseServerClient.auth.getUser();

  return res.status(200).json({ user });
}
