import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { invites } from '../../db/schema.js'
import { eq } from 'drizzle-orm'

const YEMEN_PHONE_REGEX = /^7[0137][0-9]{7}$/

const RegisterSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'الاسم قصير جدًا')
    .max(80, 'الاسم طويل جدًا')
    .regex(/^[؀-ۿ\s]+$/, 'يرجى إدخال الاسم بالعربية'),
  phone: z
    .string()
    .trim()
    .regex(YEMEN_PHONE_REGEX, 'رقم هاتف يمني غير صحيح'),
})

function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}


    return {
      fullName: record.fullName,
      inviteCode: record.inviteCode,
      inviteLink: `https://onecash.app/i/${record.inviteCode}`,
    }
  })
