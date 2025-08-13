// popup-logos.js

// ==================== RESET POPUP ====================
export function openResetPopup() {
  document.getElementById("reset-all").classList.remove("hide");
}

export function okResetPopup() {
  localStorage.clear(); // Limpa todos os dados

  // Restaurar logos padrões
  $(".logo-storable").each(function () {
    const id = $(this).attr("id");
    let value;
    if (id == "alt-1-logo-preview" || id == "alt-1-logo-default") value = alt_1_logo_default;
    if (id == "alt-2-logo-preview" || id == "alt-2-logo-default") value = alt_2_logo_default;
    if (id == "alt-3-logo-preview" || id == "alt-3-logo-default") value = alt_3_logo_default;
    if (id == "alt-4-logo-preview" || id == "alt-4-logo-default") value = alt_4_logo_default;
    localStorage.setItem(id, value);
  });

  location.reload();
}

export function cancelResetPopup() {
  document.getElementById("reset-all").classList.add("hide");
}

// ==================== EXPORT POPUP ====================
export function openExportPopup() {
  document.getElementById("export-data").classList.remove("hide");
}

export function okExportPopup() {
  document.getElementById("export-data").classList.add("hide");
}

// ==================== LOGO POPUP ====================
export function showPreview(element) {
  if (element.files.length > 0) {
    const src = URL.createObjectURL(element.files[0]);
    const preview = document.getElementById("logo-file-preview");
    document.getElementById("file-preview").classList.remove("no-image");
    preview.src = src;
    preview.style.display = "block";
  }
}

export function openLogoPopup(logo, logo_default) {
  document.getElementById("select-image").classList.remove("hide");
  document.getElementById("file-preview").classList.remove("no-image");

  const preview_to_change = $("#" + logo).attr("src");
  const preview = document.getElementById("logo-file-preview");
  preview.src = preview_to_change;
  preview.style.display = "block";
  $("#logo-file").val("");

  // Config ok button dinamicamente
  $(".btn-ok").attr("onclick", `okLogoPopup('${logo}', '${logo_default}')`);

  // Hide remove button se for logo default
  $(".btn-remove").css("display", logo === logo_default ? "none" : "block");
}

export function okLogoPopup(logo, logo_default) {
  const srcFile = document.getElementById("logo-file").files[0];
  const popupPreview = $("#logo-file-preview").attr("src");
  const preview = document.getElementById(logo);
  const altLogoPreview = logo_default.replace("-default", "-preview");

  if (srcFile) {
    preview.src = "../logos/" + srcFile.name;
    $(preview).change();

    // Se logo default usado, atualiza também o alternativo
    if (logo === logo_default && $("#" + altLogoPreview).hasClass("default")) {
      $("#" + altLogoPreview).attr("src", "../logos/" + srcFile.name).change();
    }
  } else if (!popupPreview) {
    const altLogoDefault = $("#" + logo_default).attr("src");
    preview.src = altLogoDefault;
    $(preview).change();
  }

  document.getElementById("select-image").classList.add("hide");
}

export function cancelLogoPopup() {
  document.getElementById("select-image").classList.add("hide");
}

export function removeLogoPopup() {
  const preview = document.getElementById("logo-file-preview");
  document.getElementById("file-preview").classList.add("no-image");
  $("#logo-file").val("");
  preview.src = "";
  preview.style.display = "none";
}

// ==================== CHECK LOGOS ====================
export function checkLogos() {
  $(".alt-logo-preview").each(function () {
    const checkLogoId = $(this).attr("id");
    const checkDefaultLogoId = checkLogoId.replace("-preview", "-default");
    const isDefault = $("#" + checkLogoId).attr("src") === $("#" + checkDefaultLogoId).attr("src");

    if (isDefault) $(this).addClass("default");
    else $(this).removeClass("default");
  });
}
