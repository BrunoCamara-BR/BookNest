import { getGoogleBooks } from "./google-books.mjs";
import { getOpenLibraryBooks } from "./open-library.mjs";
import { displayBooks, displayDetails } from "./search-view.mjs";
import { displayLibrary } from "./library-view.mjs";
import { getLibrary, removeBook, saveBook, updateBook } from "./storage.mjs";
import { startMenu } from "./menu.mjs";
import { createFooter } from "./footer.mjs";

const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const searchType = document.querySelector("#search-type");
const googleStatus = document.querySelector("#google-status");
const openLibraryStatus = document.querySelector("#open-library-status");
const message = document.querySelector("#message");
const results = document.querySelector("#book-results");
const detailsSection = document.querySelector("#details-section");
const closeDetails = document.querySelector("#close-details");
const resultOptions = document.querySelector("#result-options");
const sourceFilter = document.querySelector("#source-filter");
const languageFilter = document.querySelector("#language-filter");
const sortBooks = document.querySelector("#sort-books");
const libraryResults = document.querySelector("#library-results");
const libraryMessage = document.querySelector("#library-message");
const libraryStatusFilter = document.querySelector("#library-status-filter");

let currentBooks = [];
let currentLibraryBooks = [];

startMenu();
createFooter();
showLibrary();

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const search = input.value.trim();

  message.textContent = "Loading books...";
  googleStatus.textContent = "Loading...";
  openLibraryStatus.textContent = "Loading...";
  results.innerHTML = "";
  detailsSection.classList.add("hide");
  resultOptions.classList.add("hide");

  let googleBooks = [];
  let openLibraryBooks = [];
  let hadError = false;

  try {
    googleBooks = await getGoogleBooks(search, searchType.value);
    googleStatus.textContent = `${googleBooks.length} found`;
  } catch (error) {
    googleStatus.textContent = "Error";
    hadError = true;
    console.error(error);
  }

  try {
    openLibraryBooks = await getOpenLibraryBooks(search, searchType.value);
    openLibraryStatus.textContent = `${openLibraryBooks.length} found`;
  } catch (error) {
    openLibraryStatus.textContent = "Error";
    hadError = true;
    console.error(error);
  }

  currentBooks = googleBooks.concat(openLibraryBooks);

  if (currentBooks.length === 0) {
    message.textContent = hadError ? "There was a problem loading the books." : "No books were found.";
    return;
  }

  createLanguageOptions();
  resultOptions.classList.remove("hide");
  applySearchOptions();

  if (hadError) {
    message.textContent = `${currentBooks.length} books found. One source had a problem.`;
  } else {
    message.textContent = `${currentBooks.length} books found.`;
  }
});

sourceFilter.addEventListener("change", applySearchOptions);
languageFilter.addEventListener("change", applySearchOptions);
sortBooks.addEventListener("change", applySearchOptions);

results.addEventListener("click", function (event) {
  const index = Number(event.target.dataset.index);
  const visibleBooks = getVisibleBooks();
  const book = visibleBooks[index];

  if (!book) return;

  if (event.target.classList.contains("details-button")) {
    displayDetails(book);
    detailsSection.classList.remove("hide");
    document.querySelector("#details-heading").focus();
  }

  if (event.target.classList.contains("save-button")) {
    const card = event.target.closest(".book-card");
    const status = card.querySelector(".reading-status").value;

    saveBook(book, status);
    message.textContent = `${book.title} saved as ${status}.`;
    showLibrary();
  }
});

closeDetails.addEventListener("click", function () {
  detailsSection.classList.add("hide");
});

libraryStatusFilter.addEventListener("change", showLibrary);

libraryResults.addEventListener("click", function (event) {
  const index = Number(event.target.dataset.index);
  const book = currentLibraryBooks[index];

  if (!book) return;

  if (event.target.classList.contains("library-save-button")) {
    const card = event.target.closest(".library-card");
    const status = card.querySelector(".library-status").value;
    const favorite = card.querySelector(".library-favorite").checked;
    const note = card.querySelector(".library-note").value.trim();

    updateBook(book, status, favorite, note);
    libraryMessage.textContent = `Changes saved for ${book.title}.`;
    showLibrary(false);
    if (currentBooks.length > 0) applySearchOptions();
  }

  if (event.target.classList.contains("remove-button")) {
    removeBook(book);
    libraryMessage.textContent = `${book.title} removed from your library.`;
    showLibrary(false);
    if (currentBooks.length > 0) applySearchOptions();
  }
});

function getVisibleBooks() {
  let books = currentBooks.slice();

  if (sourceFilter.value !== "all") {
    books = books.filter(function (book) {
      return book.source === sourceFilter.value;
    });
  }

  if (languageFilter.value !== "all") {
    books = books.filter(function (book) {
      return book.language === languageFilter.value;
    });
  }

  if (sortBooks.value === "title") {
    books.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  }

  if (sortBooks.value === "author") {
    books.sort(function (a, b) {
      return a.authors[0].localeCompare(b.authors[0]);
    });
  }

  if (sortBooks.value === "year") {
    books.sort(function (a, b) {
      const yearA = parseInt(a.publishedDate) || 9999;
      const yearB = parseInt(b.publishedDate) || 9999;
      return yearA - yearB;
    });
  }

  return books;
}

function applySearchOptions() {
  const books = getVisibleBooks();
  displayBooks(books);

  if (books.length === 0) {
    message.textContent = "No books match these filters.";
  } else {
    message.textContent = `${books.length} books shown.`;
  }
}

function createLanguageOptions() {
  languageFilter.innerHTML = '<option value="all">All languages</option>';

  const languages = [];

  currentBooks.forEach(function (book) {
    if (book.language !== "Not available" && !languages.includes(book.language)) {
      languages.push(book.language);
    }
  });

  languages.sort();

  languages.forEach(function (language) {
    const option = document.createElement("option");
    option.value = language;
    option.textContent = language;
    languageFilter.appendChild(option);
  });
}
function showLibrary(clearMessage = true) {
  const library = getLibrary();

  if (clearMessage) {
    libraryMessage.textContent = "";
  }

  if (libraryStatusFilter.value === "all") {
    currentLibraryBooks = library;
  } else {
    currentLibraryBooks = library.filter(function (book) {
      return book.status === libraryStatusFilter.value;
    });
  }

  displayLibrary(currentLibraryBooks);

  if (library.length === 0) {
    libraryMessage.textContent = "Your library is empty. Save a book from the search results.";
    return;
  }

  if (currentLibraryBooks.length === 0) {
    libraryMessage.textContent = "No saved books match this status.";
  }
}
