'use client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { signIn, signInWithGithub } from '@/action/AuthAction';
import { useState } from 'react';
import GithubIcon from '@/icon/GithubIcon';

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(3, 'Password must be at least 6 characters.')
    .max(72),
});

export default function SignInForm() {
  const [error, setError] = useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { success, data, error } = await signIn(values);
    if (error) {
      setError(error.message);
    }
  }

  return (
    <div className='space-y-2'>
      <Form {...form}>
        <Card>
          <CardHeader>
            <form action={signInWithGithub} className='flex'>
              <Button className='flex items-center space-x-2 w-full'>
                <GithubIcon />
                <span>Login with Github</span>
              </Button>
            </form>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Sign in to your account.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='caesar@mail.local' {...field} />
                    </FormControl>
                    <FormDescription>
                      Email only used for verification.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passphrase</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className='flex flex-col gap-4'>
              <Button className='w-full' type='submit'>
                Submit
              </Button>
              {error && (
                <div className='text-red-600 font-medium text-sm'>{error}</div>
              )}
            </CardFooter>
          </form>
        </Card>
      </Form>
    </div>
  );
}
