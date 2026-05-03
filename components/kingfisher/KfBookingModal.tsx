'use client'

import { useEffect, useState } from 'react'

type Step = 'date' | 'time' | 'form' | 'confirm'

function getDates(): Date[] {
  const dates: Date[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1)
  while (dates.length < 14) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      dates.push(new Date(d))
    }
    d.setDate(d.getDate() + 1)
  }
  return dates
}

const SLOTS = ['9:00 am', '9:30 am', '10:00 am', '11:00 am', '2:00 pm', '3:00 pm', '4:00 pm']

const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function fmt(d: Date) {
  return `${DAY[d.getDay()]} ${d.getDate()} ${MONTH[d.getMonth()]}`
}

export default function KfBookingModal() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('date')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const dates = getDates()

  useEffect(() => {
    function handler() {
      setOpen(true)
      setStep('date')
      setSelectedDate(null)
      setSelectedSlot(null)
      setName('')
      setEmail('')
      setPhone('')
    }
    document.addEventListener('kf:booking:open', handler)

    function clickHandler(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target.closest('[data-kf-booking]')) {
        document.dispatchEvent(new Event('kf:booking:open'))
      }
    }
    document.addEventListener('click', clickHandler)

    return () => {
      document.removeEventListener('kf:booking:open', handler)
      document.removeEventListener('click', clickHandler)
    }
  }, [])

  function submit() {
    const booking = { name, email, phone, date: selectedDate?.toISOString(), slot: selectedSlot, ts: Date.now() }
    const existing = JSON.parse(localStorage.getItem('kf_bookings') || '[]')
    localStorage.setItem('kf_bookings', JSON.stringify([...existing, booking]))
    setStep('confirm')
  }

  if (!open) return null

  const overlay: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(26,53,48,0.7)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  }

  const modal: React.CSSProperties = {
    background: '#efe9dd',
    borderRadius: 20,
    width: '100%',
    maxWidth: 540,
    padding: '40px 36px',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto',
  }

  const heading: React.CSSProperties = {
    fontFamily: 'Fraunces, serif',
    fontVariationSettings: "'opsz' 144, 'SOFT' 50",
    fontWeight: 380,
    fontSize: 26,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    color: '#1a3530',
    margin: '0 0 8px',
  }

  const sub: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    color: '#6e6855',
    margin: '0 0 28px',
  }

  const btn: React.CSSProperties = {
    background: '#e88d6e',
    color: '#1d3f3a',
    border: 'none',
    borderRadius: 999,
    padding: '14px 28px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: 15,
    cursor: 'pointer',
    letterSpacing: '0.01em',
    width: '100%',
    marginTop: 20,
  }

  const closeBtn: React.CSSProperties = {
    position: 'absolute',
    top: 16,
    right: 20,
    background: 'none',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    color: '#6e6855',
    lineHeight: 1,
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1.5px solid #d2c8b3',
    borderRadius: 8,
    padding: '12px 14px',
    fontFamily: 'Inter, sans-serif',
    fontSize: 15,
    color: '#1a3530',
    background: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
  }

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}>
      <div style={modal}>
        <button style={closeBtn} onClick={() => setOpen(false)}>&#10005;</button>

        {step === 'date' && (
          <>
            <p style={heading}>Pick a date</p>
            <p style={sub}>Choose any weekday that works for you.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {dates.map((d, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedDate(d); setStep('time') }}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #d2c8b3',
                    borderRadius: 10,
                    padding: '12px 16px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    color: '#1a3530',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {fmt(d)}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'time' && selectedDate && (
          <>
            <p style={heading}>Pick a time</p>
            <p style={sub}>{fmt(selectedDate)} -- 15 minutes</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SLOTS.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedSlot(slot); setStep('form') }}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #d2c8b3',
                    borderRadius: 10,
                    padding: '14px 20px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 15,
                    color: '#1a3530',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('date')}
              style={{ ...btn, background: 'transparent', border: '1.5px solid #d2c8b3', color: '#1a3530' }}
            >
              Back
            </button>
          </>
        )}

        {step === 'form' && (
          <>
            <p style={heading}>Almost there</p>
            <p style={sub}>{fmt(selectedDate!)} at {selectedSlot}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                style={inputStyle}
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                style={inputStyle}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                style={inputStyle}
                type="tel"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              style={{ ...btn, opacity: !name || !email ? 0.5 : 1 }}
              disabled={!name || !email}
              onClick={submit}
            >
              Confirm booking
            </button>
            <button
              onClick={() => setStep('time')}
              style={{ ...btn, background: 'transparent', border: '1.5px solid #d2c8b3', color: '#1a3530', marginTop: 10 }}
            >
              Back
            </button>
          </>
        )}

        {step === 'confirm' && (
          <>
            <p style={{ fontSize: 40, margin: '0 0 16px' }}>&#10003;</p>
            <p style={heading}>You&rsquo;re booked in</p>
            <p style={{ ...sub, marginBottom: 0 }}>
              {fmt(selectedDate!)} at {selectedSlot} -- we&rsquo;ll email {email} with a calendar invite.
              No application forms. No sales pressure.
            </p>
            <button style={btn} onClick={() => setOpen(false)}>Done</button>
          </>
        )}
      </div>
    </div>
  )
}
