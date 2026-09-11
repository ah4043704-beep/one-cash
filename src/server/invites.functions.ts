import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { invites } from '../../db/schema.js'
const YEMEN_PHONE_REGEX = /^7[0137][0-9]{7}$/
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
    return { fullName: record.fullName, inviteCode: record.inviteCode, inviteLink: `https://onecash.app/i/${record.inviteCode}` }
})
