import "../style.scss";

const main = document.querySelector("main");

// STARTSIDA
export function renderStart() {
  const h1 = document.createElement("h1");
  h1.textContent = "Redo att plugga?";
  main?.appendChild(h1);

  const p = document.createElement("p");
  p.textContent = `Så här fungerar det:

Välj en uppgift du ska jobba med
Sätt en timer på 25 minuter och fokusera helt
Ta en 5 minuters paus när timern ringer
Upprepa — efter 4 rundor tar du en längre paus på 15–30 min

Tips:

Lägg bort telefonen under de 25 minuterna
Skriv ner distraktioner som dyker upp istället för att agera på dem direkt
En "pomodoro" räknas bara om du klarar hela 25 minuter`;

  main?.appendChild(p);

  main?.classList.add("mainWelcomePage");

  const welcomeBtn = document.createElement("button");
  welcomeBtn.innerText = "Kör igång";
  main?.appendChild(welcomeBtn)

  welcomeBtn.addEventListener("click", () => {
    clearMain();
  });
}

function clearMain() {
    const main = document.querySelector("main");
    if (!main) return;
    main.innerHTML ="";
    main.className = "";
};

