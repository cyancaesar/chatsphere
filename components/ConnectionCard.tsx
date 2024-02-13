import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import { Metadata } from '@/lib/types/Metadata';

type Props = {
  chat: Metadata;
};

export default function ConnectionCard({ chat }: Props) {
  return (
    <Link
      href={`/realm/${chat.id}`}
      className='flex items-center w-full px-2 py-1.5 space-x-4 hover:bg-neutral-100'
    >
      <Avatar className='shadow-sm cursor-pointer transition'>
        <AvatarImage
          src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/avatars/${chat.avatar}`}
        />
        <AvatarFallback>UR</AvatarFallback>
      </Avatar>
      <div className='font-light italic'>{chat.name}</div>
    </Link>
  );
}
