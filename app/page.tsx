'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { io } from 'socket.io-client';

interface Meow {
  _id: string;
  text: string;
  username: string;
  created: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function Home() {
  const [meows, setMeows] = useState<Meow[]>([]);
  const [newMeow, setNewMeow] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    // Check for existing token in cookies
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(savedUser);
    }

    // Connect to Socket.io
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('Connected to server!');
    });

    socket.on('newMeow', () => {
      getMeows();
    });

    getMeows();

    return () => {
      socket.disconnect();
    };
  }, []);

  const getMeows = async () => {
    try {
      const response = await fetch('/api/meows');
      const data = await response.json();
      setMeows(data);
    } catch (error) {
      console.error('Error fetching meows:', error);
    }
  };

  const submitNewMeow = async () => {
    if (newMeow.length < 5) {
      alert('Meow must be at least 5 characters');
      return;
    }

    try {
      const response = await fetch('/api/meows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify({ newMeow }),
      });

      if (response.ok) {
        setNewMeow('');
        getMeows();
      }
    } catch (error) {
      console.error('Error creating meow:', error);
    }
  };

  const removeMeow = async (meow: Meow) => {
    try {
      const response = await fetch('/api/meows/remove', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify({ meow }),
      });

      if (response.ok) {
        getMeows();
      }
    } catch (error) {
      console.error('Error removing meow:', error);
    }
  };

  const signin = async () => {
    try {
      const response = await fetch('/api/users/signin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setCurrentUser(username);
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', username);
        setUsername('');
        setPassword('');
      } else {
        alert('Invalid login credentials');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in');
    }
  };

  const resetPassword = async () => {
    try {
      const response = await fetch('/api/users/resetPassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetEmail }),
      });

      if (response.ok) {
        alert('Your new password has been emailed to you.');
        setResetEmail('');
      } else {
        alert('There was a problem!');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password');
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  return (
    <div>
      <div className='title-box'>
        <h1 className='page-title'>
          <Link href='/'>Wilsons</Link>
        </h1>
      </div>

      <div className='feed'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='md:col-span-1'>
            {!currentUser ? (
              <div className='login-box'>
                <h4 className='text-xl font-bold mb-4'>Login</h4>
                <div className='space-y-4'>
                  <input
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded'
                    placeholder='Username'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                  <input
                    type='password'
                    className='w-full p-2 border border-gray-300 rounded'
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
                    onClick={signin}
                  >
                    Sign In
                  </button>
                </div>

                <div className='mt-6'>
                  <h5 className='font-bold mb-2'>Forget Password?</h5>
                  <input
                    type='email'
                    className='w-full p-2 border border-gray-300 rounded mb-2'
                    placeholder='Email'
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                  />
                  <button
                    className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
                    onClick={resetPassword}
                  >
                    Reset
                  </button>
                </div>

                <div className='mt-4 text-center'>
                  <Link
                    href='/signup'
                    className='text-blue-500 hover:underline'
                  >
                    Not a member? Signup
                  </Link>
                </div>
              </div>
            ) : (
              <div className='login-box'>
                <p>Hello, {currentUser}.</p>
                <button
                  className='mt-2 text-blue-500 hover:underline'
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className='md:col-span-2'>
            <div className='flex justify-end mb-4'>
              <Link
                href='/audittrail'
                className='text-blue-500 hover:underline'
              >
                Audit Trail
              </Link>
            </div>

            {currentUser && (
              <div className='new-meow'>
                <input
                  type='text'
                  className='w-full p-2 border border-gray-300 rounded mb-2'
                  placeholder='What do you have to meow today?'
                  value={newMeow}
                  onChange={e => setNewMeow(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && submitNewMeow()}
                />
                <button
                  className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                  onClick={submitNewMeow}
                >
                  Submit
                </button>
              </div>
            )}

            <div className='space-y-2'>
              {meows.map((meow, index) => (
                <div
                  key={meow._id}
                  className={`meow-panel ${index % 2 === 1 ? 'gray-meow' : ''}`}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex items-start space-x-2'>
                      <span className='user-icon'>👤</span>
                      <span className='meow-text'>{meow.text}</span>
                    </div>
                    {currentUser && (
                      <button
                        className='text-red-500 hover:text-red-700'
                        onClick={() => removeMeow(meow)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className='mt-2'>
                    <small className='meow-user'>{meow.username}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
