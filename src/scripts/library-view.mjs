export function displayLibrary(books) {
  const results = document.querySelector("#library-results");
  const template = document.querySelector("#library-card-template");

  results.innerHTML = "";

  books.forEach(function (book, index) {
    const card = template.content.cloneNode(true);
    const image = card.querySelector(".library-cover");

    image.src = book.cover || "/images/book-icon.svg";
    image.alt = `Cover of ${book.title}`;
    image.addEventListener("error", function () {
      image.src = "/images/book-icon.svg";
    });

    card.querySelector(".library-title").textContent = book.title;
    card.querySelector(".library-author").textContent = `Author: ${book.authors.join(", ")}`;
    card.querySelector(".library-source").textContent = `Source: ${book.source}`;
    card.querySelector(".library-status").value = book.status || "Want to Read";
    card.querySelector(".library-favorite").checked = book.favorite === true;
    card.querySelector(".library-note").value = book.note || "";

    card.querySelector(".library-save-button").dataset.index = index;
    card.querySelector(".remove-button").dataset.index = index;

    results.appendChild(card);
  });
}
