import { useEffect, useRef, useState } from 'react'
import { IconChevronDown } from './icons'

type Props = {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}

export default function CustomSelect({ value, onChange, options, placeholder = 'Select a classroom' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function select(v: string) {
    onChange(v)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative w-full">
      <button type="button" onClick={() => setOpen(o=>!o)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 pr-10 text-left hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600">
        {value || placeholder}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"><IconChevronDown /></span>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
          {options.map(opt => (
            <button key={opt} type="button" onClick={() => select(opt)} className={"block w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 " + (value===opt? 'bg-blue-50 dark:bg-gray-700' : '')}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}