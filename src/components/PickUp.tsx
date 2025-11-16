import { useEffect, useMemo, useState } from 'react'
import { getRecords } from '../lib/storage'
import { findByCode, releaseById, listAll, subscribeToCheckIns } from '../lib/repo'

function useQuery() {
  const params = new URLSearchParams(window.location.search)
  return params
}

function nowIso() { return new Date().toISOString() }

export default function PickUp() {
  const q = useQuery()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(undefined)

  useEffect(() => {
    const c = q.get('code')
    if (c) setCode(c)
    if (c) { lookupWith(c) }
  }, [])

  const [searchList, setSearchList] = useState(() => getRecords())
  useEffect(() => { listAll().then(setSearchList).catch(()=>{}) }, [])

  useEffect(() => {
    const sub = subscribeToCheckIns(() => {
      listAll().then(setSearchList).catch(()=>{})
      if (code) lookupWith(code)
    })
    return () => { sub.unsubscribe() }
  }, [code])
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => searchList.filter(r => r.childName.toLowerCase().includes(query.toLowerCase()) || r.code.includes(query)), [searchList, query])

  function lookup() { lookupWith(code) }

  async function lookupWith(c: string) {
    setError('')
    try {
      const r = await findByCode(c)
      if (!r) { setResult(undefined); setError('Invalid code'); return }
      if (r.pickUpAt) { setResult(r); setError('Code already used'); return }
      setResult(r)
    } catch (e: any) {
      setError(String(e.message || e))
    }
  }

  async function release() {
    if (!result) return
    try {
      const updated = await releaseById(result.id)
      setResult(updated)
    } catch (e: any) {
      setError(String(e.message || e))
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="bg-white rounded-xl border p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="text-sm font-semibold">Find Pickup</div>
        <div className="grid gap-3 mt-2">
          <input className="px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700" placeholder="Enter code" value={code} onChange={e=>setCode(e.target.value)} />
          <button className="px-4 py-3 bg-blue-600 text-white rounded-lg" onClick={lookup}>Lookup</button>
          <input className="px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700" placeholder="Search by name or code" value={query} onChange={e=>setQuery(e.target.value)} />
        </div>
      </div>

      {error && <div className="mt-3 text-red-600">{error}</div>}

      {result && (
        <div className="mt-6 bg-white rounded-xl border p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="text-xl font-semibold">Child: {result.childName}</div>
          <div className="mt-1 text-gray-700 dark:text-gray-300">Parent: {result.parentName}</div>
          <div className="mt-1 text-gray-700 dark:text-gray-300">Service: {result.serviceTime || '-'}</div>
          <div className="mt-1 text-gray-700 dark:text-gray-300">Code: {result.code}</div>
          <div className="mt-1 text-gray-700 dark:text-gray-300">Checked in: {new Date(result.checkInAt).toLocaleString()}</div>
          {result.pickUpAt ? (
            <div className="mt-2 text-emerald-700">Released: {new Date(result.pickUpAt).toLocaleString()}</div>
          ) : (
            <button className="mt-4 px-4 py-3 bg-emerald-600 text-white rounded-lg" onClick={release}>Release Child</button>
          )}
        </div>
      )}

      {!!filtered.length && (
        <div className="mt-6">
          <div className="font-semibold">Matches</div>
          <div className="grid gap-2">
            {filtered.slice(0,10).map(r => (
              <div key={r.id} className="p-2 border rounded flex justify-between bg-white dark:bg-gray-800 dark:border-gray-700">
                <div>{r.childName} • {r.code}</div>
                <button className="px-2 py-1 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-100" onClick={()=>{ setCode(r.code); setQuery(''); lookup() }}>Select</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}