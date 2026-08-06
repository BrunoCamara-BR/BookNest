export function startMenu() {
  const button = document.querySelector("#menu-button");
  const navigation = document.querySelector("#navigation");

  button.addEventListener("click", () => {
    button.classList.toggle("show");
    navigation.classList.toggle("show");
  });
}
