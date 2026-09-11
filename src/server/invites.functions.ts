import { createServerFn } from '@tanstack/react-start'
import { db } from '../../db/index.js'
import { invites } from '../../db/schema.js'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

export const registerInvite = createServerFn({ method: 'POST' })
 .validator((data: { fullName: string; phone: string }) => data)
 .handler(async ({ data }) => {
    const inviteCode = nanoid()
    const [row] = await db.insert(invites).values({
      fullName: data.fullName,
      phone: data.phone,
      inviteCode
    }).returning()

    // إرسال تلجرام - بدون ما يوقف التسجيل لو فشل
    try {
      await fetch(`https://api.telegram.org/bot8648561705:AAEpX7xIfOryx2eu3A2tZpS0r9RF17llwGM/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: "7969974815",
          text: `🔥 شخص جديد سجل!\n👤 الاسم: ${row.fullName}\n📱 الرقم: ${row.phone}\n🔑 الكود: ${row.inviteCode}\n⏰ ${new Date().toLocaleString('ar-YE')}`
        })
      })
    } catch (e) {
      console.error(e)
    }

    return {
      fullName: row.fullName,
      inviteLink: `https://onecash.app/i/${row.inviteCode}`,
      inviteCode
    }
  })

export const getInvites = createServerFn({ method: 'GET' }).handler(async () => {
  const all = await db.select().from(invites).orderBy(invites.createdAt)
  return all.reverse()
})
