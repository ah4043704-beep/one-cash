import { createServerFn } from '@tanstack/react-start'
import { db } from '../../db/index.js'
import { invites } from '../../db/schema.js'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)
const BOT_TOKEN = "8648561705:AAEpX7xIfOryx2eu3A2tZpS0r9RF17llwGM"
const CHAT_ID = "7969974815"

async function sendTelegram(fullName: string, phone: string, inviteCode: string) {
  const msg = `🔥 شخص جديد سجل في ون كاش!

👤 الاسم: ${fullName}
📱 الرقم: ${phone}
🔑 رمز الموقع: ${inviteCode}

📌 الخطوة: افتح تطبيق ون كاش > دعوة صديق > الصق الاسم والرقم > أرسل الدعوة

⏰ ${new Date().toLocaleString('ar-YE')}`
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
    })
  } catch (e) { console.error(e) }
}

export const registerInvite = createServerFn({ method: 'POST' })
  .validator((data: { fullName: string; phone: string }) => data)
  .handler(async ({ data }) => {
    const inviteCode = nanoid()
    const [row] = await db.insert(invites).values({ fullName: data.fullName, phone: data.phone, inviteCode }).returning()
    sendTelegram(row.fullName, row.phone, row.inviteCode)
    return { fullName: row.fullName, inviteLink: `https://onecash.app/i/${row.inviteCode}`, inviteCode }
  })

export const getInvites = createServerFn({ method: 'GET' }).handler(async () => {
  const all = await db.select().from(invites).orderBy(invites.createdAt)
  return all.reverse()
})
