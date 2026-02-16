import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/api/lib/requireAdmin";
import AdminDashboard from "../components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/auth/sign-in");
  return <AdminDashboard />;
}
