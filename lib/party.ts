import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function addParty(chatId: number, userId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const result = await supabase
    .from('party')
    .insert({ chat_id: chatId, user_id: userId });

  if (result.status === 201) return { success: true };
  return { success: false };
}
