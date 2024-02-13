import { cookies } from 'next/headers';
import User from './User';
import { createClient } from '@/utils/supabase/server';
import logger from './logger';
import { Metadata } from './types/Metadata';

export default class Chat {
  /**
   * getChatname
   * @param chat_id
   * @returns
   */
  static async getChatname(chatId: number): Promise<string> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    logger.debug({ chatId }, 'Get chat name with id');

    const chat = await supabase
      .from('chat')
      .select('name, is_group')
      .eq('id', chatId)
      .single();

    if (chat.error) throw new Error('Chat not found');

    // Check if chat is group. If so, return the name
    if (chat.data.is_group) return chat.data.name ?? '';

    logger.debug('Chat is not a group, continue finding the user name');
    const currentUser = await User.getCurrentUser();

    if (!currentUser) throw new Error('Unable to retrieve current user');

    const party = await supabase
      .from('party')
      .select('user(username)')
      .neq('user_id', currentUser.user_id)
      .eq('chat_id', chatId)
      .limit(1)
      .single();
    if (party.error) throw new Error('Unable to retrieve username');

    logger.debug(party);

    return party.data.user?.username ?? '';
  }

  /**
   * createChat
   * @param name
   * @returns
   */
  static async createChat(
    name: string | null,
    isGroup: boolean
  ): Promise<number> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const result = await supabase
      .from('chat')
      .insert({ name, is_group: isGroup })
      .select()
      .single();

    if (result.error) {
      logger.error(result.error);
      throw new Error('Unable to create a chat');
    }

    if (!result.data) throw new Error('Unable to retrieve chat id, no chat id');

    return result.data.id;
  }

  /**
   * getPrivateChat
   * @param userId
   * @returns
   */
  static async getPrivateChat(userId: string): Promise<number | null> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const currentUser = await User.getCurrentUser();

    if (!currentUser) throw new Error('Unable to retrieve current user');

    const result = await supabase
      .from('party')
      .select('user_id, chat_id, chat(is_group)')
      .or(`user_id.eq.${userId},user_id.eq.${currentUser.user_id}`);

    // Filter only the chats that current user joined in
    const currentUserChat = result.data
      ?.filter((val) => val.user_id === currentUser.user_id)
      .map((val) => val.chat_id)
      .filter((val, index, arr) => arr.indexOf(val) === index);
    logger.debug({ currentUserChat }, 'Current user chat');

    // Filter only the chats that given user joined in
    const userChat = result.data
      ?.filter((val) => val.user_id === userId)
      .filter(
        (val, index, arr) =>
          arr.findIndex((v) => v.chat_id === val.chat_id) === index
      );
    logger.debug({ userChat }, 'User chat');

    // Filter only the chats that current user and given user have in common
    const privateChatId =
      userChat
        ?.filter(
          (val) => currentUserChat?.includes(val.chat_id) && !val.chat?.is_group
        )
        .map((val) => val.chat_id) ?? [];

    logger.debug({ privateChatId }, 'After filtering');

    if (privateChatId.length === 1) return privateChatId[0];

    return null;
  }

  /**
   * enroll
   * @param param0
   * @returns
   */
  static async enrollUser({
    chatId,
    userId,
    isGroup,
  }: {
    chatId: number;
    userId: string;
    isGroup: boolean;
  }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    logger.debug({ chatId, userId, isGroup }, 'DEBUG enrollUser');

    const result = await supabase
      .from('party')
      .insert({ chat_id: chatId, user_id: userId, is_group: isGroup })
      .select()
      .single();

    if (result.error) {
      logger.error(result.error);
      throw new Error('Error while enrolling a user');
    }
    return result.data;
  }

  /**
   * getChatList
   * @returns
   */
  static async getChatList(): Promise<Metadata[]> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    try {
      const currentUser = await User.getCurrentUser();
      const result = await supabase
        .from('party')
        .select('chat_id')
        .eq('user_id', currentUser.user_id);

      if (result.error) {
        logger.error(result.error);
        throw new Error('Error while retriving chat list');
      }

      logger.debug({ result, func: this.getChatList.name }, `Chat list`);

      const mapped = result.data.map(
        async (chat) => await this.getMetadata(chat.chat_id)
      );

      const chat = await Promise.all(mapped);
      logger.debug(
        { chat, func: this.getChatList.name },
        'Resolved chat metadata '
      );
      return chat;
    } catch (e) {
      logger.error(e);
      throw new Error(`Error in ${this.getChatList.name}`);
    }
  }

  /**
   * getMetadata
   * @param chatId
   */
  static async getMetadata(chatId: number): Promise<Metadata> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const currentUser = await User.getCurrentUser();

    const chat = await supabase
      .from('chat')
      .select('id, name, is_group')
      .eq('id', chatId)
      .limit(1)
      .single();

    if (chat.error) throw new Error('Error while fetching chat data');
    if (chat.data.is_group) return <Metadata>chat.data;

    logger.debug({ chatId }, 'DEBUG');

    const result = await supabase
      .from('party')
      .select('user(username, avatar)')
      .eq('chat_id', chatId)
      .neq('user_id', currentUser.user_id)
      .limit(1)
      .single();

    if (result.error || !result.data.user) {
      logger.debug(result.data);
      logger.error(result.error?.message);
      throw new Error('Error fetching user data');
    }

    return {
      ...chat.data,
      name: result.data.user.username,
      avatar: result.data.user.avatar,
    };
  }
}
