import { isAuthed } from '../lib/auth'
import { Outlet, Navigate, useLocation } from 'react-router-dom'

export default function RequireAuth() {
  const loc = useLocation()
  if (!isAuthed()) return <Navigate to="/login" state={{ from: loc }} replace />
  return <Outlet />
}