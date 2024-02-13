export type MessageType = {
  id: number;
  created_at: string;
  chat_id: number;
  message: string;
  sender_id: string;
  is_media: boolean;
  user: {
    username: string;
    avatar: string;
  } | null;
};
