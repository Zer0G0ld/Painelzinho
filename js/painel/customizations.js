const fontlist_names = [
  "'Open Sans', sans-serif",
  "'Poppins', sans-serif",
  "'Raleway', sans-serif",
  "'Anonymous Pro', monospace",
  "'Patua One', cursive",
  "'Abril Fatface', cursive",
  "'Lora', serif",
  "'Cookie', cursive",
  "'Oleo Script', cursive",
  "'Kalam', cursive",
  "'Fredoka One', cursive",
];
const fontlist_urls = [];

const customFontsCount = Number(localStorage.getItem("customFonts")) || 0;

const customFontListUl = document.querySelector("#custom-font-list ul");

// Função utilitária para extrair nome curto da fonte, ex: "'Open Sans', sans-serif" -> "Open Sans"
function extractShortFontName(fontFullName) {
  const match = fontFullName.match(/'([^']+)'/);
  return match ? match[1] : fontFullName;
}

// Cria um <li> para a fonte customizada
function createFontListItem(fontName, fontUrl, index) {
  const li = document.createElement("li");

  const divFontName = document.createElement("div");
  divFontName.className = "font-name-added slot-storable";
  divFontName.id = `font-name-added-${index}`;
  divFontName.textContent = fontName;

  const divFontUrl = document.createElement("div");
  divFontUrl.className = "font-url-added slot-storable";
  divFontUrl.id = `font-url-added-${index}`;
  divFontUrl.textContent = fontUrl;

  const divDeleteFont = document.createElement("div");
  divDeleteFont.className = "delete-font";

  const divIconTrash = document.createElement("div");
  divIconTrash.className = "icon icon-trash";

  divDeleteFont.appendChild(divIconTrash);

  li.append(divFontName, divFontUrl, divDeleteFont);

  return li;
}

// Inicializa a lista com as fontes customizadas salvas no localStorage
function initCustomFonts() {
  if (!customFontListUl) return;

  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= customFontsCount; i++) {
    const fontName = localStorage.getItem(`font-name-added-${i}`) || "";
    const fontUrl = localStorage.getItem(`font-url-added-${i}`) || "";
    if (fontName && fontUrl) {
      fragment.appendChild(createFontListItem(fontName, fontUrl, i));
      fontlist_names.push(fontName);
      fontlist_urls.push(fontUrl);
    }
  }
  customFontListUl.appendChild(fragment);
}

// Atualiza as opções dos selects .font-storable com a lista atual de fontes
function updateFontSelectOptions() {
  const selects = document.querySelectorAll(".font-storable");
  if (!selects.length) return;

  // Limpa opções atuais
  selects.forEach((select) => (select.innerHTML = ""));

  fontlist_names.forEach((fontName) => {
    const shortName = extractShortFontName(fontName);
    selects.forEach((select) => {
      const option = document.createElement("option");
      option.value = fontName;
      option.textContent = shortName;
      select.appendChild(option);
    });
  });

  // Ajusta seleção baseada no localStorage ou usa padrão
  selects.forEach((select) => {
    const storedValue = localStorage.getItem(select.id);
    if (storedValue && fontlist_names.includes(storedValue)) {
      select.value = storedValue;
    } else {
      select.value = "'Open Sans', sans-serif"; // valor padrão
    }
  });
}

// Atualiza a lista e localStorage após mudanças
function saveCustomFontsToStorage() {
  localStorage.setItem("customFonts", fontlist_names.length);
  fontlist_names.forEach((fontName, i) => {
    localStorage.setItem(`font-name-added-${i + 1}`, fontName);
    localStorage.setItem(`font-url-added-${i + 1}`, fontlist_urls[i]);
  });

  // Remove entradas extras antigas do localStorage
  for (let i = fontlist_names.length + 1; i <= 20; i++) {
    localStorage.removeItem(`font-name-added-${i}`);
    localStorage.removeItem(`font-url-added-${i}`);
  }
}

// Adiciona nova fonte e atualiza UI + storage
function addNewFont(fontName, fontUrl) {
  fontlist_names.push(fontName);
  fontlist_urls.push(fontUrl);

  const index = fontlist_names.length;
  if (!customFontListUl) return;

  const li = createFontListItem(fontName, fontUrl, index);
  customFontListUl.appendChild(li);

  updateFontSelectOptions();
  saveCustomFontsToStorage();

  // Ajuste de altura do painel, se necessário
  const globalConfig = document.getElementById("global-configuration");
  const moreSettings = document.getElementById("more-settings");
  if (globalConfig && moreSettings) {
    const currentHeight = parseFloat(globalConfig.style.maxHeight) || 0;
    const newHeight = currentHeight + 28;
    globalConfig.style.maxHeight = newHeight + "px";
    moreSettings.style.maxHeight = newHeight + "px";
  }

  function_send_font?.();
}

// Remove fonte da lista e atualiza UI + storage
function removeFont(fontName, fontUrl) {
  const nameIndex = fontlist_names.indexOf(fontName);
  if (nameIndex === -1) return;

  fontlist_names.splice(nameIndex, 1);
  fontlist_urls.splice(nameIndex, 1);

  updateFontSelectOptions();
  saveCustomFontsToStorage();

  function_send_font?.();
}

// Inicializa a lista ao carregar a página
initCustomFonts();
updateFontSelectOptions();

// Evento para adicionar nova fonte
document.getElementById("add-new-font")?.addEventListener("click", () => {
  const inputName = document.getElementById("new-font-name");
  const inputUrl = document.getElementById("new-font-url");
  if (!inputName || !inputUrl) return;

  let fontNameToAdd = inputName.value.trim();
  let fontUrlToAdd = inputUrl.value.trim();

  if (!fontNameToAdd || !fontUrlToAdd) return;

  // Limpa inputs
  inputName.value = "";
  inputUrl.value = "";

  // Sanitiza entradas
  fontNameToAdd = fontNameToAdd.replace(/font-family:\s*/i, "").replace(/;/g, "");
  fontUrlToAdd = fontUrlToAdd.replace(/<style>\s*/i, "").replace(/\s*<\/style>/i, "");

  addNewFont(fontNameToAdd, fontUrlToAdd);
});

// Delegação para remover fonte ao clicar no ícone de lixeira
customFontListUl?.addEventListener("click", (event) => {
  if (!event.target.closest(".delete-font")) return;

  const li = event.target.closest("li");
  if (!li) return;

  const fontNameToRemove = li.querySelector(".font-name-added")?.textContent || "";
  const fontUrlToRemove = li.querySelector(".font-url-added")?.textContent || "";

  li.remove();

  removeFont(fontNameToRemove, fontUrlToRemove);

  // Re-ordenar ids e atualizar localStorage
  const listItems = customFontListUl.querySelectorAll("li");
  listItems.forEach((li, idx) => {
    const fontNameElem = li.querySelector(".font-name-added");
    const fontUrlElem = li.querySelector(".font-url-added");
    if (fontNameElem && fontUrlElem) {
      fontNameElem.id = `font-name-added-${idx + 1}`;
      fontUrlElem.id = `font-url-added-${idx + 1}`;
    }
  });

  saveCustomFontsToStorage();
});

// Atualiza localStorage ao editar texto direto na lista (caso tenha edição inline)
customFontListUl?.addEventListener("input", (event) => {
  // Se quiser permitir edição inline, pode implementar aqui.
  // Por enquanto, atualiza tudo para garantir sincronia.
  const listItems = customFontListUl.querySelectorAll("li");
  fontlist_names.length = 0;
  fontlist_urls.length = 0;

  listItems.forEach((li) => {
    const fontName = li.querySelector(".font-name-added")?.textContent.trim() || "";
    const fontUrl = li.querySelector(".font-url-added")?.textContent.trim() || "";
    if (fontName) fontlist_names.push(fontName);
    if (fontUrl) fontlist_urls.push(fontUrl);
  });

  saveCustomFontsToStorage();
  updateFontSelectOptions();
});
