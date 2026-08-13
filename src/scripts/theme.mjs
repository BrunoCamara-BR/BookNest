const themeKey = "booknest-theme";

export function startTheme() {
  const button = document.querySelector("#theme-button");
  const savedTheme = localStorage.getItem(themeKey);

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    button.textContent = "Light mode";
  }

  button.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
      button.textContent = "Light mode";
      localStorage.setItem(themeKey, "dark");
    } else {
      button.textContent = "Dark mode";
      localStorage.setItem(themeKey, "light");
    }
  });
}
