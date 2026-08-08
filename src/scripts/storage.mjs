const storageKey = "booknest-library";

export function getLibrary() {
  const savedBooks = localStorage.getItem(storageKey);

  if (savedBooks) {
    return JSON.parse(savedBooks);
  }

  return [];
}

export function saveBook(book, status) {
  const library = getLibrary();
  const savedBook = library.find(function (item) {
    return item.id === book.id && item.source === book.source;
  });

  if (savedBook) {
    savedBook.status = status;
  } else {
    library.push({ ...book, status: status });
  }

  localStorage.setItem(storageKey, JSON.stringify(library));
}

export function getBookStatus(book) {
  const library = getLibrary();
  const savedBook = library.find(function (item) {
    return item.id === book.id && item.source === book.source;
  });

  if (savedBook) {
    return savedBook.status;
  }

  return "Want to Read";
}
