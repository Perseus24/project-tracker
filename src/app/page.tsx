'use client';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import cslx from 'clsx';
import { registerUser, signInUser, supabase } from "@/lib/supabase/client";

export default function Home() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');

    const registerUserRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        const { user} = await registerUser(email, password, name);
        if (user) {
            setIsSignUp(false);
        }
    }

    const signInUserRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        const { user} = await signInUser(email, password);
        if (user) {
            console.log("successfully logged in");
            console.log("About to navigate to dashboard...");
            
            // Give a moment for session to be established
            await new Promise(resolve => setTimeout(resolve, 500));
            
            console.log("Executing router.push...");
            window.location.href='/dashboard';
            // router.push('/dashboard');
        }
    }
    
    return (
        <div className="flex h-screen w-screen bg-white p-3">
            <motion.section 
                initial={
                    isSignUp ? 
                    { opacity: 0, x: -50 } :
                    { opacity: 0, x: 0 }
                }
                animate={
                    isSignUp ?
                    { opacity: 1, x: 0 } :
                    { opacity: 1, x: '100%' }
                }
                transition={{ duration: 1 }}
                className={
                    cslx(
                        "w-1/2 flex flex-col px-28 pt-10 text-black 2xl:justify-center",
                        !isSignUp ? 'justify-center' : ''
                    )
                }>
                <p className="text-2xl font-medium">Get Started Now</p>
                <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
                <div className="w-full flex my-5">
                    <button disabled className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm px-5 py-2 rounded-lg cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-0.5 0 48 48"><g fill="none" fillRule="evenodd"><path fill="#FBBC05" d="M9.827 24c0-1.524.253-2.986.705-4.356l-7.909-6.04A23.456 23.456 0 0 0 .213 24c0 3.737.868 7.26 2.407 10.388l7.905-6.05A13.885 13.885 0 0 1 9.827 24"/><path fill="#EB4335" d="M23.714 10.133c3.311 0 6.302 1.174 8.652 3.094L39.202 6.4C35.036 2.773 29.695.533 23.714.533a23.43 23.43 0 0 0-21.09 13.071l7.908 6.04a13.849 13.849 0 0 1 13.182-9.51"/><path fill="#34A853" d="M23.714 37.867a13.849 13.849 0 0 1-13.182-9.51l-7.909 6.038a23.43 23.43 0 0 0 21.09 13.072c5.732 0 11.205-2.036 15.312-5.849l-7.507-5.804c-2.118 1.335-4.786 2.053-7.804 2.053"/><path fill="#4285F4" d="M46.145 24c0-1.387-.213-2.88-.534-4.267H23.714V28.8h12.604c-.63 3.091-2.346 5.468-4.8 7.014l7.507 5.804c4.314-4.004 7.12-9.969 7.12-17.618"/></g></svg>
                        <p>Log in with Google</p>
                    </button>
                </div>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-full h-0.5 bg-gray-200"></div>
                    <p className="text-gray-400 text-sm">or</p>
                    <div className="w-full h-0.5 bg-gray-200"></div>
                </div>
                <form className="flex flex-col gap-3" onSubmit={
                    isSignUp ? registerUserRequest : signInUserRequest}>
                    {
                        isSignUp &&
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-600">Name</label>
                            <input 
                                type="text"
                                value={name} 
                                onChange={(e)=> setName(e.target.value)}
                                className="border border-gray-200 rounded-lg py-2 px-4 focus:outline-blue-900 text-sm" />
                        </div>
                    }
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-gray-600">Email address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            className="border border-gray-200 rounded-lg py-2 px-4 focus:outline-blue-900 text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-gray-600">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-200 rounded-lg py-2 px-4 focus:outline-blue-900 text-sm" />
                    </div>
                    <button className="bg-blue-900 text-white text-sm py-3 rounded-xl cursor-pointer">
                        {
                            isSignUp ? 'Sign Up' : 'Sign In'
                        }
                        </button>
                </form>
                
                <div className="flex mt-7 text-sm">
                    <p>
                        {
                            isSignUp ? 'Already have an account?' : 'Don\'t have an account?'
                        }
                        <span className="ml-2 text-blue-900 cursor-pointer font-semibold" onClick={() => setIsSignUp(!isSignUp)}>
                            {
                                isSignUp ? 'Sign in' : 'Sign up'
                            }
                        </span>
                    </p>
                </div>
            </motion.section>
            <motion.section 
                initial={{ opacity: 0, x: 0 }}
                animate={
                    isSignUp ? 
                    { opacity: 1, x: 0 } : 
                    { opacity: 1, x: '-100%' }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="w-1/2 bg-blue-900 rounded-3xl overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col h-full pl-14 pt-10 pr-32">
                    <p className="tracking-wide text-xl">The simplest way to manage your projects</p>
                    <p className="mt-2 text-xs">Enter your credentials to access your account</p>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Image src="/images/signup-bg.png" alt="signup-bg" width={400} height={400} className="mt-10 rounded-2xl" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <Image src="/images/signup-bg-2.png" alt="signup-bg-2" width={350} height={350} className="ml-66 -mt-32 rounded-2xl" />
                    </motion.div>
                </motion.div>
            </motion.section>
        </div>
    )
}