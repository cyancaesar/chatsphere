import MessageContainer from '@/components/MessageContainer';
import MessageInput from '@/components/MessageInput';
import Message from '@/lib/Message';
import logger from '@/lib/logger';
import { getChatMetadata } from '@/action/ChatAction';
import { getCurrentUser } from '@/action/UserAction';

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const chatId = Number(id);
  const currentUser = await getCurrentUser();
  if (!currentUser) return <div>Undefined user</div>;

  const messages = await Message.fetchMessage(chatId);
  const metadata = await getChatMetadata(chatId);
  logger.debug({ metadata }, 'Chat metadata');

  return (
    <>
      <div className='grow text-white flex flex-col gap-2 py-1 px-4 relative'>
        <div className='absolute inset-0 overflow-y-auto px-4 py-1 w-full'>
          <MessageContainer
            metadata={metadata!}
            currentUser={{
              user_id: currentUser.user_id,
              avatar: currentUser.avatar,
            }}
            initialMessage={messages}
          />
        </div>
      </div>
      <div className='flex px-4'>
        <MessageInput metadata={metadata!} />
      </div>
    </>
  );
}
