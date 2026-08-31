import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50">
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Dashboard Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}