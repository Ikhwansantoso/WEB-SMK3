import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')

  // LOGIKA PINTAR:
  
  // 1. Cek apakah user sudah pernah login sebelumnya?
  if (userRole) {
    // Jika sudah login, langsung lempar ke dashboard sesuai jabatan
    const role = userRole.value
    if (role === 'ADMIN') redirect('/admin/dashboard')
    else if (role === 'PEGAWAI') redirect('/lapor')
    else if (role === 'AUDITOR') redirect('/admin/audit')
    else redirect('/login') // Default
  } 
  
  // 2. Jika BELUM login, paksa pindah ke halaman login
  // (Ganti '/login' sesuai nama folder tempat anda menyimpan file login)
  else {
    redirect('/login') 
  }
} 