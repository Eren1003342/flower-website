import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProducts, getSiteContent } from "@/lib/cms";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/giris");
  }

  const [products, content] = await Promise.all([getProducts(), getSiteContent()]);

  return <AdminDashboard initialProducts={products} initialContent={content} />;
}
