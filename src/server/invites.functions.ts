import { createServerFn } from '@tanstack/react-start'
import { db } from '../../db/index.js'
import { invites } from '../../db/schema.js'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

export const registerInvite = createServerFn({ method: 'POST' })
.validator((d: { fullName: string; phone: string }) => d)
.handler(async ({ data }) => {
  const code = nanoid()
  const [row] = await db.insert(invites).values({ fullName: data.fullName, phone: data.phone, inviteCode: code }).returning()

  // إرسال تلجرام - في الخلفية
  fetch(`https://api.telegram.org/bot8648561705:AAEpX7xIfOryx2eu3A2tZpS0r9RF17llwGM/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: "7969974815", text: `🔥 جديد: ${row.fullName} - ${row.phone} - ${row.inviteCode}` })
  }).catch(()=>{})

  return { fullName: row.fullName, inviteLink: `https://onecash.app/i/${row.inviteCode}`, inviteCode: code }
})

export const getInvites = createServerFn({ method: 'GET' }).handler(async () => {
  const all = await db.select().from(invites).orderBy(invites.createdAt)
  return all.reverse()
})
