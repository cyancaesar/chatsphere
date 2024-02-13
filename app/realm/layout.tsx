import React from 'react';
import Profile from '@/components/Profile';
import Connections from '@/components/Connections';
import Contact from '@/components/Contact';
import UserSearch from '@/components/UserSearch';
import { getCurrentUser } from '@/action/UserAction';
import { getChatList } from '@/action/ChatAction';
import chatBackground from '@/assets/img/chatBackground.jpg';
import '@/styles/style.css';

export default async function RealmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const chat = await getChatList();

  return (
    <div className='h-screen w-full flex relative'>
      <div className='container mx-auto flex flex-col z-10'>
        {/* Header */}
        <div className='flex min-h-[4rem] bg-neutral-50 dark:bg-neutral-900'>
          <div className='basis-1/5 border-b border-r flex items-center justify-between px-2'>
            <div className='flex space-x-3 items-center'>
              <Profile user={user!} />
              <div className='font-medium'>{user?.username}</div>
            </div>
            <UserSearch />
          </div>
          <div className='grow border-b flex items-center px-6'>
            <div className=''>
              <Contact />
            </div>
          </div>
        </div>
        {/* Main */}
        <div className='flex grow bg-neutral-50'>
          {/* Connection card */}
          <div className='basis-1/5 bg-neutral-50 dark:bg-neutral-900 flex flex-col divide-y border-r'>
            <Connections chat={chat} />
          </div>
          {/* Message Container */}
          <div className='grow flex flex-col pb-6'>{children}</div>
        </div>
      </div>
      <div className='absolute z-0 inset-0 w-full h-full'>
        {/* <img
          src={chatBackground.src}
          alt='chat background'
          className='object-cover bg-contain w-full h-full'
        /> */}
        <div className='bubbles'>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
          <div className='bubble'></div>
        </div>
      </div>
    </div>
  );
}
