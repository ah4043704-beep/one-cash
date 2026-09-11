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
      setData(res)
      setLoading(false)
    })
  }, [])

  if (loading) return <div style={{padding:20, textAlign:'center'}}>جاري التحميل...</div>

  return (
    <div style={{padding:16, direction:'rtl', fontFamily:'sans-serif', background:'#fff', minHeight:'100vh'}}>
      <h1 style={{fontSize:22, fontWeight:'bold'}}>لوحة ون كاش - {data.length} شخص</h1>
      <p style={{color:'#666', fontSize:13, marginTop:4}}>انسخ رمز الدعوة وارسله في الواتساب</p>
      
      <div style={{marginTop:16, display:'flex', flexDirection:'column', gap:12}}>
        {data.map((row:any, i:number) => (
          <div key={i} style={{border:'1px solid #ddd', borderRadius:12, padding:12, background:'#fafafa'}}>
            <div style={{fontWeight:'bold'}}>{row.fullName}</div>
            <div style={{fontSize:14, marginTop:4}}>📱 {row.phone} | 🔑 <span style={{color:'green', fontWeight:'bold', fontSize:16}}>{row.inviteCode}</span></div>
            <div style={{fontSize:12, marginTop:6, background:'#fff', padding:6, borderRadius:6, border:'1px dashed #ccc'}}>
              https://onecash.app/i/{row.inviteCode}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`أهلا ${row.fullName}، رمز دعوتك في ون كاش هو: ${row.inviteCode} - رابطك: https://onecash.app/i/${row.inviteCode} - حمل التطبيق وادخل الرمز`)
                alert('تم نسخ الرسالة')
              }}
              style={{marginTop:8, width:'100%', padding:10, background:'#111', color:'#fff', borderRadius:8, fontWeight:'bold'}}
            >
              نسخ رسالة الواتساب
            </button>
            <div style={{fontSize:11, color:'#888', marginTop:4}}>{new Date(row.createdAt).toLocaleString('ar-YE')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
