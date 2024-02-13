import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { MessageType } from '../types/MessageType';

export default function useRealtime({
  initialMessage,
  chatId,
}: {
  initialMessage: MessageType[];
  chatId: number;
}) {
  const supabase = createClient();
  const [message, setMessage] = useState<MessageType[]>(initialMessage);

  // Create a function to handle inserts
  const handleInserts = (payload: any) => {
    console.log(payload);
    setMessage([...message, payload.new as MessageType]);
  };

  useEffect(() => {
    const channel = supabase
      .channel('realtime messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message',
          filter: `chat_id=eq.${chatId}`,
        },
        handleInserts
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [message, supabase]);

  return message;
}
