// app/admin/users/page.tsx
import { PrismaClient } from '@prisma/client'
import { Plus, User, Shield, Inbox } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from './DeleteUserButton'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function UsersPage() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')?.value
  if (userRole !== 'ADMIN') {
    redirect('/admin/audit')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6 font-sans">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Data Pengguna</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">Kelola akun Admin dan Pegawai.</p>
        </div>
        <Link
          href="/admin/users/create"
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-red-100 dark:shadow-none transition"
        >
          <Plus size={20} strokeWidth={3} />
          Tambah User Baru
        </Link>
      </div>

      {/* DAFTAR / TABEL USER */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 min-h-[400px]">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-full mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
            <Inbox className="text-slate-300 dark:text-slate-600" size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Belum Ada Pengguna</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm text-center">
            Sistem saat ini tidak mendeteksi pengguna yang terdaftar.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <table className="w-full text-left text-sm border-separate border-spacing-y-2">
            <thead className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider relative z-10 drop-shadow-sm">
              <tr>
                <th className="px-6 py-4 rounded-l-xl bg-slate-100/50 dark:bg-slate-800/80">Nama Lengkap</th>
                <th className="px-6 py-4 bg-slate-100/50 dark:bg-slate-800/80">Email</th>
                <th className="px-6 py-4 bg-slate-100/50 dark:bg-slate-800/80">Role / Jabatan</th>
                <th className="px-6 py-4 text-center rounded-r-xl bg-slate-100/50 dark:bg-slate-800/80">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="group bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/70 transition-all rounded-xl shadow-sm hover:shadow-md outline outline-1 outline-slate-100 dark:outline-slate-800 hover:outline-red-100/50 relative">
                  <td className="px-6 py-4 rounded-l-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 p-2.5 rounded-full text-slate-400 dark:text-slate-400 group-hover:text-red-500 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                        <User size={20} />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100/50 dark:border-purple-900/50'
                        : user.role === 'AUDITOR'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-100/50 dark:border-amber-900/50'
                        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100/50 dark:border-blue-900/50'
                    }`}>
                      {user.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center rounded-r-xl">
                    <DeleteButton id={user.id} name={user.name!} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}