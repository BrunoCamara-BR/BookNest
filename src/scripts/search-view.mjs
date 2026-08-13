import { getBookStatus } from "./storage.mjs";

export function displayBooks(books) {
  const results = document.querySelector("#book-results");
  const template = document.querySelector("#book-card-template");

  results.innerHTML = "";

  books.forEach(function (book, index) {
    const card = template.content.cloneNode(true);
    const image = card.querySelector(".book-cover");
    const status = card.querySelector(".reading-status");

    image.src = book.cover || "/images/book-icon.svg";
    image.alt = `Cover of ${book.title}`;
    image.addEventListener("error", function () {
      image.src = "/images/book-icon.svg";
    });

    card.querySelector(".book-title").textContent = book.title;
    card.querySelector(".book-author").textContent = `Author: ${book.authors.join(", ")}`;
    card.querySelector(".book-date").textContent = `Published: ${book.publishedDate}`;
    card.querySelector(".book-source").textContent = `Source: ${book.source}`;

    status.value = getBookStatus(book);
    card.querySelector(".details-button").dataset.index = index;
    card.querySelector(".save-button").dataset.index = index;

    results.appendChild(card);
  });
}

export function displayDetails(book) {
  const cover = document.querySelector("#details-cover");
  const link = document.querySelector("#details-link");

  cover.src = book.cover || "/images/book-icon.svg";
  cover.alt = `Cover of ${book.title}`;
  cover.addEventListener("error", function () {
    cover.src = "/images/book-icon.svg";
  });

  document.querySelector("#details-title").textContent = book.title;
  document.querySelector("#details-author").textContent = `Author: ${book.authors.join(", ")}`;
  document.querySelector("#details-publisher").textContent = `Publisher: ${book.publisher}`;
  document.querySelector("#details-date").textContent = `Published: ${book.publishedDate}`;
  document.querySelector("#details-pages").textContent = `Pages: ${book.pageCount}`;
  document.querySelector("#details-language").textContent = `Language: ${book.language}`;
  document.querySelector("#details-categories").textContent =
    `Categories: ${book.categories.join(", ") || "Not available"}`;
  document.querySelector("#details-description").textContent = book.description;

  if (book.previewLink) {
    link.href = book.previewLink;
    link.classList.remove("hide");
  } else {
    link.removeAttribute("href");
    link.classList.add("hide");
  }
}
