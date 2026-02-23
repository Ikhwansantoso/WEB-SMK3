// app/admin/users/page.tsx
import { PrismaClient } from '@prisma/client'
import { Plus, User, Shield, Inbox } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from './DeleteUserButton'

const prisma = new PrismaClient()

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

      {/* DAFTAR / TABEL USER */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 min-h-[400px]">
          <div className="bg-white p-6 rounded-full mb-4 shadow-sm border border-slate-100">
            <Inbox className="text-slate-300" size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Belum Ada Pengguna</h3>
          <p className="text-slate-500 text-sm max-w-sm text-center">
            Sistem saat ini tidak mendeteksi pengguna yang terdaftar.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto p-4 bg-slate-50/50 rounded-2xl">
          <table className="w-full text-left text-sm border-separate border-spacing-y-2">
            <thead className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider relative z-10 drop-shadow-sm">
              <tr>
                <th className="px-6 py-4 rounded-l-xl bg-slate-100/50">Nama Lengkap</th>
                <th className="px-6 py-4 bg-slate-100/50">Email</th>
                <th className="px-6 py-4 bg-slate-100/50">Role / Jabatan</th>
                <th className="px-6 py-4 text-center rounded-r-xl bg-slate-100/50">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="group bg-white hover:bg-slate-50/80 transition-all rounded-xl shadow-sm hover:shadow-md outline outline-1 outline-slate-100 hover:outline-red-100/50 relative">
                  <td className="px-6 py-4 rounded-l-xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-50 group-hover:bg-white p-2.5 rounded-full text-slate-400 group-hover:text-red-500 shadow-sm border border-slate-100 transition-colors">
                        <User size={20} />
                      </div>
                      <span className="font-bold text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm ${user.role === 'ADMIN'
                        ? 'bg-purple-50 text-purple-700 border border-purple-100/50'
                        : 'bg-blue-50 text-blue-700 border border-blue-100/50'
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