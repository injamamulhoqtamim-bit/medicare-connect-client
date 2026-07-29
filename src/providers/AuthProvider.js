'use client';
import AuthProviderContext from '@/context/AuthContext'; // আপনার AuthContext প্রোভাইডার

export default function AuthProvider({ children }) {
  return (
    <AuthProviderContext>
      {children}
    </AuthProviderContext>
  );
}