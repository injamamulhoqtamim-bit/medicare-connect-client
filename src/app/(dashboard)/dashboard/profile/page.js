"use client";

import { useEffect, useState, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { Camera, Loader2, User } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DoctorProfilePage() {
  const { data: session } = authClient.useSession();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    image: "",
    phone: "",
    degrees: "",
    specialties: "",
    bio: "",
    experience: "",
    consultationFee: 0,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_URL}/api/doctor/profile`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error(`Server status: ${res.status}`);

        const data = await res.json();

        if (data.success && data.profile) {
          setFormData({
            image: data.profile.image || session?.user?.image || "",
            phone: data.profile.phone || "",
            degrees: data.profile.degrees || "",
            specialties: Array.isArray(data.profile.specialties)
              ? data.profile.specialties.join(", ")
              : data.profile.specialties || "",
            bio: data.profile.bio || "",
            experience: data.profile.experience || "",
            consultationFee: data.profile.consultationFee || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load doctor profile:", err);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  // Handle Image Selection and Direct Upload / Preview (Fixed Blob ERR_FILE_NOT_FOUND)
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Safe Instant Preview using FileReader (prevents blob link expiry issues)
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);

    // 2. Upload file to Backend API
    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      setUploadingImage(true);
      setMessage({ type: "", text: "" });

      const res = await fetch(`${API_URL}/api/doctor/upload-avatar`, {
        method: "POST",
        credentials: "include",
        body: imageFormData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Set actual permanent image URL returned from server
        setFormData((prev) => ({
          ...prev,
          image: data.imageUrl || data.url,
        }));
        setMessage({
          type: "success",
          text: "Profile picture uploaded successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to upload image.",
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setMessage({
        type: "error",
        text: "Server error occurred during image upload.",
      });
    } finally {
      setUploadingImage(false);
      // Clear input so selecting the same file again triggers onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        ...formData,
        specialties: formData.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        consultationFee: Number(formData.consultationFee) || 0,
      };

      const res = await fetch(`${API_URL}/api/doctor/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Profile credentials updated successfully! Pending admin approval.",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update profile.",
        });
      }
    } catch (err) {
      console.error("Submit profile error:", err);
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center font-medium text-slate-500">
        Loading profile details...
      </div>
    );
  }

  const status = session?.user?.verificationStatus || "pending";
  const isVerified = status === "verified";

  return (
    <div className="mx-auto my-6 max-w-4xl rounded-xl border border-slate-100 bg-white p-6 shadow-md">
      <div
        className={`mb-6 flex items-center justify-between rounded-lg p-4 text-sm font-semibold ${
          isVerified
            ? "border border-green-200 bg-green-50 text-green-700"
            : status === "suspended"
            ? "border border-red-200 bg-red-50 text-red-700"
            : "border border-amber-200 bg-amber-50 text-amber-700"
        }`}
      >
        <span>
          Account Verification Status: <strong className="uppercase">{status}</strong>
        </span>
        {!isVerified && (
          <span className="text-xs font-normal">
            Update profile information to resubmit for Admin verification.
          </span>
        )}
      </div>

      <h1 className="mb-6 text-2xl font-bold text-slate-800">Doctor Profile Credentials</h1>

      {message.text && (
        <div
          className={`mb-6 rounded-lg p-4 text-sm ${
            message.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Image File Upload Section */}
      <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-center gap-6 pb-6 border-b border-slate-100">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        <div className="relative group w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-100 shadow-md">
          {formData.image ? (
            <img
              src={formData.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
              <User className="w-10 h-10" />
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200"
          >
            {uploadingImage ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-semibold">Upload</span>
              </>
            )}
          </button>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-800">Profile Photo</h3>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            PNG, JPG or WEBP formats. Direct upload supported.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition disabled:opacity-50"
          >
            {uploadingImage ? "Uploading..." : "Change Picture"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              value={session?.user?.name || ""}
              disabled
              className="w-full cursor-not-allowed rounded-md border border-slate-300 bg-slate-100 p-2.5 text-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={session?.user?.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-md border border-slate-300 bg-slate-100 p-2.5 text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+880 1700-000000"
              className="w-full rounded-md border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Degrees</label>
            <input
              type="text"
              name="degrees"
              value={formData.degrees}
              onChange={handleChange}
              placeholder="MBBS, FCPS (Medicine)"
              className="w-full rounded-md border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Specialties (comma separated)
            </label>
            <input
              type="text"
              name="specialties"
              value={formData.specialties}
              onChange={handleChange}
              placeholder="Cardiology, General Medicine"
              className="w-full rounded-md border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Experience (Years)</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 5 Years"
              className="w-full rounded-md border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Consultation Fee (BDT)</label>
          <input
            type="number"
            name="consultationFee"
            value={formData.consultationFee}
            onChange={handleChange}
            placeholder="500"
            className="w-full rounded-md border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Short Biography</label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write a brief description about your expertise..."
            className="w-full rounded-md border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving Profile..." : "Save Profile Credentials"}
        </button>
      </form>
    </div>
  );
}