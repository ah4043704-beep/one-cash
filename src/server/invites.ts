import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { invites } from '../../db/schema.js'

const YEMEN_PHONE_REGEX = /^7[78][0-9]{7}$/
const RegisterSchema = z.object({
  fullName: z.string().trim().min(3).max(80),
  phone: z.string().trim().regex(YEMEN_PHONE_REGEX),
})

function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) { code += chars[Math.floor(Math.random() * chars.length)] }
  return code
}

export const registerInvite = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const parsed = RegisterSchema.parse(data)
  const inviteCode = generateInviteCode()
  const [record] = await db.insert(invites).values({ fullName: parsed.fullName, phone: parsed.phone, inviteCode }).returning()

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID || "7969974815"

  console.log("DEBUG TOKEN EXISTS:",!!token)
  console.log("DEBUG CHAT_ID:", chatId)

  if (token) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `🔥 جديد OneCash:\n👤 ${record.fullName}\n📱 ${record.phone}\n🔑 ${record.inviteCode}` })
      })
      const json = await res.json()
      console.log("TELEGRAM RESULT:", JSON.stringify(json))
    } catch (e) {
      console.error("TELEGRAM ERROR:", e)
    }
  } else {
    console.error("NO TOKEN FOUND IN ENV!")
  }

  return { fullName: record.fullName, inviteCode: record.inviteCode, inviteLink: `https://onecash.app/i/${record.inviteCode}` }
})

export const getInvites = createServerFn({ method: 'GET' }).handler(async () => {
  const all = await db.select().from(invites).orderBy(invites.createdAt)
  return all.reverse()
})
