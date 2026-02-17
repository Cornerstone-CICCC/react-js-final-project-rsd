import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/api/lib/requireAdmin";
import AdminDashboard from "../components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    if (auth.status === 401) redirect("/auth/sign-in?next=/admin");
    redirect("/?denied=admin");
  }

  return <AdminDashboard />;
}
