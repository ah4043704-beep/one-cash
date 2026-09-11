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
  console.log("INVITE REQUEST:", data)
  const parsed = RegisterSchema.parse(data)
  const inviteCode = generateInviteCode()
  const [record] = await db.insert(invites).values({ fullName: parsed.fullName, phone: parsed.phone, inviteCode }).returning()

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID || "7969974815"

  let telegramStatus = "no token"

  if (token) {
    try {
      console.log("SENDING TO TELEGRAM...")
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `🔥 جديد OneCash:\n👤 ${record.fullName}\n📱 ${record.phone}\n🔑 ${record.inviteCode}` })
      })
      const json: any = await res.json()
      console.log("TELEGRAM JSON:", JSON.stringify(json))
      telegramStatus = json.ok? "sent ok" : `

















