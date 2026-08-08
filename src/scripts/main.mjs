import { getGoogleBooks } from "./google-books.mjs";
import { getOpenLibraryBooks } from "./open-library.mjs";
import { displayBooks, displayDetails } from "./search-view.mjs";
import { saveBook } from "./storage.mjs";
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

let currentBooks = [];

startMenu();
createFooter();

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const search = input.value.trim();

  if (search.length < 2) {
    message.textContent = "Enter at least 2 characters.";
    return;
  }

  message.textContent = "Loading books...";
  googleStatus.textContent = "Loading...";
  openLibraryStatus.textContent = "Loading...";
  results.innerHTML = "";
  detailsSection.classList.add("hide");

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
    if (hadError) {
      message.textContent = "There was a problem loading the books.";
    } else {
      message.textContent = "No books were found.";
    }
    return;
  }

  displayBooks(currentBooks);
  message.textContent = `${currentBooks.length} books found.`;
});

results.addEventListener("click", function (event) {
  const index = Number(event.target.dataset.index);
  const book = currentBooks[index];

  if (!book) return;

  if (event.target.classList.contains("details-button")) {
    displayDetails(book);
    detailsSection.classList.remove("hide");
  }

  if (event.target.classList.contains("save-button")) {
    const card = event.target.closest(".book-card");
    const status = card.querySelector(".reading-status").value;

    saveBook(book, status);
    message.textContent = `${book.title} saved as ${status}.`;
  }
});

closeDetails.addEventListener("click", function () {
  detailsSection.classList.add("hide");
});
