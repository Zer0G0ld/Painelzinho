import { fontlistNames, fontlistUrls, extractShortName, addNewFont, removeFont } from './fontsManager.js';

// ------------------------
// Funções privadas de limpeza de strings
function cleanFontName(name) {
  return name.replace(/font-family:\s*/i, "").replace(/;/g, "").trim();
}

function cleanFontUrl(url) {
  return url.replace(/<style>\s*/i, "").replace(/\s*<\/style>/i, "").trim();
}

// ------------------------
// Atualiza selects de fontes
function updateCustomFontList() {
  $("#custom-font-list ul li").each(function () {
    const fontName = $(this).find(".font-name-added").text().trim();
    const fontUrl = $(this).find(".font-url-added").text().trim();
    if (fontName && !fontlistNames.includes(fontName)) {
      fontlistNames.push(fontName);
      fontlistUrls.push(fontUrl);
    }
  });

  $(".font-storable").each(function () {
    const $select = $(this);
    $select.empty();
    fontlistNames.forEach((fontFullName) => {
      const shortName = extractShortName(fontFullName);
      $select.append(`<option value="${fontFullName}">${shortName}</option>`);
    });

    const savedValue = localStorage.getItem($select.attr("id"));
    $select.val(savedValue && fontlistNames.includes(savedValue) ? savedValue : "'Open Sans', sans-serif");
  });
}

// ------------------------
// Ajusta altura dos painéis
function updatePanelHeights() {
  const globalConfig = document.getElementById("global-configuration");
  const moreSettings = document.getElementById("more-settings");
  const count = $("#custom-font-list ul li").length;
  globalConfig.style.maxHeight = `${count * 28}px`;
  moreSettings.style.maxHeight = `${count * 28}px`;
}

// ------------------------
// Renomeia IDs da lista
function renameFontIds() {
  $("#custom-font-list ul li").each(function (index) {
    const i = index + 1;
    $(this).find(".font-name-added").attr("id", `font-name-added-${i}`);
    $(this).find(".font-url-added").attr("id", `font-url-added-${i}`);
  });
}

// ------------------------
// Salva no localStorage
function saveToLocalStorage() {
  const count = $("#custom-font-list ul li").length;
  localStorage.setItem("customFonts", count);
  $("#custom-font-list ul li").each(function (index) {
    const i = index + 1;
    localStorage.setItem(`font-name-added-${i}`, $(this).find(".font-name-added").text());
    localStorage.setItem(`font-url-added-${i}`, $(this).find(".font-url-added").text());
  });
}

// ------------------------
// Inicializa eventos da UI
function initFontHandlers() {
  // Adicionar nova fonte
  $("#add-new-font").click(function () {
    const howMany = $("#custom-font-list ul li").length + 1;
    const fontNameClean = cleanFontName($("#new-font-name").val());
    const fontUrlClean = cleanFontUrl($("#new-font-url").val());

    if (fontNameClean && fontUrlClean) {
      $("#new-font-name, #new-font-url").val("");
      $("#custom-font-list ul").append(`
        <li>
          <div class="font-name-added slot-storable" id="font-name-added-${howMany}">${fontNameClean}</div>
          <div class="font-url-added slot-storable" id="font-url-added-${howMany}">${fontUrlClean}</div>
          <div class="delete-font"><div class="icon icon-trash"></div></div>
        </li>
      `);

      addNewFont(fontNameClean, fontUrlClean);
      updatePanelHeights();
      saveToLocalStorage();
    }
  });

  // Remover fonte
  $("#custom-font-list ul").on("click", "li > .delete-font", function () {
    const li = $(this).closest("li");
    const fontNameToRemove = li.find(".font-name-added").text();
    const fontUrlToRemove = li.find(".font-url-added").text();

    li.remove();
    removeFont(fontNameToRemove, fontUrlToRemove);
    updatePanelHeights();
    renameFontIds();
    saveToLocalStorage();
  });

  // Ordenação com jQuery UI sortable
  $("#sortable").sortable({ handle: ".drag-handle" });

  $("#sortable").on("sortupdate", function () {
    const sorted = $(this).sortable("serialize");
    localStorage.setItem("sorted", sorted);
  });

  if (localStorage.getItem("sorted") !== null) {
    const arrValuesForOrder = localStorage.getItem("sorted").substring(6).split("&alt[]=");
    const $ul = $("#sortable");
    const $items = $ul.children();

    for (let i = arrValuesForOrder.length - 1; i >= 0; i--) {
      $ul.prepend($items.get(arrValuesForOrder[i] - 1));
    }
  }

  $("#sortable").disableSelection();

  // Renomear itens da lista
  let oriVal;
  $(".renameable").on("dblclick", function () {
    const titleDiv = $(this);
    if (titleDiv.text()) oriVal = titleDiv.text();
    titleDiv.text("");
    $("<input type='text' value='" + oriVal + "' maxlength='40'>")
      .appendTo(this)
      .focus()
      .change(function () {
        titleDiv.text($(this).val());
      });
  });

  $(".renameable").on("focusout", "> input", function () {
    $(this).remove();
  });
}

// ------------------------
// Exportando funções públicas
export { updateCustomFontList, initFontHandlers, cleanFontName, cleanFontUrl, updatePanelHeights, renameFontIds, saveToLocalStorage };
