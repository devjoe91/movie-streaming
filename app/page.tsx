import Link from "next/link";

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3000';

interface Movie {
  id: string;
  title: string;
  year: string;
  creator: string;
  thumbnail: string;
}

interface Category {
  id: string;
  title: string;
}

const CATEGORIES: Category[] = [
  { id: "feature_films", title: "Feature Films" },
  { id: "SciFi_Horror", title: "Sci‑Fi & Horror" },
  { id: "Comedy_Films", title: "Comedy Films" },
  { id: "short_films", title: "Short Films" },
  { id: "animationandcartoons", title: "Animation & Cartoons" },
  { id: "classic_tv", title: "Classic TV" },
];

async function fetchPopular(): Promise<Movie[]> {
  const res = await fetch(`${BASE_URL}/api/popular`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function fetchMovies(categoryId: string): Promise<Movie[]> {
  const res = await fetch(`${BASE_URL}/api/movies/${categoryId}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const popular = await fetchPopular();
  const featuredMovie = popular[0];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      {featuredMovie && (
        <section
          className="relative w-full h-[50vh] flex items-end"
          style={{
            backgroundImage: `url(${featuredMovie.thumbnail})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

          {/* Hero content */}
          <div className="relative z-10 p-8 text-white max-w-3xl">
            <h1 className="text-4xl font-bold mb-2">{featuredMovie.title}</h1>
            <p className="mb-4 text-sm opacity-80">
              {featuredMovie.creator || "Unknown"}
            </p>
            <Link href={`/watch/${featuredMovie.id}`}>
              <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition">
                ▶ Play
              </button>
            </Link>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="flex-1 bg-[#1f1c17] text-white px-6 py-8">
        {await Promise.all(
          CATEGORIES.map(async (cat) => {
            const movies = await fetchMovies(cat.id);
            if (!movies.length) return null;
            return (
              <div key={cat.id} className="mb-12">
                {/* Title + View All */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">{cat.title}</h2>
                  <Link
                    href={`/category/${cat.id}`}
                    className="text-yellow-400 hover:underline text-sm"
                  >
                    View All →
                  </Link>
                </div>

                {/* Movie Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {movies.slice(0, 12).map((m) => (
                    <Link key={m.id} href={`/watch/${m.id}`}>
                      <div className="group">
                        {/* Landscape Thumbnail */}
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                          <img
                            src={m.thumbnail}
                            alt={m.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110"
                          />
                        </div>

                        {/* Title */}
                        <p className="mt-2 text-sm font-medium line-clamp-2">
                          {m.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>


    </div>
  );
}
