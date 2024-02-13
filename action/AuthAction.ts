'use server';

import { isUsernameExists } from '@/lib/userUtils';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 *
 * Sign in using Github
 */
export async function signInWithGithub() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `http://localhost:3000/auth/callback` },
  });
  console.log(data);
  if (error) {
    console.log(error);
    return;
  }
  return redirect(data.url);
}

/**
 *
 * Sign in action with email
 */
export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { success: false, error };
  }
  return { success: true, data: user };
}

/**
 *
 * Sign out action
 */
export async function signOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 *
 * Sign up with custom user_metadata
 * TODO: maybe the use of user_metadata will be abandoned
 */
export async function signUp({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const isExist = await isUsernameExists(username);
  if (isExist) return { success: false, error: 'Username exists' };

  // Sign up user with email and password
  const response = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  console.log(response);
  if (response.error) return { success: false, error: response.error.message };

  // Insert username and user_id into `users` table
  const user_id = response.data.user?.id as string;
  const userInsertion = await supabase
    .from('user')
    .insert({ user_id, username });
  if (userInsertion.error)
    return { success: false, error: userInsertion.error.message };

  return { success: true, user: response.data.user };
}
