import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside>
      <ul>
        <li><Link href="/admin/dashboard">Dashboard</Link></li>
        <li><Link href="/admin/dashboard/users">Users</Link></li>
        <li><Link href="/admin/dashboard/resources">Resources</Link></li>
      </ul>
    </aside>
  );
}
