import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
      <div className="mx-auto max-w-md grid grid-cols-4">
        <NavLink to="/" className={({isActive})=>"flex flex-col items-center py-2 " + (isActive?"text-blue-600":"text-gray-500 dark:text-gray-400")}>Home</NavLink>
        <NavLink to="/lookup" className={({isActive})=>"flex flex-col items-center py-2 " + (isActive?"text-blue-600":"text-gray-500 dark:text-gray-400")}>Search</NavLink>
        <NavLink to="/dashboard" className={({isActive})=>"flex flex-col items-center py-2 " + (isActive?"text-blue-600":"text-gray-500 dark:text-gray-400")}>Dashboard</NavLink>
        <NavLink to="/help" className={({isActive})=>"flex flex-col items-center py-2 " + (isActive?"text-blue-600":"text-gray-500 dark:text-gray-400")}>Help</NavLink>
      </div>
    </nav>
  )
}