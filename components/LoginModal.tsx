"use client";
import { supabase } from "@/lib/supabaseClient";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  const handleLogin = async (provider: "google" | "facebook") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Sign In</h2>

        <button
          onClick={() => handleLogin("google")}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded mb-3"
        >
          Continue with Google
        </button>

        <button
          onClick={() => handleLogin("facebook")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Continue with Facebook
        </button>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
