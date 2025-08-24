'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AuditEvent {
  _id: string
  text: string
  created: string
}

export default function AuditTrail() {
  const [auditTrailEvents, setAuditTrailEvents] = useState<AuditEvent[]>([])

  useEffect(() => {
    getEvents()
  }, [])

  const getEvents = async () => {
    try {
      const response = await fetch('/api/auditTrailEvents')
      const data = await response.json()
      setAuditTrailEvents(data)
    } catch (error) {
      console.error('Error fetching audit events:', error)
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Audit Trail</h2>
          
          <div className="space-y-2">
            {auditTrailEvents.map((event, index) => (
              <div key={event._id} className={`meow-panel ${index % 2 === 1 ? 'gray-meow' : ''}`}>
                <div className="meow-text">{event.text}</div>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(event.created).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-500 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 