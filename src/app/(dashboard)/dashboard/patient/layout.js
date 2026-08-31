import PatientSidebar from "./Sidebar";

export default function PatientDashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden md:block">
        <PatientSidebar />
      </div>
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}