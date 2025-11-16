import { useState } from 'react'
import { generateCode } from '../lib/code'
import { createRecord } from '../lib/repo'
import { IconCalendar, IconBack } from '../components/icons'
import CustomSelect from '../components/CustomSelect'

export default function RegisterChild() {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [dob, setDob] = useState('')
  const [classroom, setClassroom] = useState('')
  const [visitor, setVisitor] = useState(false)
  const [guardian, setGuardian] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [allergies, setAllergies] = useState('')
  const [notes, setNotes] = useState('')
  const [consentPhoto, setConsentPhoto] = useState(false)
  const [consentEmergency, setConsentEmergency] = useState(false)
  const [sent, setSent] = useState('')
  const [guardians, setGuardians] = useState<{ name: string, phone: string, email: string }[]>([])
  const [showGuardian, setShowGuardian] = useState(false)
  const [gName, setGName] = useState('')
  const [gPhone, setGPhone] = useState('')
  const [gEmail, setGEmail] = useState('')

  async function onSubmit() {
    const childName = [first, last].filter(Boolean).join(' ')
    const code = generateCode(classroom || undefined)
    const url = window.location.origin + '/pickup?code=' + code
    await createRecord({ childName, parentName: guardian || 'Parent', phone, serviceTime: classroom || undefined, notes: notes || undefined, code, qrUrl: url })
    setSent('Registration complete')
  }

  function addGuardian() {
    if (!gName || !gPhone || !gEmail) return
    const next = guardians.concat({ name: gName, phone: gPhone, email: gEmail })
    setGuardians(next)
    setGName('')
    setGPhone('')
    setGEmail('')
    setShowGuardian(false)
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center gap-3">
        <button className="p-2"><IconBack /></button>
        <div className="font-semibold">Register New Child</div>
      </div>
      <div className="mt-3 text-sm text-gray-600">Step 1 of 4</div>
      <div className="mt-2 h-1 bg-blue-600 w-24 rounded"></div>
      <div className="mt-4 text-lg font-semibold">Child's Information</div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <input className="px-3 py-2 border rounded" placeholder="Enter first name" value={first} onChange={e=>setFirst(e.target.value)} />
        <input className="px-3 py-2 border rounded" placeholder="Enter last name" value={last} onChange={e=>setLast(e.target.value)} />
      </div>
      <div className="mt-3 flex items-center gap-2 px-3 py-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
        <input className="flex-1 outline-none bg-transparent dark:text-gray-100" placeholder="mm/dd/yyyy" value={dob} onChange={e=>setDob(e.target.value)} />
        <IconCalendar className="text-gray-500 dark:text-gray-400" />
      </div>
      <div className="mt-3">
        <div className="text-lg font-semibold mb-1">Assigned Classroom</div>
        <CustomSelect value={classroom} onChange={setClassroom} options={["Nursery","Toddlers","K-2nd Grade"]} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>First-time Visitor?</div>
        <button aria-pressed={visitor} onClick={()=>setVisitor(v=>!v)} className={(visitor?"bg-blue-600":"bg-gray-300 dark:bg-gray-700") + " relative w-12 h-6 rounded-full transition-colors cursor-pointer"}>
          <span className={(visitor?"translate-x-6":"translate-x-0") + " absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-gray-100 rounded-full shadow transition-transform"}></span>
        </button>
      </div>
      <div className="mt-5 text-lg font-semibold">Parent/Guardian Information</div>
      <div className="mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          <input className="px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" placeholder="Enter full name" value={guardian} onChange={e=>setGuardian(e.target.value)} />
          <input className="px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" placeholder="(555) 123-4567" value={phone} onChange={e=>setPhone(e.target.value)} />
        </div>
        <input className="mt-3 px-3 py-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" placeholder="example@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="mt-3 px-4 py-2 border rounded text-blue-600 w-full" onClick={()=>setShowGuardian(true)}>+ Add Another Guardian</button>
        {!!guardians.length && (
          <div className="mt-3">
            {guardians.map((g, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 border rounded mb-2 dark:border-gray-700">
                <div className="text-sm">
                  <div className="font-medium">{g.name}</div>
                  <div className="text-gray-600 dark:text-gray-300">{g.phone} • {g.email}</div>
                </div>
                <button className="text-red-600 text-sm" onClick={()=>setGuardians(guardians.filter((_,idx)=>idx!==i))}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-5 text-lg font-semibold">Health & Safety</div>
      <div className="mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 shadow-sm">
        <div className="text-sm text-red-700 dark:text-red-400">Allergies or Medical Conditions</div>
        <textarea className="mt-2 px-3 py-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" rows={3} placeholder="e.g., Peanut allergy, asthma. Please specify." value={allergies} onChange={e=>setAllergies(e.target.value)} />
      </div>
      <div className="mt-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 shadow-sm">
        <div className="text-sm font-semibold">Special Needs or Instructions</div>
        <textarea className="mt-2 px-3 py-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" rows={3} placeholder="e.g., Needs help with activities, sensitive to loud noises." value={notes} onChange={e=>setNotes(e.target.value)} />
      </div>
      <div className="mt-4 text-lg font-semibold">Permissions</div>
      <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={consentPhoto} onChange={e=>setConsentPhoto(e.target.checked)} /> I consent to my child being photographed/videoed for church promotional purposes.</label>
      <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={consentEmergency} onChange={e=>setConsentEmergency(e.target.checked)} /> I authorize the program staff to contact emergency services if needed.</label>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Your information is stored securely and used only for program purposes.</div>
      <div className="h-24" />
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 border-t dark:border-gray-800">
        <div className="max-w-md mx-auto">
          <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg" onClick={onSubmit}>Complete Registration</button>
          {!!sent && <div className="mt-2 text-emerald-700 dark:text-emerald-400">{sent}</div>}
        </div>
      </div>
      {showGuardian && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="text-lg font-semibold">Add Guardian</div>
            <div className="mt-3 grid gap-3">
              <input className="px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" placeholder="Full name" value={gName} onChange={e=>setGName(e.target.value)} />
              <input className="px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" placeholder="Phone number" value={gPhone} onChange={e=>setGPhone(e.target.value)} />
              <input className="px-3 py-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" placeholder="Email address" value={gEmail} onChange={e=>setGEmail(e.target.value)} />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-4 py-2 border rounded dark:border-gray-700" onClick={()=>setShowGuardian(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded" onClick={addGuardian}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}