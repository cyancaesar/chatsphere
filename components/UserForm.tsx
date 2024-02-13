'use client';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

export default function UserForm() {
  return (
    <Tabs defaultValue='signin' className='w-[400px]'>
      <TabsList className='w-full grid grid-cols-2'>
        <TabsTrigger value='signin'>Sign In</TabsTrigger>
        <TabsTrigger value='signup'>Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value='signin'>
        <SignInForm />
      </TabsContent>
      <TabsContent value='signup'>
        <SignUpForm />
      </TabsContent>
    </Tabs>
  );
}
