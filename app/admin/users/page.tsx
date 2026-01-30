// app/admin/users/page.tsx
import { PrismaClient } from '@prisma/client'
import { Plus, User, Shield, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Server Action untuk Hapus User
async function deleteUser(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  
  // Mencegah penghapusan user terakhir (biar gak kekunci)
  const totalUsers = await prisma.user.count()
  if (totalUsers <= 1) return // Jangan hapus kalau cuma tinggal 1

  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/users')
}

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Data Pengguna</h1>
          <p className="text-slate-600 font-medium mt-1">Kelola akun Admin dan Pegawai.</p>
        </div>
        <Link 
          href="/admin/users/create" 
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-red-100 transition"
        >
          <Plus size={20} strokeWidth={3} />
          Tambah User Baru
        </Link>
      </div>

      {/* TABEL USER */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Nama Lengkap</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role / Jabatan</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-full text-slate-500">
                        <User size={20} />
                    </div>
                    <span className="font-bold text-slate-800">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                    user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {user.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                    <form action={deleteUser}>
                        <input type="hidden" name="id" value={user.id} />
                        <button className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition" title="Hapus User">
                            <Trash2 size={18} />
                        </button>
                    </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}