// app/admin/users/create/page.tsx
import { PrismaClient, Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, UserPlus } from 'lucide-react'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export default async function CreateUserPage() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get('user_role')?.value
  if (userRole !== 'ADMIN') {
    redirect('/admin/audit')
  }

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
        <Link href="/admin/users" className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tambah Pengguna Baru</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Buat akun untuk Pegawai atau Admin baru</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
        <form action={createUser} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Nama Lengkap</label>
            <input name="name" type="text" placeholder="Cth: Budi Santoso" required className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Email</label>
            <input name="email" type="email" placeholder="nama@telkom.co.id" required className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Password</label>
            <input name="password" type="password" placeholder="******" required className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Role / Jabatan</label>
            <div className="grid grid-cols-3 gap-4">
                <label className="cursor-pointer">
                    <input type="radio" name="role" value="PEGAWAI" className="peer sr-only" defaultChecked />
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center hover:bg-slate-50 dark:hover:bg-slate-800 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-950/40 peer-checked:border-blue-500 dark:peer-checked:border-blue-500 peer-checked:text-blue-700 dark:peer-checked:text-blue-300 font-bold transition text-xs md:text-sm text-slate-700 dark:text-slate-300">
                        PEGAWAI
                    </div>
                </label>
                <label className="cursor-pointer">
                    <input type="radio" name="role" value="AUDITOR" className="peer sr-only" />
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center hover:bg-slate-50 dark:hover:bg-slate-800 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-950/40 peer-checked:border-amber-500 dark:peer-checked:border-amber-500 peer-checked:text-amber-700 dark:peer-checked:text-amber-300 font-bold transition text-xs md:text-sm text-slate-700 dark:text-slate-300">
                        AUDITOR
                    </div>
                </label>
                <label className="cursor-pointer">
                    <input type="radio" name="role" value="ADMIN" className="peer sr-only" />
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center hover:bg-slate-50 dark:hover:bg-slate-800 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-950/40 peer-checked:border-purple-500 dark:peer-checked:border-purple-500 peer-checked:text-purple-700 dark:peer-checked:text-purple-300 font-bold transition text-xs md:text-sm text-slate-700 dark:text-slate-300">
                        ADMIN
                    </div>
                </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition flex items-center gap-2">
                <UserPlus size={18} /> Buat Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}