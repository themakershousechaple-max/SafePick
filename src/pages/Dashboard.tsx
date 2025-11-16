import { useEffect, useMemo, useState } from 'react'
import { listAll, subscribeToCheckIns } from '../lib/repo'
import { Link } from 'react-router-dom'
import { IconMenu, IconBell, IconSearch } from '../components/icons'

export default function Dashboard() {
  const [rows, setRows] = useState<any[]>([])
  useEffect(() => { listAll().then(setRows).catch(()=>{}) }, [])
  useEffect(() => { const sub = subscribeToCheckIns(() => listAll().then(setRows).catch(()=>{})); return () => sub.unsubscribe() }, [])
  const checkedIn = useMemo(() => rows.filter(r => !r.pickUpAt), [rows])

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <button className="p-2 text-gray-600 dark:text-gray-300"><IconMenu /></button>
        <div className="text-lg font-semibold">Sunday Service Check-In</div>
        <button className="relative p-2 text-gray-600 dark:text-gray-300"><IconBell /><span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full"></span></button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">Checked-In</div>
          <div className="text-2xl font-bold">{checkedIn.length} / 50</div>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">Volunteers</div>
          <div className="text-2xl font-bold">6</div>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        <Link to="/register" className="px-4 py-3 bg-blue-600 text-white rounded-lg text-center">Check-In Child</Link>
        <Link to="/generate" className="px-4 py-3 bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-lg text-center">Generate Pickup Code</Link>
        <div className="flex items-center gap-2 px-3 py-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"><IconSearch className="text-gray-400 dark:text-gray-500" /><input className="flex-1 outline-none bg-transparent dark:text-gray-100" placeholder="Search by name or family..." /></div>
      </div>
      <div className="mt-6">
        <div className="font-semibold">Currently Checked-In</div>
        <div className="grid gap-2 mt-2">
          {checkedIn.map(r => (
            <div key={r.id} className="p-3 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 flex items-center gap-3">
              <img src="/images/avatar.svg" className="w-10 h-10" loading="lazy" />
              <div className="flex-1">
                <div className="font-medium">{r.childName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Age • Juniors Group</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                <div className="text-sm text-gray-600 dark:text-gray-300">{new Date(r.checkInAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}