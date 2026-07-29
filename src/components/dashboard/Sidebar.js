'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserCheck, Calendar, CreditCard, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/dashboard/admin/manage-users', icon: Users },
    { label: 'Manage Doctors', href: '/dashboard/admin/manage-doctors', icon: UserCheck },
    { label: 'Appointments', href: '/dashboard/admin/manage-appointments', icon: Calendar },
    { label: 'Payments', href: '/dashboard/admin/payments', icon: CreditCard },
    { label: 'My Profile', href: '/dashboard/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Exit Dashboard</span>
        </Link>
      </div>
    </aside>
  );
}