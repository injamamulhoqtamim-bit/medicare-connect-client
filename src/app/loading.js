export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
      <p className="text-slate-600 font-semibold text-lg">Loading MediCare Connect...</p>
    </div>
  );
}