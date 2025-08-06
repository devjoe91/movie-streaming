// utils/api.ts
import { Movie } from "@/types";

// Base API endpoint
const BASE_URL = "https://archive.org/advancedsearch.php";

// In-memory cache to avoid refetching too often
const cache: Record<string, any> = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// NSFW keyword blacklist
const NSFW_KEYWORDS = [
  "sex", "porn", "xxx", "hentai", "nude", "adult", "erotic", "nsfw", "fetish"
];

// Helper to check if movie title is safe
function isSafe(title: string): boolean {
  const lower = title.toLowerCase();
  return !NSFW_KEYWORDS.some(keyword => lower.includes(keyword));
}

// Generic cached fetch
async function cachedFetch<T>(key: string, url: string): Promise<T> {
  const now = Date.now();
  if (cache[key] && now - cache[key].timestamp < CACHE_TTL) {
    return cache[key].data;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const data = await res.json();
  cache[key] = { data, timestamp: now };
  return data;
}

// Fetch categories (collections)
export async function getCategories(): Promise<{ id: string; title: string }[]> {
  const url = `${BASE_URL}?q=collection:(movies)&fl[]=identifier,title&sort[]=downloads+desc&rows=50&page=1&output=json`;
  const data = await cachedFetch<any>("categories", url);

  return data.response.docs
    .filter((doc: any) => doc.identifier && doc.title && isSafe(doc.title))
    .map((doc: any) => ({
      id: doc.identifier,
      title: doc.title
    }));
}

// Fetch movies for a category
export async function getMoviesByCategory(categoryId: string, page = 1, rows = 20): Promise<Movie[]> {
  const url = `${BASE_URL}?q=collection:${categoryId}+AND+mediatype:movies&fl[]=identifier,title,creator&sort[]=downloads+desc&rows=${rows}&page=${page}&output=json`;
  const data = await cachedFetch<any>(`cat-${categoryId}-p${page}`, url);

  return data.response.docs
    .filter((doc: any) => isSafe(doc.title))
    .map((doc: any) => ({
      id: doc.identifier,
      title: doc.title,
      creator: doc.creator || "Unknown",
      playableUrl: `https://archive.org/embed/${doc.identifier}`
    }));
}

// Fetch latest movies
export async function getLatestMovies(page = 1, rows = 20): Promise<Movie[]> {
  const url = `${BASE_URL}?q=collection:(feature_films)+AND+mediatype:movies&fl[]=identifier,title,creator&sort[]=downloads+desc&rows=${rows}&page=${page}&output=json`;
  const data = await cachedFetch<any>(`latest-p${page}`, url);

  return data.response.docs
    .filter((doc: any) => isSafe(doc.title))
    .map((doc: any) => ({
      id: doc.identifier,
      title: doc.title,
      creator: doc.creator || "Unknown",
      playableUrl: `https://archive.org/embed/${doc.identifier}`
    }));
}

// Search movies
export async function searchMovies(query: string, rows = 10): Promise<Movie[]> {
  if (!query) return [];
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}+AND+mediatype:movies&fl[]=identifier,title,creator&sort[]=downloads+desc&rows=${rows}&page=1&output=json`;
  const data = await cachedFetch<any>(`search-${query}`, url);

  return data.response.docs
    .filter((doc: any) => isSafe(doc.title))
    .map((doc: any) => ({
      id: doc.identifier,
      title: doc.title,
      creator: doc.creator || "Unknown",
      playableUrl: `https://archive.org/embed/${doc.identifier}`
    }));
}

// Fetch single movie details
export async function getMovieDetails(id: string): Promise<Movie | null> {
  const url = `${BASE_URL}?q=identifier:${id}&fl[]=identifier,title,creator,description&output=json`;
  const data = await cachedFetch<any>(`movie-${id}`, url);
  const doc = data.response.docs[0];
  if (!doc || !isSafe(doc.title)) return null;

  return {
    id: doc.identifier,
    title: doc.title,
    creator: doc.creator || "Unknown",
    description: doc.description || "No description available.",
    playableUrl: `https://archive.org/embed/${doc.identifier}`
  };
}
