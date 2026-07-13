import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SuratPageClient from "./SuratClient";

export default async function SuratPage() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("user_role")?.value;

  if (userRole !== "ADMIN") {
    redirect("/admin/audit");
  }

  return <SuratPageClient />;
}
