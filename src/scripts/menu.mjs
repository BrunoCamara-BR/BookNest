export function startMenu() {
  const button = document.querySelector("#menu-button");
  const navigation = document.querySelector("#navigation");
  const links = navigation.querySelectorAll("a");

  button.addEventListener("click", function () {
    button.classList.toggle("show");
    navigation.classList.toggle("show");

    const isOpen = navigation.classList.contains("show");
  });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      button.classList.remove("show");
      navigation.classList.remove("show");
    });
  });
}
