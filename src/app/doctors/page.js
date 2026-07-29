'use client';
import { useState } from 'react';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import DoctorCard from '@/components/doctors/DoctorCard';

export default function FindDoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [sortBy, setSortBy] = useState('fee-low');
  const [viewMode, setViewMode] = useState('grid'); // Optional requirement: Layout change
  const [currentPage, setCurrentPage] = useState(1);

  const specializations = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology'];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Find Expert Doctors</h1>
        <p className="text-slate-600 mt-2">Search and book top verified healthcare specialists easily.</p>
      </div>

      {/* Control Bar: Search + Filter + Sort + Layout */}
      <div className="bg-white p-4 rounded-xl shadow-md border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
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

        {/* Filter Specialization */}
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

        {/* View Toggle (Optional Requirement) */}
        <div className="flex border rounded-lg overflow-hidden">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2.5 ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`p-2.5 ${viewMode === 'table' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Doctors Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loop DoctorCard component here */}
          <DoctorCard />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-50">
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Fee</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Doctor Row Example */}
              <tr>
                <td className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                      <img src="https://i.ibb.co/mJRqC9L/user-avatar.png" alt="Doctor" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Dr. Sarah Jenkins</div>
                    <div className="text-xs text-slate-500">MBBS, MD</div>
                  </div>
                </td>
                <td>Cardiology</td>
                <td>12 Years</td>
                <td>$120</td>
                <td>
                  <button className="btn btn-sm bg-teal-600 text-white">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 gap-2">
        <button className="btn btn-outline btn-sm" disabled>Previous</button>
        <button className="btn btn-sm bg-teal-600 text-white">1</button>
        <button className="btn btn-sm btn-outline">2</button>
        <button className="btn btn-outline btn-sm">Next</button>
      </div>
    </main>
  );
}