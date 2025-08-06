import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
}

export default function CategoryRow({ title, movies }: { title: string; movies: Movie[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {movies.map((m) => (
          <Link key={m.id} href={`/watch/${m.id}`}>
            <div className="flex-shrink-0 w-40">
              <img
                src={m.thumbnail}
                alt={m.title}
                className="w-full h-60 object-cover rounded-lg"
              />
              <p className="mt-2 text-sm font-medium">{m.title}</p>
              <p className="text-xs text-gray-400">{m.creator}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
