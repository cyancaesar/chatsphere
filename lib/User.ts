import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import logger from './logger';
import type UserType from '@/lib/types/User';

export default class User {
  /**
   * getCurrentUser
   * @returns
   */
  static async getCurrentUser(): Promise<UserType> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const result = await supabase.auth.getUser();

    if (result.error) {
      logger.error(result.error);
      throw new Error('Unable to retrieve current user');
    }

    const user = await supabase
      .from('user')
      .select('user_id, username, avatar')
      .eq('user_id', result.data.user.id)
      .single();

    if (user.error)
      throw new Error('Unable to retrieve current user from `user` table');

    return { ...result.data.user, ...user.data };
  }

  /**
   * getUserByName
   * @param username
   * @returns
   */
  static async getUserByName(username: string) {
    const currentUser = await this.getCurrentUser();
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const result = await supabase
      .from('user')
      .select('user_id, username, avatar')
      .neq('user_id', currentUser.user_id)
      .ilike('username', `%${username}%`);

    if (result.error) {
      logger.error(result.error);
      throw new Error('Error searching for user');
    }

    // Check for friends of the current user
    const friends = await supabase
      .from('friend')
      .select('friend_id')
      .eq('user_id', currentUser.user_id);

    if (friends.error) throw new Error('Error while fetching friends');
    logger.debug({ friends }, `Friends of ${currentUser.username}`);

    // Add property friend to the user if is a friend of the current user
    const users = result.data.map((user) => {
      if (friends.data.findIndex((u) => u.friend_id === user.user_id) !== -1)
        return { ...user, friend: true };
      return { ...user, friend: false };
    });
    logger.debug({ users }, 'Friends');

    return users;
  }

  /**
   * addFriend
   * @param userId
   * @returns
   */
  static async addFriend(userId: string): Promise<boolean> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const currentUser = await this.getCurrentUser();

    logger.debug({ userId }, 'Checking for existing friend with ');
    const check = await supabase
      .from('friend')
      .select('friend_id')
      .eq('user_id', currentUser.user_id)
      .eq('friend_id', userId)
      .limit(1)
      .maybeSingle();
    logger.debug({ check });

    if (check.error) throw new Error('Error checking for existing friend');
    if (check.data)
      throw new Error('User is already a friend with current user');

    logger.debug('No relation, adding a friend');
    const result = await supabase
      .from('friend')
      .insert({ user_id: currentUser.user_id, friend_id: userId });

    if (result.error) throw new Error('Error adding a friend');
    return true;
  }
}
