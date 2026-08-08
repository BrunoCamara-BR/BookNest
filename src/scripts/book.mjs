export function createBook(book) {
  return {
    id: book.id || "",
    title: book.title || "Title not available",
    authors: book.authors?.length ? book.authors : ["Author not available"],
    publishedDate: book.publishedDate || "Date not available",
    description: book.description || "Description not available",
    publisher: book.publisher || "Publisher not available",
    pageCount: book.pageCount || "Not available",
    language: book.language || "Not available",
    categories: book.categories?.length ? book.categories : [],
    cover: book.cover || "",
    previewLink: book.previewLink || "",
    source: book.source || "Unknown"
  };
}
