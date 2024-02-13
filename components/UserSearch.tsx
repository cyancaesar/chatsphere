'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { addFriend, searchUser } from '@/action/UserAction';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { createPrivateChat } from '@/action/ChatAction';
import { Skeleton } from './ui/skeleton';
import { useRouter } from 'next/navigation';

const createListItem = (
  data: {
    friend: boolean;
    user_id: string;
    username: string;
    avatar: string | null;
  },
  index: number
) => {
  const router = useRouter();

  return (
    <>
      <DropdownMenuItem
        className='flex justify-between items-center gap-2'
        key={index}
        onClick={async () => {
          console.log(data);
          if (!data.friend) return;
          const result = await createPrivateChat(data.user_id);
          router.push(`/realm/${result}`);
        }}
      >
        <div className='flex gap-2 items-center'>
          <Avatar className='border'>
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/avatars/${
                data.avatar ?? 'default.jpg'
              }`}
            />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div>{data.username}</div>
        </div>
        {data.friend ? (
          ''
        ) : (
          <Button
            onClick={async () => {
              await addFriend(data.user_id);
            }}
          >
            Add
          </Button>
        )}
      </DropdownMenuItem>
    </>
  );
};

const SkeletonContact = () => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-6 w-[250px]' />
        </div>
      </div>
      <div className='flex items-center space-x-4'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-6 w-[250px]' />
        </div>
      </div>
      <div className='flex items-center space-x-4'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-6 w-[250px]' />
        </div>
      </div>
    </div>
  );
};

export default function UserSearch() {
  const [search, setSearch] = useState<string>('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!search) {
        setUsers([]);
        return;
      }
      setLoading(true);
      const data = await searchUser(search);
      console.log(data);
      setLoading(false);
      if (error) {
        setError(error);
        return;
      }
      if (!data) {
        setUsers([]);
        return;
      }
      setUsers(data);
    };
    fetch();
  }, [search]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PlusIcon
          height={24}
          className='hover:bg-neutral-200 cursor-pointer rounded-full'
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Chat</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
          placeholder='Search for account'
        />
        <DropdownMenuSeparator />
        <ScrollArea className='h-[200px] w-[300px] rounded-md border p-4'>
          {loading ? (
            <SkeletonContact />
          ) : (
            users.map((user, index) => createListItem(user, index))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
