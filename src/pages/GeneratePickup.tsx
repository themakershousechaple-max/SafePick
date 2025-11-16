import { useMemo, useState } from 'react'
import { generateCode } from '../lib/code'
import { createRecord } from '../lib/repo'
import { RecordInput } from '../types'
import QR from '../components/QR'

export default function GeneratePickup() {
  const [childName, setChildName] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [remember, setRemember] = useState(false)

  const code = useMemo(() => generateCode(), [refresh])
  const url = useMemo(() => window.location.origin + '/pickup?code=' + code, [code])

  async function send() {
    const input: RecordInput = { childName, parentName: 'Parent', phone, code, qrUrl: url }
    await createRecord(input)
    setSent('Code sent')
    if (remember) {
      localStorage.setItem('remember_parent', JSON.stringify({ childName, phone }))
    }
  }

  // Prefill remembered parent
  useMemo(() => {
    const raw = localStorage.getItem('remember_parent')
    if (raw) {
      try {
        const obj = JSON.parse(raw)
        setChildName(obj.childName || '')
        setPhone(obj.phone || '')
        setRemember(true)
      } catch {}
    }
  }, [])

  const wa = 'https://wa.me/' + phone.replace(/[^0-9]/g,'') + '?text=' + encodeURIComponent('Pickup Code ' + code + ' for ' + childName)
  const sms = 'sms:' + phone.replace(/[^0-9]/g,'') + '?body=' + encodeURIComponent('Pickup Code ' + code + ' for ' + childName)

  return (
    <div className="p-4 max-w-md mx-auto dark:text-gray-100">
      <div className="text-lg font-semibold">Generate Pickup Code</div>
      <div className="mt-4 bg-white rounded-xl border p-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="text-sm text-gray-600">Pickup Code for: {childName || '—'}</div>
        <div className="mt-3 flex items-center justify-center p-4 bg-emerald-900 rounded">
          <div className="bg-white rounded-xl p-4">
            <QR value={url} />
          </div>
        </div>
        <div className="mt-3 text-3xl font-bold tracking-widest">{code}</div>
      </div>
      <div className="mt-4 text-sm font-semibold">Send Code to Parent</div>
      <div className="mt-2 grid gap-2">
        <input className="px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700" placeholder="Search by name or enter child name" value={childName} onChange={e=>setChildName(e.target.value)} />
        <input className="px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700" placeholder="Parent phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <button className="px-4 py-3 bg-emerald-600 text-white rounded-lg" onClick={async()=>{ await send(); window.open(wa, '_blank') }}>Send WhatsApp</button>
        <button className="px-4 py-3 bg-blue-600 text-white rounded-lg" onClick={async()=>{ await send(); window.location.href = sms }}>Send SMS</button>
        <div className="flex items-center justify-between mt-2">
          <div>Remember this Parent</div>
          <button aria-pressed={remember} onClick={()=>{
            setRemember(v=>{
              const next = !v
              if (!next) localStorage.removeItem('remember_parent')
              return next
            })
          }} className={(remember?"bg-blue-600":"bg-gray-300") + " relative w-12 h-6 rounded-full transition-colors cursor-pointer"}>
            <span className={(remember?"translate-x-6":"translate-x-0") + " absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"}></span>
          </button>
        </div>
        {!!sent && <div className="text-emerald-700">{sent}</div>}
        <button className="px-4 py-3 bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-100" onClick={()=>{ setRefresh(r=>r+1); setSent(''); }}>Generate New Code</button>
      </div>
    </div>
  )
}