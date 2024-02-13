import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import type UserType from '@/lib/types/User';
import logger from './logger';
import User from './User';

export default class Message {
  /**
   * fetchMessage
   * @param chatId
   * @returns
   */
  static async fetchMessage(chatId: number) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const currentUser = await User.getCurrentUser();

    // Check if the user inside the chat
    const isJoined = await supabase
      .from('party')
      .select('*')
      .eq('chat_id', chatId)
      .eq('user_id', currentUser.user_id)
      .limit(1)
      .single();

    if (!isJoined.data) throw new Error('User not joined in chat');

    // Fetch messages and join `user` table via sender_id to resolve username
    const messages = await supabase
      .from('message')
      .select('*, user(username, avatar)')
      .eq('chat_id', chatId);

    if (messages.error) throw new Error('Unable to fetch messages for chat');

    const mapped = messages.data.map(async (message) => {
      if (!message.is_media) return message;
      const signedUrl = await Message.getMedia(message.message);
      return { ...message, message: signedUrl! };
    });

    // const result = await Promise.all(mapped);

    // logger.debug({ result });

    return messages.data;
  }

  /**
   * sendMessage
   * @param message
   * @param chatId
   * @returns
   */
  static async sendMessage(
    message: string,
    chatId: number,
    isMedia: boolean = false
  ) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const currentUser = await User.getCurrentUser();

    const { data, error } = await supabase
      .from('message')
      .insert({
        message,
        chat_id: chatId,
        sender_id: currentUser.user_id,
        is_media: isMedia,
      })
      .select('*, user(username)')
      .limit(1)
      .single();

    logger.debug({ data }, 'Sending message');
    if (error) throw new Error('Message not sent');
    if (!data) throw new Error('Message not sent');

    return data;
  }

  /**
   * sendMedia
   * @param message
   * @param chatId
   * @returns
   */
  static async sendMedia(media: File, chatId: number) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const ext = media.name.slice(media.name.lastIndexOf('.'));

    logger.debug(
      `Sending media to path ${chatId}/${Math.floor(
        Date.now() * Math.random()
      ).toString(16)}.${ext}`
    );

    const { data, error } = await supabase.storage
      .from('media')
      .upload(
        `${chatId}/${Math.floor(Date.now() * Math.random()).toString(
          16
        )}${ext}`,
        media
      );

    if (error) console.log(error);
    if (data) console.log(data);

    return data?.path;
  }

  /**
   * getMedia
   * @param path
   * @returns
   */
  static async getMedia(path: string) {
    logger.debug({ path }, 'Creating a signed url');
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.storage
      .from('media')
      .createSignedUrl(`${path}`, 600, {
        transform: { width: 30, height: 30 },
      });

    if (error) logger.error(error);
    logger.debug({ data }, 'Create signed url');
    return data?.signedUrl;
  }
}
