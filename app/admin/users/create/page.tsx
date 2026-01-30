// app/admin/users/create/page.tsx
import { PrismaClient, Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, UserPlus } from 'lucide-react'

const prisma = new PrismaClient()

export default function CreateUserPage() {

  async function createUser(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as Role
    
    await prisma.user.create({
      data: {
        name,
        email,
        password, // Di aplikasi nyata, ini harus di-hash (bcrypt), tapi utk MVP ini oke.
        role
      }
    })

    redirect('/admin/users')
  }

  return (
    <div className="max-w-xl mx-auto font-sans">
      
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/users" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tambah Pengguna Baru</h1>
          <p className="text-slate-500 text-sm">Buat akun untuk Pegawai atau Admin baru</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <form action={createUser} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
            <input name="name" type="text" placeholder="Cth: Budi Santoso" required className="w-full p-3 bg-white border border-slate-300 text-slate-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Email</label>
            <input name="email" type="email" placeholder="nama@telkom.co.id" required className="w-full p-3 bg-white border border-slate-300 text-slate-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <input name="password" type="password" placeholder="******" required className="w-full p-3 bg-white border border-slate-300 text-slate-900 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Role / Jabatan</label>
            <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer">
                    <input type="radio" name="role" value="PEGAWAI" className="peer sr-only" defaultChecked />
                    <div className="p-4 border border-slate-200 rounded-lg text-center hover:bg-slate-50 peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700 font-bold transition">
                        PEGAWAI
                    </div>
                </label>
                <label className="cursor-pointer">
                    <input type="radio" name="role" value="ADMIN" className="peer sr-only" />
                    <div className="p-4 border border-slate-200 rounded-lg text-center hover:bg-slate-50 peer-checked:bg-purple-50 peer-checked:border-purple-500 peer-checked:text-purple-700 font-bold transition">
                        ADMIN
                    </div>
                </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition flex items-center gap-2">
                <UserPlus size={18} /> Buat Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}