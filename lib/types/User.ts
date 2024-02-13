import { User as SupabaseUser } from '@supabase/supabase-js';

export default interface User extends SupabaseUser {
  user_id: string;
  username: string;
  avatar: string;
}
