"use client";

import { useState } from "react";

export default function DoctorProfilePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    image: "", // Base64 or Image Link
    degree: "",
    specialties: "",
    experience: "",
    fee: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // আপনার ইউজারের আসল ID দিন (Localstorage/Session থেকে)
      const userId = "USER_ID_HERE"; 

      const res = await fetch(`http://localhost:5000/api/doctor/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Profile submitted! Awaiting Admin Approval.");
      } else {
        setMessage(data.message || "Failed to save profile.");
      }
    } catch (err) {
      setMessage("An error occurred while saving profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl border border-slate-200">
      <h1 className="text-2xl font-bold mb-4">Doctor Profile Credentials</h1>
      
      {message && <p className="p-3 mb-4 bg-teal-50 text-teal-700 rounded-lg">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" onChange={handleChange} required className="w-full border p-2 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium">Image (URL or Base64)</label>
          <input name="image" onChange={handleChange} className="w-full border p-2 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Degree</label>
            <input name="degree" onChange={handleChange} required className="w-full border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium">Specialties</label>
            <input name="specialties" onChange={handleChange} required className="w-full border p-2 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Experience (Years)</label>
            <input name="experience" type="number" onChange={handleChange} required className="w-full border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium">Consultation Fee (BDT)</label>
            <input name="fee" type="number" onChange={handleChange} required className="w-full border p-2 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Short Biography</label>
          <textarea name="bio" rows="3" onChange={handleChange} className="w-full border p-2 rounded-lg"></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700"
        >
          {loading ? "Saving..." : "Save Credentials"}
        </button>
      </form>
    </div>
  );
}