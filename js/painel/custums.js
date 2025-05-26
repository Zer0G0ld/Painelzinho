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

// Recupera quantidade de fontes customizadas do localStorage ou 0
const customFonts = Number(localStorage.getItem("customFonts")) || 0;

const customFontListUl = document.querySelector("#custom-font-list ul");

// Cria fragmento para inserção eficiente no DOM
const fragment = document.createDocumentFragment();

for (let i = 0; i < customFonts; i++) {
  const fontNumber = i + 1;

  const li = document.createElement("li");

  const divFontName = document.createElement("div");
  divFontName.className = "font-name-added slot-storable";
  divFontName.id = `font-name-added-${fontNumber}`;

  const divFontUrl = document.createElement("div");
  divFontUrl.className = "font-url-added slot-storable";
  divFontUrl.id = `font-url-added-${fontNumber}`;

  const divDeleteFont = document.createElement("div");
  divDeleteFont.className = "delete-font";

  const divIconTrash = document.createElement("div");
  divIconTrash.className = "icon icon-trash";

  divDeleteFont.appendChild(divIconTrash);

  li.append(divFontName, divFontUrl, divDeleteFont);
  fragment.appendChild(li);
}

customFontListUl.appendChild(fragment);
function updateCustomFontList() {
  // Limpa arrays para evitar duplicações caso a função seja chamada várias vezes
  fontlist_names.length = 0;
  fontlist_urls.length = 0;

  // Seleciona todos os <li> dentro de #custom-font-list ul
  const liElements = document.querySelectorAll("#custom-font-list ul li");

  liElements.forEach((li) => {
    const fontName =
      li.querySelector(".font-name-added")?.textContent.trim() || "";
    const fontUrl =
      li.querySelector(".font-url-added")?.textContent.trim() || "";

    if (fontName) fontlist_names.push(fontName);
    if (fontUrl) fontlist_urls.push(fontUrl);
  });

  // Para cada select com a classe .font-storable
  const fontSelects = document.querySelectorAll(".font-storable");

  // Limpa as options atuais para evitar duplicatas
  fontSelects.forEach((select) => {
    select.innerHTML = "";
  });

  // Monta as options com o nome curto extraído e adiciona em cada select
  fontlist_names.forEach((fontName) => {
    // Extrai o nome curto com base no padrão da string
    // Exemplo: "'Open Sans', sans-serif" -> extrai "Open Sans"
    const shortNameMatch = fontName.match(/\*?'([^']+)',/);
    const fontShortName = shortNameMatch ? shortNameMatch[1] : fontName;

    fontSelects.forEach((select) => {
      const option = document.createElement("option");
      option.value = fontName;
      option.textContent = fontShortName;
      select.appendChild(option);
    });
  });

  // Ajusta o valor selecionado em cada select conforme o localStorage
  fontSelects.forEach((select) => {
    const id = select.id;
    const storedValue = localStorage.getItem(id);

    if (storedValue && fontlist_names.includes(storedValue)) {
      select.value = storedValue;
    } else {
      select.value = "'Open Sans', sans-serif"; // valor padrão
    }
  });

  // Caso tenha função para enviar a fonte para algum lugar
  // function_send_font();
}

// Adiciona nova fonte no painel e atualiza selects
function addNewFont(fontName, fontUrl) {
  fontlist_names.push(fontName);
  fontlist_urls.push(fontUrl);

  // Extrai nome curto do fontName, ex: "'Open Sans', sans-serif" -> "Open Sans"
  const fontNameShort = (() => {
    const match = fontName.match(/\*?'([^']+)',/);
    return match ? match[1] : fontName;
  })();

  document.querySelectorAll(".font-storable").forEach((select) => {
    const option = document.createElement("option");
    option.value = fontName;
    option.textContent = fontNameShort;
    select.appendChild(option);
  });

  function_send_font();
}

// Remove fonte do painel e dos selects
function removeFont(fontName, fontUrl) {
  fontlist_names = fontlist_names.filter((name) => name !== fontName);
  fontlist_urls = fontlist_urls.filter((url) => url !== fontUrl);

  document.querySelectorAll(".font-storable").forEach((select) => {
    const option = select.querySelector(`option[value="${fontName}"]`);
    if (option) select.removeChild(option);
  });
}

// Evento para adicionar nova fonte ao clicar no botão
document.getElementById("add-new-font")?.addEventListener("click", () => {
  const ul = document.querySelector("#custom-font-list ul");
  if (!ul) return;

  const howMany = ul.children.length + 1;

  const inputName = document.getElementById("new-font-name");
  const inputUrl = document.getElementById("new-font-url");
  if (!inputName || !inputUrl) return;

  let fontNameToAdd = inputName.value.trim();
  let fontUrlToAdd = inputUrl.value.trim();

  if (!fontNameToAdd || !fontUrlToAdd) return;

  // Limpa inputs
  inputName.value = "";
  inputUrl.value = "";

  // Remove "font-family: " e ";" do nome da fonte, se existir
  fontNameToAdd = fontNameToAdd
    .replace(/font-family:\s*/i, "")
    .replace(/;/g, "");

  // Remove tags <style> do URL, se existir
  fontUrlToAdd = fontUrlToAdd
    .replace(/<style>\s*/i, "")
    .replace(/\s*<\/style>/i, "");

  // Cria o novo item na lista custom-font-list
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="font-name-added slot-storable" id="font-name-added-${howMany}">${fontNameToAdd}</div>
    <div class="font-url-added slot-storable" id="font-url-added-${howMany}">${fontUrlToAdd}</div>
    <div class="delete-font"><div class="icon icon-trash"></div></div>
  `;
  ul.appendChild(li);

  addNewFont(fontNameToAdd, fontUrlToAdd);

  // Ajusta altura do painel de configurações
  const globalConfig = document.getElementById("global-configuration");
  const moreSettings = document.getElementById("more-settings");
  if (globalConfig && moreSettings) {
    const currentHeight = parseFloat(globalConfig.style.maxHeight) || 0;
    const newHeight = currentHeight + 28;
    globalConfig.style.maxHeight = newHeight + "px";
    moreSettings.style.maxHeight = newHeight + "px";
  }

  // Atualiza localStorage
  localStorage.setItem("customFonts", howMany);
  localStorage.setItem(`font-name-added-${howMany}`, fontNameToAdd);
  localStorage.setItem(`font-url-added-${howMany}`, fontUrlToAdd);
});

// Evento para remover fonte ao clicar no ícone de lixeira (delegação)
document
  .querySelector("#custom-font-list ul")
  ?.addEventListener("click", (event) => {
    if (!event.target.closest(".delete-font")) return;

    const li = event.target.closest("li");
    if (!li) return;

    const fontNameToRemove =
      li.querySelector(".font-name-added")?.textContent || "";
    const fontUrlToRemove =
      li.querySelector(".font-url-added")?.textContent || "";

    li.remove();

    removeFont(fontNameToRemove, fontUrlToRemove);

    // Atualiza localStorage e quantidade
    const ul = document.querySelector("#custom-font-list ul");
    const howMany = ul ? ul.children.length : 0;
    localStorage.setItem("customFonts", howMany);

    // Remove entradas extras do localStorage
    for (let i = 20; i > howMany; i--) {
      localStorage.removeItem(`font-name-added-${i}`);
      localStorage.removeItem(`font-url-added-${i}`);
    }
  });
// Renomeia IDs e atualiza localStorage ao clicar em qualquer <li> dentro de #custom-font-list ul
document
  .querySelector("#custom-font-list ul")
  ?.addEventListener("click", () => {
    const listItems = document.querySelectorAll("#custom-font-list ul li");
    listItems.forEach((li, index) => {
      const i = index + 1;
      const fontNameId = `font-name-added-${i}`;
      const fontUrlId = `font-url-added-${i}`;

      const fontNameElem = li.querySelector(".font-name-added");
      const fontUrlElem = li.querySelector(".font-url-added");

      if (fontNameElem && fontUrlElem) {
        fontNameElem.id = fontNameId;
        fontUrlElem.id = fontUrlId;

        localStorage.setItem(fontNameId, fontNameElem.textContent);
        localStorage.setItem(fontUrlId, fontUrlElem.textContent);
      }
    });
  });