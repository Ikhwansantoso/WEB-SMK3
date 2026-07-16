import { cookies } from "next/headers";
import PegawaiLayoutClient from "./components/PegawaiLayoutClient";

export default async function PegawaiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value || "Pegawai";

  return (
    <PegawaiLayoutClient userName={userName}>
      {children}
    </PegawaiLayoutClient>
  );
}
