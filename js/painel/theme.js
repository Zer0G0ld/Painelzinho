// Load the theme style
let theme = localStorage.getItem("theme") || "dark";

const head = document.head;
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = `../css/themes/${theme}/theme.css`;
head.appendChild(link);

function changeTheme(newTheme) {
  // Remove o link antigo
  const oldLink = document.querySelector(
    `link[href="../css/themes/${theme}/theme.css"]`
  );
  if (oldLink) {
    oldLink.remove();
  }

  // Cria e adiciona o novo link
  const newLink = document.createElement("link");
  newLink.rel = "stylesheet";
  newLink.href = `../css/themes/${newTheme}/theme.css`;
  head.appendChild(newLink);

  theme = newTheme;
  localStorage.setItem("theme", newTheme); // salvar a escolha do tema
}

// Theme options to settings
const themes = ["acri", "dark", "rachni"];
const select = document.querySelector("#alt-main-config-content #theme");

if (select) {
  // Limpa opções anteriores (se houver)
  select.innerHTML = "";

  themes.forEach((t) => {
    const option = document.createElement("option");
    option.value = t;
    option.textContent = t;
    if (t === theme) option.selected = true;
    select.appendChild(option);
  });
}

