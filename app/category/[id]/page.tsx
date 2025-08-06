import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  year: string;
  creator: string;
  thumbnail: string;
}

async function fetchCategoryMovies(categoryId: string, page: number): Promise<Movie[]> {
  try {
    const banned = ["sex", "porn", "hentai", "xxx", "nude"];
    const res = await fetch(
      `https://archive.org/advancedsearch.php?q=collection:${categoryId}+AND+mediatype:movies&fl[]=identifier,title,creator,year&sort[]=downloads+desc&rows=12&page=${page}&output=json`,
      { cache: "no-store" }
    );
    const data: any = await res.json();

    const movies = data.response.docs
      .filter((d: any) => !banned.some((w) => d.title?.toLowerCase().includes(w)))
      .map((d: any) => ({
        id: d.identifier,
        title: d.title,
        year: d.year || "",
        creator: d.creator || "Unknown",
        thumbnail: `https://archive.org/download/${d.identifier}/__ia_thumb.jpg`,
      }));

    return movies;
  } catch (err) {
    console.error(err);
    return [];
  }
}

interface CategoryPageProps {
  params: { id: string };
  searchParams?: { page?: string };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { id } = params; // ✅ No need to await
  const page = Number(searchParams?.page) || 1;

  const movies = await fetchCategoryMovies(id, page);

  return (
    <div className="min-h-screen bg-[#1f1c17] text-white px-6 py-8">
      {/* Category Title */}
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {id.replace(/_/g, " ")}
      </h1>

      {/* Movie Grid */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((m) => (
            <Link key={m.id} href={`/watch/${m.id}`}>
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform">
                <img
                  src={m.thumbnail}
                  alt={m.title}
                  className="w-full h-48 object-cover bg-gray-800"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold line-clamp-2">
                    {m.title} {m.year && `(${m.year})`}
                  </p>
                  <p className="text-xs opacity-70">{m.creator}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No movies found in this category.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-8">
        {page > 1 && (
          <Link
            href={`/category/${id}?page=${page - 1}`}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            ← Prev
          </Link>
        )}
        {movies.length >= 12 && (
          <Link
            href={`/category/${id}?page=${page + 1}`}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
