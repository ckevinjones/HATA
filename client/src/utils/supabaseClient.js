import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const getUserRole = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Error fetching user role:', error);
        return null;
    }
    return user?.user_metadata?.role || null; // Adjust based on your Supabase setup
};

export default supabase;
