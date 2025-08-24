'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const submitSignup = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
      })

      if (response.ok) {
        alert('Account created successfully!')
        setUsername('')
        setPassword('')
        setEmail('')
      } else {
        alert('Error creating account')
      }
    } catch (error) {
      console.error('Error creating account:', error)
      alert('Error creating account')
    }
  }

  return (
    <div>
      <div className="title-box">
        <h1 className="page-title">
          <Link href="/">Wilsons</Link>
        </h1>
      </div>
      
      <div className="feed">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6">Signup here</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border border-gray-300 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={submitSignup}
            >
              Signup
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-500 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 