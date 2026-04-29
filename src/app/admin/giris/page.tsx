import LoginForm from "@/components/admin/LoginForm";
import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="paper-stage min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16">
      <Heart className="absolute left-[6%] top-[14%] hidden md:block w-10 h-10 text-rose-200/55 animate-float-slow" />
      <Heart className="absolute right-[12%] top-[24%] hidden md:block w-8 h-8 text-rose-200/45 animate-float-slower" />
      <Heart className="absolute left-[14%] bottom-[18%] hidden md:block w-7 h-7 text-rose-200/50 animate-float-slow" />
      <Heart className="absolute right-[8%] bottom-[14%] hidden md:block w-9 h-9 text-rose-200/35 animate-float-slower" />
      <Heart className="absolute left-[22%] top-[34%] hidden lg:block w-6 h-6 text-rose-200/35 animate-float-slow" />
      <Heart className="absolute right-[22%] top-[40%] hidden lg:block w-6 h-6 text-rose-200/35 animate-float-slower" />
      <Sparkles className="absolute left-[10%] bottom-[10%] hidden md:block w-7 h-7 text-cream-50/45 animate-float-slow" />
      <Sparkles className="absolute right-[18%] top-[12%] hidden md:block w-6 h-6 text-cream-50/35 animate-float-slower" />

      <div className="w-full max-w-md paper-surface p-6 md:p-8 relative z-10">
        <h1 className="font-serif text-4xl text-cream-50 mb-6">Panel Giriş</h1>
        <LoginForm />
        <Link href="/" className="block text-center mt-6 text-sm text-cream-50/80 hover:text-cream-50 transition-colors">
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}
