// Carrega o tema salvo no localStorage ou usa 'dark' como padrão
let theme = localStorage.getItem("theme") || "dark";

// Insere a folha de estilo do tema no head
const themeLinkId = "theme-css-link";

function loadThemeLink(themeName) {
  let existingLink = document.getElementById(themeLinkId);
  if (existingLink) {
    existingLink.href = `../common/css/themes/${themeName}/theme.css`;
  } else {
    const link = document.createElement("link");
    link.id = themeLinkId;
    link.rel = "stylesheet";
    link.href = `../common/css/themes/${themeName}/theme.css`;
    document.head.appendChild(link);
  }
}

function changeTheme(newTheme) {
  if (newTheme === theme) return;
  loadThemeLink(newTheme);
  theme = newTheme;
  localStorage.setItem("theme", newTheme);
}

function initThemeSelector() {
  loadThemeLink(theme);

  const themes = ["acri", "dark", "rachni", "zer0"];
  const $themeSelect = $("#alt-main-config-content #theme");

  themes.forEach((themeName) => {
    const $option = $("<option></option>").val(themeName).text(themeName);
    if (themeName === theme) {
      $option.prop("selected", true);
    }
    $themeSelect.append($option);
  });

  $themeSelect.on("change", function () {
    changeTheme($(this).val());
  });
}

export { initThemeSelector, changeTheme };
