import React, { useEffect, useState } from "react";
import Link from "next/link";

type Item = {
  id: string;
  title: string;
  thumbnail: string;
};

type Props = {
  categoryId: string;
  categoryTitle: string;
};

const CategoryRow: React.FC<Props> = ({ categoryId, categoryTitle }) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const query = encodeURIComponent(`collection:${categoryId} AND -mediatype:adult`);
        const res = await fetch(
          `https://archive.org/advancedsearch.php?q=${query}&fl=identifier,title&rows=15&output=json`
        );
        const data = await res.json();

        const safeItems = (data?.response?.docs || []).map((doc: any) => ({
          id: doc.identifier,
          title: doc.title,
          thumbnail: `https://archive.org/services/get-item-image.php?identifier=${doc.identifier}&type=thumbnail`,
        }));

        setItems(safeItems);
      } catch (err) {
        console.error(`Failed to fetch items for category ${categoryId}`, err);
      }
    }
    fetchItems();
  }, [categoryId]);

  if (items.length === 0) return null;

  return (
    <section className="my-8 max-w-7xl mx-auto px-4">
      <h2 className="text-yellow-400 font-bold text-2xl mb-4 select-none">{categoryTitle}</h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-black">
        {items.map((item) => (
          <Link key={item.id} href={`/watch/${item.id}`}>
            <a className="min-w-[150px] hover:scale-105 transform transition duration-300">
              <img
                src={item.thumbnail}
                alt={item.title}
                loading="lazy"
                className="rounded-md w-full object-cover"
              />
              <p className="mt-1 text-white text-sm truncate">{item.title}</p>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryRow;
