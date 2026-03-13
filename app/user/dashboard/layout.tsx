import { getAuthUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import UserLayoutClient from "./UserLayoutClient";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "User") {
    redirect("/login");
  }

  return <UserLayoutClient>{children}</UserLayoutClient>;
}