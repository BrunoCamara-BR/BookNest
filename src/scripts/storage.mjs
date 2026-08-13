const storageKey = "booknest-library";

export function getLibrary() {
  const savedBooks = localStorage.getItem(storageKey);

  if (!savedBooks) {
    return [];
  }

  try {
    const library = JSON.parse(savedBooks);
    return Array.isArray(library) ? library : [];
  } catch (error) {
    console.error("Could not read saved books.", error);
    return [];
  }
}

export function saveBook(book, status) {
  const library = getLibrary();
  const savedBook = library.find(function (item) {
    return item.id === book.id && item.source === book.source;
  });

  if (savedBook) {
    savedBook.status = status;
  } else {
    library.push({
      id: book.id,
      title: book.title,
      authors: book.authors,
      cover: book.cover,
      source: book.source,
      status: status,
      favorite: false,
      note: ""
    });
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

export function updateBook(book, status, favorite, note) {
  const library = getLibrary();
  const savedBook = library.find(function (item) {
    return item.id === book.id && item.source === book.source;
  });

  if (savedBook) {
    savedBook.status = status;
    savedBook.favorite = favorite;
    savedBook.note = note;
  }

  localStorage.setItem(storageKey, JSON.stringify(library));
}

export function removeBook(book) {
  const library = getLibrary();
  const updatedLibrary = library.filter(function (item) {
    return !(item.id === book.id && item.source === book.source);
  });

  localStorage.setItem(storageKey, JSON.stringify(updatedLibrary));
}
