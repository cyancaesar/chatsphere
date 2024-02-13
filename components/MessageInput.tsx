'use client';
import PaperPlane from '@/icon/PaperPlane';
import PhotoIcon from '@/icon/PhotoIcon';
import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { sendMedia, sendMessage } from '@/action/MessageAction';
import { Metadata } from '@/lib/types/Metadata';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { PaperClipIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogClose, DialogContent, DialogHeader } from './ui/dialog';

export default function InteractiveInput({ metadata }: { metadata: Metadata }) {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState('');

  return (
    <>
      <div className='flex space-x-2 w-full items-center'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='rounded-full h-10 w-10 px-2.5 py-2.5'>
              <PaperClipIcon height={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-28'>
            <DropdownMenuItem
              className='flex gap-4 items-center'
              onClick={() => fileRef.current?.click()}
            >
              <PhotoIcon />
              <div>Media</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          type='text'
          name='message'
          placeholder='Enter message'
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          onKeyDown={async (e) => {
            if (e.key == 'Enter') {
              await sendMessage(message, metadata.id);
              setMessage('');
            }
          }}
          autoComplete='off'
        />
        <Button
          className='rounded-full px-2.5 py-2.5'
          onClick={async () => {
            await sendMessage(message, metadata.id);
            setMessage('');
          }}
        >
          <PaperPlane />
        </Button>
      </div>
      <form
        ref={formRef}
        action={async (formData: FormData) => {
          await sendMedia(formData, metadata.id);
        }}
      >
        <Input
          name='media'
          type='file'
          ref={fileRef}
          className='hidden'
          onChange={(e) => {
            setFile(URL.createObjectURL(e.target.files![0]));
            setOpen(true);
          }}
        />
      </form>

      <Dialog open={open}>
        <DialogContent className='flex flex-col justify-center items-center'>
          <DialogHeader>Upload media</DialogHeader>
          <img src={file} width={'50%'} alt='preview' />
          <div className='w-full space-y-1'>
            <Button
              className='w-full'
              onClick={() => {
                formRef.current?.requestSubmit();
                setFile('');
                setOpen(false);
              }}
            >
              Send
            </Button>
            <DialogClose asChild onClick={() => setOpen(false)}>
              <Button className='w-full' type='button' variant='outline'>
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
