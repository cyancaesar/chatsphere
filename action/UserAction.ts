'use server';

import Chat from '@/lib/Chat';
import User from '@/lib/User';
import logger from '@/lib/logger';
import { revalidatePath } from 'next/cache';

export async function searchUser(user: string) {
  const users = await User.getUserByName(user);
  // if (error) return { error };

  return users;
}

export async function getCurrentUser() {
  try {
    const user = await User.getCurrentUser();
    logger.debug({ user }, 'Current user');
    return user;
  } catch (e) {
    logger.error(e);
  }
}

export async function addFriend(user_id: string) {
  const data = await User.addFriend(user_id);
  // if (error) return { error };
  revalidatePath('/realm', 'layout');
  return data;
}
