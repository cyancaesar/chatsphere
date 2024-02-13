import ConnectionCard from '@/components/ConnectionCard';
import React from 'react';
import { Metadata } from '@/lib/types/Metadata';

type Props = {
  chat: Metadata[];
};

export default async function Connections({ chat }: Props) {
  return (
    <div className='flex flex-col'>
      {chat.map((val, index) => (
        <ConnectionCard key={index} chat={val} />
      ))}
    </div>
  );
}
