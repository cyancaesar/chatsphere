import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function isUsernameExists(username: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const userQuery = await supabase.from('user').select('username');
  if (userQuery.error) {
    throw new Error(userQuery.error.message);
  }
  const isUsernameExist =
    userQuery.data.findIndex((user) => user.username === username) === -1
      ? false
      : true;
  if (isUsernameExist) return true;
  return false;
}
