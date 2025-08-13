// Lista inicial de fontes padrão
let fontlistNames = [
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
let fontlistUrls = [];

// Função para extrair o "shortname" da fonte
function extractShortName(fontFullName) {
  const match = fontFullName.match(/'([^']+)'/);
  return match ? match[1] : fontFullName;
}

// Adiciona nova fonte
function addNewFont(fontName, fontUrl) {
  if (!fontName || fontlistNames.includes(fontName)) return;

  fontlistNames.push(fontName);
  fontlistUrls.push(fontUrl);
}

// Remove fonte
function removeFont(fontName, fontUrl) {
  fontlistNames = fontlistNames.filter((name) => name !== fontName);
  fontlistUrls = fontlistUrls.filter((url) => url !== fontUrl);
}

export { fontlistNames, fontlistUrls, extractShortName, addNewFont, removeFont };
