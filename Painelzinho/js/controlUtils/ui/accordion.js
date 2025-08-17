function initAccordionHandlers() {
  document.querySelectorAll(".accordion").forEach((el) =>
    el.addEventListener("click", function () {
      this.classList.toggle("active");
      const hidable = this.nextElementSibling;

      // Adiciona/remover classe CSS
      hidable.classList.toggle("active");
    })
  );

  document.querySelectorAll(".more").forEach((el) =>
    el.addEventListener("click", function () {
      this.classList.toggle("active");
      const hideMore = this.nextElementSibling;
      if (hideMore.style.maxHeight) {
        hideMore.style.maxHeight = null;
      } else {
        hideMore.style.maxHeight = hideMore.scrollHeight + "px";
        const globalConfig = document.getElementById("global-configuration");
        let currentHeight = parseInt(globalConfig.style.maxHeight) || 0;
        globalConfig.style.maxHeight =
          currentHeight + hideMore.scrollHeight + "px";
      }
    })
  );
}

function updateMoreMaxHeight() {
  const element = document.querySelector(".more");
  if ($("#more-settings").css("max-height") !== "0px") {
    const hideMore = element.nextElementSibling;
    hideMore.style.maxHeight = hideMore.scrollHeight + "px";

    const globalConfig = document.getElementById("global-configuration");
    let currentHeight = parseInt(globalConfig.style.maxHeight) || 0;
    globalConfig.style.maxHeight = currentHeight + hideMore.scrollHeight + "px";
  }
}

export { initAccordionHandlers, updateMoreMaxHeight };
