'use client';
import { signOut } from '@/action/AuthAction';
import { Button } from './ui/button';

export default function SignoutButton() {
  return <Button onClick={async () => await signOut()}>Sign out</Button>;
}
