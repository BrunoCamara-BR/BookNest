export function createFooter() {
  const footer = document.querySelector("footer");
  const paragraph = document.createElement("p");
  const today = new Date();

  paragraph.innerHTML = `© ${today.toLocaleDateString("en-US")} | Bruno Câmara dos Santos | Minas Gerais, Brazil | Updated: <strong>${document.lastModified}</strong>`;
  footer.appendChild(paragraph);
}
