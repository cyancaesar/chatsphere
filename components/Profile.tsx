'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
  AtSymbolIcon,
} from '@heroicons/react/24/outline';
import { signOut } from '@/action/AuthAction';
import User from '@/lib/types/User';

export default function Profile({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='border hover:shadow-md cursor-pointer transition'>
          <AvatarImage
            src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/avatars/${user?.avatar}`}
          />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='flex gap-4'>
          <UserIcon height={16} />
          <div>Change username</div>
        </DropdownMenuItem>
        <DropdownMenuItem className='flex gap-4'>
          <AtSymbolIcon height={16} />
          <div>Change email</div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            const result = await signOut();
          }}
          className='flex gap-4'
        >
          <ArrowLeftStartOnRectangleIcon height={16} />
          <div>Sign out</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
