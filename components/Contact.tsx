'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getChatMetadata } from '@/action/ChatAction';
import { Metadata } from '@/lib/types/Metadata';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Contact() {
  const pathname = usePathname();
  const [chat, setChat] = useState<Metadata | null>(null);

  useEffect(() => {
    setChat(null);
    const chatId = pathname.match('(/realm/)([0-9]+)') as unknown[];
    if (!chatId) return;

    const fetch = async () => {
      const chat = await getChatMetadata(chatId[2] as number);
      console.log(chat);
      setChat(chat!);
    };
    fetch();
  }, [pathname]);

  return (
    <div className='flex items-center gap-2'>
      {chat && (
        <>
          <Avatar className='border cursor-pointer'>
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/avatars/${chat.avatar}`}
            />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div>{chat.name}</div>
        </>
      )}
    </div>
  );
}
