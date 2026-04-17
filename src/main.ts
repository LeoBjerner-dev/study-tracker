import { renderStart } from "./modules/welcome";

renderStart();

const logoBtn = document.querySelector<HTMLImageElement>("header img");
logoBtn?.addEventListener("click", () => {
  const main = document.querySelector("main")!;
  main.innerHTML = "";
  main.className = "";
  renderStart();
});

logoBtn?.style.setProperty("cursor", "pointer");