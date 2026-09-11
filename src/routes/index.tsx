import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState, useRef } from 'react'
import { registerInvite } from '@/server/invites.functions'

export const Route = createFileRoute('/')({
  component: OneCashInvitePage,
})

type FormErrors = {
  fullName?: string
  phone?: string
}

type SuccessData = {
  fullName: string
  inviteLink: string
}

const NAME_PATTERN = /^[؀-ۿ\s]+$/
const PHONE_PATTERN = /^7[0137][0-9]{7}$/

function validate(fullName: string, phone: string): FormErrors {
  const errors: FormErrors = {}
  const trimmedName = fullName.trim()

  if (trimmedName.length < 3) {
    errors.fullName = 'الرجاء إدخال الاسم الكامل'
  } else if (!NAME_PATTERN.test(trimmedName)) {
    errors.fullName = 'يرجى إدخال الاسم بالعربية فقط'
  }

  if (!PHONE_PATTERN.test(phone)) {
    errors.phone = 'رقم الهاتف غير صحيح (مثال: 7XXXXXXXX)'
  }

  return errors
}

function OneCashInvitePage() {
  const registerInviteFn = useServerFn(registerInvite)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState<SuccessData | null>(null)
  const [shakeKey, setShakeKey] = useState(0)
  const formCardRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)

    const nextErrors = validate(fullName, phone)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setShakeKey((k) => k + 1)
      return
    }

    setIsSubmitting(true)
    try {
      const result = await registerInviteFn({
        data: { fullName: fullName.trim(), phone },
      })
      setSuccess({ fullName: result.fullName, inviteLink: result.inviteLink })
    } catch {
      setSubmitError('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.')
      setShakeKey((k) => k + 1)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setSuccess(null)
    setFullName('')
    setPhone('')
    setErrors({})
    setSubmitError(null)
  }

  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--oc-cream)' }}>
      <header className="oc-hero-bg px-5 pt-8 pb-10 sm:px-8 sm:pt-10">
        <div className="relative z-10 mx-auto max-w-md sm:max-w-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xl font-extrabold text-white sm:text-2xl">ون كاش</div>
                <div className="text-[11px] font-medium text-white/70 sm:text-xs">محفظتك الرقمية</div>
              </div>
            </div>
            <div className="oc-logo-badge flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl sm:h-16 sm:w-16">
              <span className="text-[13px] font-black leading-tight text-white sm:text-sm">ون</span>
              <span className="text-[13px] font-black leading-tight text-white sm:text-sm">كاش</span>
            </div>
          </div>

          <div className="oc-rise mt-8 flex justify-center" style={{ animationDelay: '80ms' }}>
            <span className="oc-badge inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-bold sm:text-sm">
              <span aria-hidden="true">✦</span>
              دعوة خاصة لك
              <span aria-hidden="true">✦</span>
            </span>
          </div>

          <h1
            className="oc-rise mt-5 text-center text-[28px] font-extrabold leading-[1.35] sm:text-4xl"
            style={{ color: '#fdf6ea', animationDelay: '160ms' }}
          >
            ادخل بياناتك واحصل على{' '}
            <span style={{ color: 'var(--oc-gold)' }}>رابط دعوتك</span> الخاص فورًا
          </h1>

          <p
            className="oc-rise mx-auto mt-4 max-w-sm text-center text-[15px] leading-relaxed text-white/75 sm:text-base"
            style={{ animationDelay: '220ms' }}
          >
            أدخل اسمك ورقم هاتفك ليتم إنشاء رابط الدعوة الخاص بك مع رابط تحميل التطبيق مباشرة.
          </p>

          <div className="oc-pop mt-7 flex justify-center" style={{ animationDelay: '300ms' }}>
            <div className="oc-gold-card w-full max-w-xs rounded-2xl px-6 py-5 text-center sm:max-w-sm">
              <div className="text-2xl font-black text-[#4a2a06] sm:text-3xl">٥٠٠ ريال يمني</div>
              <div className="mt-1 text-[13px] font-semibold text-[#5c3a10] sm:text-sm">
                هدية ترحيبية عند فتح الحساب
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="oc-stripe-divider" />

      <main className="px-5 py-10 sm:px-8">
        <div
          ref={formCardRef}
          key={shakeKey}
          className={`oc-form-card mx-auto max-w-md rounded-[28px] p-6 sm:max-w-lg sm:p-9 ${
            shakeKey > 0 && (errors.fullName || errors.phone || submitError) ? 'oc-shake' : ''
          }`}
        >
          {!success ? (
            <>
              <h2 className="text-center text-[22px] font-extrabold sm:text-2xl" style={{ color: 'var(--oc-brown)' }}>
                سجّل بياناتك
              </h2>
              <p className="mt-1.5 text-center text-sm text-[#8a6a5a] sm:text-[15px]">
                خطوة واحدة فقط — الاسم ورقم الهاتف
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-bold" style={{ color: 'var(--oc-brown)' }}>
                    الاسم الكامل
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    dir="rtl"
                    placeholder="مثال: صالحة محمد قاسم"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                    className={`oc-input w-full rounded-2xl px-4 py-3.5 text-[15px] text-[#3a2018] placeholder:text-[#b39383] sm:text-base ${
                      errors.fullName ? 'oc-input-error' : ''
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-[13px] font-medium text-[#c23b3b]">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-bold" style={{ color: 'var(--oc-brown)' }}>
                    رقم الهاتف
                  </label>
                  <div
                    className={`oc-input flex items-center overflow-hidden rounded-2xl ${
                      errors.phone ? 'oc-input-error' : ''
                    }`}
                  >
                    <span className="border-e border-[#4a1f1a]/10 px-4 py-3.5 text-[15px] font-bold text-[#8a6a5a] sm:text-base">
                      +967
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      dir="ltr"
                      placeholder="7XXXXXXXX"
                      value={phone}
                      maxLength={9}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      aria-invalid={Boolean(errors.phone)}
                      className="w-full bg-transparent px-4 py-3.5 text-left text-[15px] text-[#3a2018] placeholder:text-[#b39383] focus:outline-none sm:text-base"
                    />
                  </div>
                  {errors.phone && <p className="mt-1.5 text-[13px] font-medium text-[#c23b3b]">{errors.phone}</p>}
                </div>

                {submitError && (
                  <p className="rounded-xl bg-[#fbeaea] px-4 py-2.5 text-center text-sm font-medium text-[#c23b3b]">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="oc-submit-btn w-full rounded-2xl py-4 text-[17px] font-extrabold text-white sm:text-lg"
                >
                  {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال البيانات'}
                </button>

                <p className="text-center text-[12.5px] leading-relaxed text-[#9a7d6f] sm:text-[13px]">
                  بالمتابعة، أنت توافق على استخدام بياناتك لإنشاء رابط الدعوة والتواصل معك بخصوص العرض.
                </p>
              </form>
            </>
          ) : (
            <div className="oc-pop text-center">
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24"
                style={{ background: 'linear-gradient(155deg, #f0925a, var(--oc-orange) 60%, #c85a22)' }}
              >
                <svg viewBox="0 0 24 24" className="h-10 w-10 sm:h-12 sm:w-12" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className="mt-6 text-[19px] font-extrabold leading-relaxed sm:text-xl" style={{ color: 'var(--oc-brown)' }}>
                أهلًا {success.fullName}، تم استلام بياناتك بنجاح
              </h2>

              <p className="mt-3 text-[15px] leading-relaxed text-[#8a6a5a] sm:text-base">
                سيصلك رابط الدعوة الخاص بك قريبًا على الرقم الذي أدخلته.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="mt-5 text-sm font-bold underline decoration-2 underline-offset-4"
                style={{ color: 'var(--oc-teal)' }}
              >
                إدخال بيانات مختلفة
              </button>
            </div>
          )}
        </div>

        <p className="mx-auto mt-9 max-w-md text-center text-[13px] text-[#a8897b] sm:text-sm">
          ون كاش © 2026 — العرض محدود حتى 30 سبتمبر
        </p>
      </main>
    </div>
  )
}
