'use client';
import { Search } from 'lucide-react';

export default function DoctorSearchFilter({ searchTerm, setSearchTerm, selectedSpec, setSelectedSpec, sortBy, setSortBy }) {
  const specializations = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology'];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search doctor by name..."
          className="input input-bordered w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Specialization Filter */}
      <div className="w-full md:w-1/4">
        <select 
          className="select select-bordered w-full"
          value={selectedSpec}
          onChange={(e) => setSelectedSpec(e.target.value)}
        >
          {specializations.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {/* Sorting */}
      <div className="w-full md:w-1/4">
        <select 
          className="select select-bordered w-full"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="fee-low">Fee: Low to High</option>
          <option value="fee-high">Fee: High to Low</option>
          <option value="experience">Most Experienced</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}