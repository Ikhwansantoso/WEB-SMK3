'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout() {
  const c = await cookies()
  c.delete("user_role")
  c.delete("user_id")
  c.delete("user_name")
  redirect("/login")
}