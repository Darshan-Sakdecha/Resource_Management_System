// app/page.tsx
import { redirect } from "next/navigation";
import { getAuthUser } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/roles";

export default async function HomePage() {
  const user = await getAuthUser();

  if (!user) return redirect("/login");

  switch (user.role) {
    case ROLES.ADMIN:
      return redirect("/admin/dashboard");
    case ROLES.MANAGER:
      return redirect("/management/dashboard");
    default:
      return redirect("/user/dashboard");
  }
}
