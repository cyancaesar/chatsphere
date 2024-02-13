import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Message from '@/components/MessageContainer';
import { sendMessage } from '../../action/MessageAction';
import InteractiveInput from '@/components/MessageInput';
import Profile from '@/components/Profile';
import { PlusIcon } from '@heroicons/react/24/outline';
import ContactCard from '@/components/ConnectionCard';

export default async function Realm() {
  return (
    <div className='w-full grow flex justify-center items-center'>Main</div>
  );
}
