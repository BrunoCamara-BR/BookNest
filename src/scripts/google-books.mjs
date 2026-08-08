import { createBook } from "./book.mjs";

function getQuery(search, type) {
  if (type === "title") return `intitle:${search}`;
  if (type === "author") return `inauthor:${search}`;
  if (type === "isbn") return `isbn:${search}`;
  if (type === "subject") return `subject:${search}`;
  return search;
}

export async function getGoogleBooks(search, type) {
  const query = getQuery(search, type);
  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`;

  if (apiKey) url += `&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) throw new Error("Google Books request failed");

  const data = await response.json();

  return (data.items || []).map((item) => {
    const info = item.volumeInfo || {};

    return createBook({
      id: item.id,
      title: info.title,
      authors: info.authors,
      publishedDate: info.publishedDate,
      description: info.description,
      publisher: info.publisher,
      pageCount: info.pageCount,
      language: info.language,
      categories: info.categories,
      cover: info.imageLinks?.thumbnail,
      previewLink: info.previewLink,
      source: "Google Books"
    });
  });
}
