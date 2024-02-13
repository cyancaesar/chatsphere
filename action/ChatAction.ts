'use server';

import Chat from '@/lib/Chat';
import User from '@/lib/User';
import logger from '@/lib/logger';
import { revalidatePath } from 'next/cache';

export async function createChat(name: string, isGroup: boolean) {
  const result = await Chat.createChat(name, isGroup);
  logger.debug({ result }, `Created a chat`);
}

export async function createPrivateChat(userId: string) {
  const currentUser = await User.getCurrentUser();
  logger.debug({ userId }, 'Creating private chat with user id');

  const privateChatId = await Chat.getPrivateChat(userId);
  logger.debug({ privateChatId });
  if (privateChatId !== null) return privateChatId;

  logger.debug('No existing chat, creating a new chat');

  // Create a private chat
  const chatId = await Chat.createChat(null, false);

  // Self enroll to the chat
  const self_enroll = await Chat.enrollUser({
    chatId: chatId,
    userId: currentUser.user_id,
    isGroup: false,
  });

  // Enroll the given user
  const user_enroll = await Chat.enrollUser({
    chatId: chatId,
    userId,
    isGroup: false,
  });

  revalidatePath('/realm', 'layout');
  return chatId;
}

export async function getChatList() {
  try {
    return await Chat.getChatList();
  } catch (e) {
    logger.error(e);
    return [];
  }
}

export async function getChatMetadata(chatId: number) {
  try {
    return await Chat.getMetadata(chatId);
  } catch (e) {
    logger.error(e);
  }
}
