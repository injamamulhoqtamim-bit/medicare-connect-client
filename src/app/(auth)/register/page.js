"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  HeartPulse,
  UserCheck,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB.");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const uploadImageToImgBB = async (file) => {
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key missing in environment variables.");
    }
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: bodyFormData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.display_url || data.data.url;
    } else {
      throw new Error("Failed to upload image.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }

      const hasNumber = /\d/.test(formData.password);
      const hasSpecialCharacter = /[^A-Za-z0-9]/.test(formData.password);

      if (!hasNumber || !hasSpecialCharacter) {
        setError("Password must contain at least one number and one special character.");
        setLoading(false);
        return;
      }

      let imageUrl = "";

      if (selectedFile) {
        try {
          imageUrl = await uploadImageToImgBB(selectedFile);
        } catch (imgErr) {
          setError("Image upload failed. Please try again.");
          setLoading(false);
          return;
        }
      }

      // 🟢 FIX: Better-Auth এর জন্য role, requestedRole এবং body অবজেক্টে ডাটা পাস করা হয়েছে
      const { data, error: authError } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: imageUrl,
        role: formData.role,
        requestedRole: formData.role,
        body: {
          role: formData.role,
          requestedRole: formData.role,
        },
      });

      if (authError) {
        setError(authError.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // LocalStorage-এ ইউজার ডাটা সেভ রাখা
      const userPayload = {
        name: formData.name,
        email: formData.email,
        image: imageUrl,
        role: formData.role,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userPayload));
      }

      if (formData.role === "doctor") {
        setSuccess("Account created! Redirecting to setup...");
        setTimeout(() => {
          window.location.href = "/dashboard/profile";
        }, 1000);
      } else {
        setSuccess("Account created successfully!");
        setTimeout(() => {
          window.location.href = "/dashboard/patient";
        }, 1200);
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      setError("");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `/dashboard/role-selection`,
      });
    } catch (err) {
      setError("Google Sign-up failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <HeartPulse className="h-8 w-8 text-rose-500" />
            <span>MediCare<span className="text-teal-600">Connect</span></span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800 mt-4">Create an Account</h2>
        </div>

        {error && <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 font-medium">{error}</div>}
        {success && <div className="p-3 mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-600 font-medium">{success}</div>}

        {/* GOOGLE SIGN UP */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-700 flex items-center justify-center gap-3 transition-colors mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {googleLoading ? "Connecting..." : "Sign up with Google"}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or register with details</span></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* PHOTO UPLOAD */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden hover:border-teal-500 transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 block leading-tight">Upload Photo</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full pl-10 px-4 py-2 border rounded-lg bg-white text-slate-900 border-slate-300 focus:border-teal-600 focus:outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <input
                type="email"
                required
                placeholder="john@example.com"
                className="w-full pl-10 px-4 py-2 border rounded-lg bg-white text-slate-900 border-slate-300 focus:border-teal-600 focus:outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 border rounded-lg bg-white text-slate-900 border-slate-300 focus:border-teal-600 focus:outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Registering as</label>
            <div className="relative">
              <UserCheck className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
              <select
                className="w-full pl-10 px-4 py-2 border rounded-lg bg-white text-slate-900 border-slate-300 focus:border-teal-600 focus:outline-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-600 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}