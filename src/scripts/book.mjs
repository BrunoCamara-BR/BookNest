export function createBook(book) {
  return {
    id: book.id || "",
    title: book.title || "Title not available",
    authors: book.authors?.length ? book.authors : ["Author not available"],
    publishedDate: book.publishedDate || "Date not available",
    cover: book.cover || "",
    source: book.source || "Unknown"
  };
}
