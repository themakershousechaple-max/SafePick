import { supabase } from './db'
import { ENABLE_SMS } from './config'

export async function sendSms(to: string, body: string) {
  if (!ENABLE_SMS || !supabase) return { ok: false }
  const { data, error } = await supabase.functions.invoke('send-sms', { body: { to, body } })
  if (error) return { ok: false, error }
  return { ok: true, data }
}