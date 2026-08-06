import { getGoogleBooks } from "./google-books.mjs";
import { getOpenLibraryBooks } from "./open-library.mjs";
import { startMenu } from "./menu.mjs";
import { createFooter } from "./footer.mjs";

const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const type = document.querySelector("#search-type");
const googleStatus = document.querySelector("#google-status");
const openLibraryStatus = document.querySelector("#open-library-status");
const message = document.querySelector("#message");
const results = document.querySelector("#book-results");

startMenu();
createFooter();

function displayBooks(books) {
  results.innerHTML = "";

  if (books.length === 0) {
    message.textContent = "No books were found.";
    return;
  }

  books.forEach((book) => {
    const card = document.createElement("article");
    const image = document.createElement("img");
    const content = document.createElement("div");
    const title = document.createElement("h3");
    const author = document.createElement("p");
    const date = document.createElement("p");
    const source = document.createElement("p");

    card.classList.add("book-card");
    image.src = book.cover || "/images/book-icon.svg";
    image.alt = book.cover ? `Cover of ${book.title}` : "Book cover not available";
    image.width = 100;
    image.height = 140;
    image.loading = "lazy";
    title.textContent = book.title;
    author.textContent = `Author: ${book.authors.join(", ")}`;
    date.textContent = `Published: ${book.publishedDate}`;
    source.textContent = `Source: ${book.source}`;

    content.append(title, author, date, source);
    card.append(image, content);
    results.appendChild(card);
  });

  message.textContent = `${books.length} books found.`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const search = input.value.trim();

  if (!search) return;

  message.textContent = "Loading books...";
  googleStatus.textContent = "Loading...";
  openLibraryStatus.textContent = "Loading...";
  results.innerHTML = "";

  const books = [];

  try {
    const googleBooks = await getGoogleBooks(search, type.value);
    googleStatus.textContent = `${googleBooks.length} found`;
    books.push(...googleBooks);
  } catch (error) {
    googleStatus.textContent = "Error";
    console.error(error);
  }

  try {
    const openLibraryBooks = await getOpenLibraryBooks(search, type.value);
    openLibraryStatus.textContent = `${openLibraryBooks.length} found`;
    books.push(...openLibraryBooks);
  } catch (error) {
    openLibraryStatus.textContent = "Error";
    console.error(error);
  }

  displayBooks(books);
});
