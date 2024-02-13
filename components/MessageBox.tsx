'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MessageType } from '@/lib/types/MessageType';
import { Metadata } from '@/lib/types/Metadata';
import { getMedia } from '@/action/MessageAction';

export default function MessageBox({
  message,
  metadata,
  currentUser,
}: {
  message: MessageType;
  metadata: Metadata;
  currentUser: { user_id: string; avatar: string };
}) {
  const [media, setMedia] = useState('');

  useEffect(() => {
    const resolveMedia = async (path: string) => {
      const result = await getMedia(path);
      setMedia(result!);
    };
    if (message.is_media) resolveMedia(message.message);
  }, []);

  return (
    <>
      <div className='w-full flex gap-2 py-0.5 items-center'>
        <Avatar className='self-end'>
          <AvatarImage
            src={`https://kkpzmwdfuxywwmjjcnxm.supabase.co/storage/v1/object/public/avatars/${
              message.sender_id === currentUser.user_id
                ? currentUser.avatar
                : metadata.avatar
            }`}
            alt='Avatar'
            title={message.user?.username}
          />
          <AvatarFallback>PX</AvatarFallback>
        </Avatar>
        <div className=''>
          {message.is_media ? (
            <img src={media} alt='Media' width={200} />
          ) : (
            <div className='bg-neutral-800 pr-5 pl-3 py-1.5 rounded-e-3xl rounded-tl-xl text-sm break-all'>
              {message.message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
