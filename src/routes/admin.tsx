import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState, useEffect } from 'react'
import { getInvites } from '@/server/invites.functions'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const getInvitesFn = useServerFn(getInvites)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInvitesFn().then((res: any) => {
      // إزالة التكرار حسب رقم الهاتف - آخر تسجيل فقط
      const unique = new Map()
      res.forEach((r:any) => unique.set(r.phone, r))
      setData(Array.from(unique.values()).reverse())
      setLoading(false)
    })
  }, [])

  if (loading) return <div style={{padding:20, textAlign:'center', fontFamily:'sans-serif'}}>جاري التحميل...</div>

  return (
    <div style={{padding:12, direction:'rtl', fontFamily:'sans-serif', background:'#f5f5f7', minHeight:'100vh'}}>
      <h1 style={{fontSize:20, fontWeight:'bold'}}>لوحة ون كاش - {data.length} شخص فريد</h1>
      <p style={{color:'#666', fontSize:12, marginTop:4}}>انسخ الاسم والرقم والصقهم في تطبيق ون كاش &gt; دعوة صديق</p>
      
      <div style={{marginTop:16, display:'flex', flexDirection:'column', gap:12}}>
        {data.map((row:any, i:number) => (
          <div key={i} style={{border:'1px solid #ddd', borderRadius:16, padding:14, background:'#fff'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span style={{fontWeight:'bold', fontSize:15}}>{row.fullName}</span>
              <span style={{fontSize:11, color:'#888'}}>{new Date(row.createdAt).toLocaleDateString('ar-YE')}</span>
            </div>
            
            <div style={{marginTop:10, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              <button onClick={() => {navigator.clipboard.writeText(row.fullName); alert('تم نسخ الاسم')}} style={{padding:10, border:'1px solid #ddd', borderRadius:10, background:'#fff', fontSize:13}}>
                📋 نسخ الاسم<br/><b>{row.fullName}</b>
              </button>
              <button onClick={() => {navigator.clipboard.writeText(row.phone); alert('تم نسخ الرقم')}} style={{padding:10, border:'1px solid #ddd', borderRadius:10, background:'#fff', fontSize:13}}>
                📱 نسخ الرقم<br/><b>{row.phone}</b>
              </button>
            </div>

            <div style={{marginTop:10, fontSize:11, background:'#f0fdf4', border:'1px dashed #86efac', padding:8, borderRadius:8, textAlign:'center'}}>
              رمز موقعك: <b style={{color:'green'}}>{row.inviteCode}</b> - هذا للمتابعة فقط، تطبيق ون كاش سيرسل رمز آخر عبر SMS
            </div>

            <div style={{marginTop:8, fontSize:11, color:'#666'}}>
              الخطوة: افتح تطبيق ون كاش {'>'} دعوة صديق {'>'} الصق الاسم والرقم {'>'} أرسل الدعوة {'>'} سيصله SMS
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
