const KEY = 'auth_token'

function expectedEmail() {
  return (import.meta.env.VITE_LOGIN_EMAIL as string) || 'at'
}

function expectedPassword() {
  return (import.meta.env.VITE_LOGIN_PASSWORD as string) || 'at'
}

export function isAuthed() {
  return !!localStorage.getItem(KEY)
}

export function login(email: string, password: string) {
  if (email.trim().toLowerCase() === expectedEmail().toLowerCase() && password === expectedPassword()) {
    localStorage.setItem(KEY, 'ok')
    return { ok: true }
  }
  return { ok: false }
}

export function logout() {
  localStorage.removeItem(KEY)
}