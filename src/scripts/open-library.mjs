import { createBook } from "./book.mjs";

function getQuery(search, type) {
  if (type === "title") return `title=${encodeURIComponent(search)}`;
  if (type === "author") return `author=${encodeURIComponent(search)}`;
  if (type === "isbn") return `q=isbn:${encodeURIComponent(search)}`;
  if (type === "subject") return `q=subject:${encodeURIComponent(search)}`;
  return `q=${encodeURIComponent(search)}`;
}

export async function getOpenLibraryBooks(search, type) {
  const query = getQuery(search, type);
  const fields = "key,title,author_name,first_publish_year,cover_i";
  const url = `https://openlibrary.org/search.json?${query}&limit=5&fields=${fields}`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Open Library request failed");

  const data = await response.json();

  return data.docs.map((item) => {
    const cover = item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : "";

    return createBook({
      id: item.key,
      title: item.title,
      authors: item.author_name,
      publishedDate: item.first_publish_year,
      cover,
      source: "Open Library"
    });
  });
}
