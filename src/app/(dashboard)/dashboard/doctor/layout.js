import DoctorSidebar from "@/components/dashboard/doctor/DoctorSidebar";

export default function DoctorDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Doctor Dynamic Sidebar */}
        <DoctorSidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}