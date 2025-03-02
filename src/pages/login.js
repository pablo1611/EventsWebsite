'use client'
import NoSsr from '../components/NoSsr';
import { useState } from 'react';
import Image from 'next/image';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '../context/ThemeContext';

const geist = Geist({ subsets: ['latin'] });

export async function getServerSideProps() {
  // You can perform server-side logic here, like checking user sessions or fetching data
  return {
    props: {}, // Pass props to your component if needed
  };
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setErrorDetails('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password 
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || 'Login failed');
        setErrorDetails(data?.details || 'An unexpected error occurred');
        return;
      }

      if (!data || !data.user) {
        setError('Login failed');
        setErrorDetails('Invalid response from server');
        return;
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed');
      setErrorDetails('Network error or server is unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NoSsr>
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
        <div className={`max-w-md w-full space-y-8 p-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/academic-logo.svg"
                alt="Academic Events Logo"
                width={60}
                height={60}
                className="animate-float"
              />
            </div>
            <h1 className={`${geist.className} text-3xl font-bold text-gray-900`}>
              Academic Events
            </h1>
            <h2 className="mt-2 text-gray-600">Sign in to your account</h2>
          </div>

          {(error || errorDetails) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error && <p className="font-medium">{error}</p>}
              {errorDetails && <p className="text-sm mt-1">{errorDetails}</p>}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </NoSsr>
  );
}
