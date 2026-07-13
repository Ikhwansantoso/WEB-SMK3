import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ArsipPageClient from "./ArsipClient";

export default async function ArsipPage() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("user_role")?.value;

  if (userRole !== "ADMIN") {
    redirect("/admin/audit");
  }

  return <ArsipPageClient />;
}
