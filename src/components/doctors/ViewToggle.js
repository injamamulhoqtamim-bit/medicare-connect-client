'use client';
import { LayoutGrid, List } from 'lucide-react';

export default function ViewToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex border rounded-lg overflow-hidden">
      <button 
        onClick={() => setViewMode('grid')}
        className={`p-2.5 transition ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        title="Grid View"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button 
        onClick={() => setViewMode('table')}
        className={`p-2.5 transition ${viewMode === 'table' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        title="Table View"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}