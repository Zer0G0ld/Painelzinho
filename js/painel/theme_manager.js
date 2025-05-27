// theme_manage.js

const themeManager = (() => {
  const head = document.head;
  const themes = ["acri", "dark", "rachni", "light", "NatureZen"];
  let currentTheme = localStorage.getItem("theme") || "dark";

  // Cria o elemento link para o CSS do tema e adiciona ao <head>
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = getThemeHref(currentTheme);
  head.appendChild(link);

  // Retorna o caminho do CSS do tema
  function getThemeHref(theme) {
    return `../css/themes/${theme}/theme.css`;
  }

  // Altera o tema, atualizando o href do link e salvando no localStorage
  function changeTheme(newTheme) {
    if (!themes.includes(newTheme)) {
      console.warn(`Tema "${newTheme}" não encontrado. Nenhuma alteração feita.`);
      return;
    }
    if (newTheme === currentTheme) return; // Sem alteração

    link.href = getThemeHref(newTheme);
    currentTheme = newTheme;
    localStorage.setItem("theme", newTheme);
  }

  // Inicializa o select de temas (caso exista)
  function initThemeSelect(selector = "#alt-main-config-content #theme") {
    const select = document.querySelector(selector);
    if (!select) return;

    // Limpa opções atuais
    select.innerHTML = "";

    // Popula as opções com os temas disponíveis
    themes.forEach((theme) => {
      const option = document.createElement("option");
      option.value = theme;
      option.textContent = theme;
      if (theme === currentTheme) option.selected = true;
      select.appendChild(option);
    });

    // Atualiza o tema ao alterar a seleção
    select.addEventListener("change", (e) => {
      changeTheme(e.target.value);
    });
  }

  return {
    changeTheme,
    initThemeSelect,
    get currentTheme() {
      return currentTheme;
    },
    get availableThemes() {
      return [...themes];
    },
  };
})();

// Inicializa o seletor de tema, se existir na página
themeManager.initThemeSelect();

export default themeManager;
