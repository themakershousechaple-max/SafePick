import { useEffect, useMemo, useState } from 'react'
import { listAll, releaseById } from '../lib/repo'
import { IconSearch } from '../components/icons'

export default function Lookup() {
  const [rows, setRows] = useState<any[]>([])
  const [tab, setTab] = useState<'in'|'out'>('in')
  const [query, setQuery] = useState('')
  useEffect(() => { listAll().then(setRows).catch(()=>{}) }, [])
  const filtered = useMemo(() => rows.filter(r => (tab==='in'? !r.pickUpAt : !!r.pickUpAt) && (r.childName.toLowerCase().includes(query.toLowerCase()) || r.code.includes(query))), [rows, tab, query])

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Child Look-up</div>
        <div className="w-6 h-6 rounded bg-gray-300 dark:bg-gray-700"></div>
      </div>
      <div className="mt-3 flex items-center gap-2 px-3 py-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
        <IconSearch className="text-gray-400 dark:text-gray-500" />
        <input className="flex-1 outline-none bg-transparent dark:text-gray-100" placeholder="Search by Name or Check-in Code" value={query} onChange={e=>setQuery(e.target.value)} />
      </div>
      <div className="mt-3 flex gap-6 text-sm">
        <button className={"pb-2 border-b-2 " + (tab==='in'?"border-blue-600":"border-transparent text-gray-500 dark:text-gray-400")} onClick={()=>setTab('in')}>Checked In ({rows.filter(r=>!r.pickUpAt).length})</button>
        <button className={"pb-2 border-b-2 " + (tab==='out'?"border-blue-600":"border-transparent text-gray-500 dark:text-gray-400")} onClick={()=>setTab('out')}>Checked Out ({rows.filter(r=>r.pickUpAt).length})</button>
      </div>
      <div className="mt-4 grid gap-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <img src="/images/avatar.svg" className="w-10 h-10" loading="lazy" />
              <div className="flex-1">
                <div className="font-semibold">{r.childName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Nursery</div>
              </div>
              <span className="w-2 h-2 rounded-full " style={{backgroundColor: r.pickUpAt? '#e5e7eb':'#34d399'}}></span>
            </div>
            <div className="mt-3 text-sm text-red-300 dark:text-red-300 bg-red-100 dark:bg-red-950 border border-red-200 dark:border-red-900 px-3 py-2 rounded">Allergy: Peanuts</div>
            <div className="mt-3 text-sm font-semibold">Authorized for Pickup</div>
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">Maria Garcia</div>
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">David Garcia</div>
            <div className="mt-2 text-sm font-semibold">Backup Contacts</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Sophia Rodriguez</div>
            <div className="mt-4">
              {!r.pickUpAt ? (
                <button className="px-4 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2"><span className="text-white">🛡️</span><span onClick={()=>releaseById(r.id).then(u=>setRows(rows.map(x=>x.id===r.id?u:x)))}>Verify & Check-out</span></button>
              ) : (
                <div className="text-emerald-700 dark:text-emerald-400">Checked-out</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}