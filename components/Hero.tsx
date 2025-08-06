import React, { useEffect, useState } from "react";
import Link from "next/link";

type FeaturedItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const HERO_FEATURE_ID = "feature_films"; // You can adjust this to the main featured collection id

const Hero: React.FC = () => {
  const [featured, setFeatured] = useState<FeaturedItem | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        // Example: fetch 1 featured movie from the "Feature Films" collection
        const res = await fetch(
          `https://archive.org/advancedsearch.php?q=collection:feature_films&fl=identifier,title,description,mediatype&rows=1&output=json`
        );
        const data = await res.json();

        if (data?.response?.docs?.length) {
          const doc = data.response.docs[0];
          setFeatured({
            id: doc.identifier,
            title: doc.title,
            description: doc.description || "Watch this amazing feature film.",
            image: `https://archive.org/services/get-item-image.php?identifier=${doc.identifier}&type=medres`,
          });
        }
      } catch (err) {
        console.error("Failed to fetch featured item", err);
      }
    }
    fetchFeatured();
  }, []);

  if (!featured) return null;

  return (
    <section className="relative h-[60vh] md:h-[75vh] w-full text-white select-none">
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-75"
        style={{ backgroundImage: `url(${featured.image})` }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col justify-center h-full">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {featured.title}
        </h1>
        <p className="max-w-3xl text-lg md:text-xl mb-8 drop-shadow-md line-clamp-3">
          {featured.description}
        </p>

        <Link href={`/watch/${featured.id}`}>
          <a className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded transition">
            Watch Now
          </a>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
