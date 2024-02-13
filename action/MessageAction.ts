'use server';
import { revalidatePath } from 'next/cache';
import Message from '@/lib/Message';

export const sendMessage = async (message: string, chatId: number) => {
  await Message.sendMessage(message, chatId);
  revalidatePath(`/realm/${chatId}`, 'page');
  // return true;
};

export const sendMedia = async (media: FormData, chatId: number) => {
  const path = await Message.sendMedia(media.get('media') as File, chatId);
  if (path) {
    await Message.sendMessage(path, chatId, true);
  }
};

export const getMedia = async (path: string) => {
  return await Message.getMedia(path);
};
