'use client';
import { Search } from 'lucide-react';

export default function DoctorSearchFilter({ 
  searchTerm, 
  setSearchTerm, 
  selectedSpec, 
  setSelectedSpec, 
  sortBy, 
  setSortBy 
}) {
  const specializations = [
    'All', 
    'Cardiology', 
    'Neurology', 
    'Orthopedics', 
    'Pediatrics', 
    'Dermatology'
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search doctor by name or email..."
          className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Specialization Filter */}
      <div className="w-full md:w-1/4">
        <select 
          className="w-full rounded-lg border border-slate-300 py-3 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white"
          value={selectedSpec}
          onChange={(e) => setSelectedSpec(e.target.value)}
        >
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec === 'All' ? 'All Specializations' : spec}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting */}
      <div className="w-full md:w-1/4">
        <select 
          className="w-full rounded-lg border border-slate-300 py-3 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort By: Default</option>
          <option value="fee-low">Fee: Low to High</option>
          <option value="fee-high">Fee: High to Low</option>
          <option value="experience">Most Experienced</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}