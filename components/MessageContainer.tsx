'use client';
import React from 'react';
import MessageBox from './MessageBox';
import { MessageType } from '@/lib/types/MessageType';
import useRealtime from '@/lib/hooks/useRealtime';
import { Metadata } from '@/lib/types/Metadata';

export default function Message({
  initialMessage,
  metadata,
  currentUser,
}: {
  initialMessage: MessageType[];
  metadata: Metadata;
  currentUser: { user_id: string; avatar: string };
}) {
  const message = useRealtime({ initialMessage, chatId: metadata.id });
  return (
    <div className='w-full space-y-1'>
      {message.map((message, index) => (
        <MessageBox
          currentUser={currentUser}
          metadata={metadata}
          key={index}
          message={message}
        />
      ))}
    </div>
  );
}
