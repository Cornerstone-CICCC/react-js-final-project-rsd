import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/api/lib/requireAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    if (auth.status === 401) redirect("/auth/sign-in?next=/admin");
    redirect("/?denied=admin");
  }

  return <section>{children}</section>;
}
