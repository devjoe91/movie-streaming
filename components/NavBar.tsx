"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import LoginModal from "@/components/LoginModal";

interface Category {
  id: string;
  title: string;
}

interface SearchResult {
  id: string;
  title: string;
  year: string;
  creator: string;
  thumbnail: string;
}

export default function NavBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [user, setUser] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // ✅ Safe category fetch
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");

        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }

        const text = await res.text();

        if (!text) {
          console.warn("No categories returned from /api/categories");
          setCategories([]);
          return;
        }

        const data: Category[] = JSON.parse(text);
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  // Fetch current user from Supabase
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Search handler
  useEffect(() => {
    if (search.trim().length > 1) {
      const delayDebounce = setTimeout(() => {
        fetch(`/api/search?q=${encodeURIComponent(search)}`)
          .then((res) => res.json())
          .then((data) => {
            setResults(data);
            setShowDropdown(true);
          })
          .catch((err) => {
            console.error("Search fetch error:", err);
            setResults([]);
          });
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [search]);

  // Hide/reappear on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Login handler
  const handleLogin = async (provider: "google" | "facebook") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 bg-black/80 backdrop-blur-md shadow-md ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Top Row: Logo + Search + Auth Buttons */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-yellow-400">
          🎬 MovieStream
        </Link>

        {/* Search */}
        <div className="relative" ref={searchRef}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => search.length > 1 && setShowDropdown(true)}
            className="px-3 py-1 rounded bg-gray-800 text-white focus:outline-none"
            placeholder="Search..."
          />
          {showDropdown && results.length > 0 && (
            <div className="absolute right-0 mt-1 w-72 bg-black border border-gray-700 rounded shadow-lg overflow-hidden z-50">
              {results.map((r) => (
                <Link
                  key={r.id}
                  href={`/watch/${r.id}`}
                  className="flex items-center gap-3 p-2 hover:bg-yellow-400/20 transition"
                  onClick={() => setShowDropdown(false)}
                >
                  <img
                    src={r.thumbnail}
                    alt={r.title}
                    loading="lazy"
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {r.title} {r.year && `(${r.year})`}
                    </p>
                    {r.creator && (
                      <p className="text-gray-400 text-xs">{r.creator}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-2">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => handleLogin("google")}
                className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm"
              >
                Login with Google
              </button>
              <button
                onClick={() => handleLogin("facebook")}
                className="px-3 py-1 rounded bg-blue-800 hover:bg-blue-900 text-white text-sm"
              >
                Login with Facebook
              </button>
            </>
          )}
        </div>
      </div>

      {/* Categories Row */}
      <div className="flex overflow-x-auto space-x-4 px-4 py-2 bg-gradient-to-r from-black to-gray-900 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            className="whitespace-nowrap text-white hover:text-yellow-400 transition"
          >
            {cat.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
