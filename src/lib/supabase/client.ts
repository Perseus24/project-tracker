
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = 'https://msvpnuyubljgawdzsfoq.supabase.co'!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createSupabaseClient = () => {
    return createBrowserClient(supabaseUrl, supabaseKey);
};

export const supabase = createSupabaseClient()

export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) return null
    return user
}

export const registerUser = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { user: null, error: error.message}
    }

    const {  error: userError} = await supabase
        .from('users')
        .insert([{
            id: data?.user?.id,
            email: email,
            name: name,
        }]);

    if(userError){
        return { user: null, error: userError.message}
    }

    return { user: data?.user, error: null};
}

export const signInUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        let errorMessage = '';
        if (error.message === 'Invalid login credentials') {
            errorMessage = 'Invalid email or password';
        } else if (error.message === 'User does not exist') {
            errorMessage = 'User does not exist';
        } else if (error.message === 'Email not confirmed') {
            errorMessage = 'Check your email for the confirmation email';
        }
        return { user: null, error: errorMessage };
    }

    return { user: data?.user, error: null };
};

export const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        return { error: error.message };
    }
    return { error: null };
}

export const getUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
        return { users: null, error: error.message };
    }
    return { users: data, error: null };
}