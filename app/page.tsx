import Link from 'next/link';
import backgroudImg from '@/assets/img/background2.jpg';
import UserForm from '@/components/UserForm';
import { Button } from '@/components/ui/button';
import SignoutButton from '@/components/SignoutButton';
import { getCurrentUser } from '@/action/UserAction';

export default async function Index() {
  const user = await getCurrentUser();

  const JoinRealmComponent = (
    <div className='flex flex-col gap-2'>
      <Button className='bg-gradient-to-br from-indigo-500 via-violet-500 to-teal-500 rounded-lg'>
        <Link href='/realm' className=''>
          <span className='text-white font-bold'>Join Realm</span>
        </Link>
      </Button>
      <SignoutButton />
      <div className='font-light italic mt-3'>
        Joining as {user?.user_metadata.username}
      </div>
    </div>
  );

  return (
    <div className='min-h-screen w-full bg-neutral-100 flex text-neutral-900'>
      {/* Main */}
      <div className='basis-3/4 relative'>
        <img
          src={backgroudImg.src}
          className='absolute w-full h-full bg-cover'
          alt='Background image'
        />
        <div className='z-10 absolute inset-0 w-full h-full bg-black/70'></div>
      </div>
      <div className='basis-1/2 container flex flex-col justify-center items-center space-y-12'>
        <div className='flex flex-col items-center p-2 space-y-1'>
          <div className='text-7xl font-bold'>ChatSphere</div>
          <div className='italic'>Dive into the realms</div>
        </div>
        <div>{!user ? <UserForm /> : JoinRealmComponent}</div>
      </div>
    </div>
  );
}
