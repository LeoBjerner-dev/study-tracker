import "../style.scss";
import { renderStudy } from "./studyPage";


const main = document.querySelector("main");

// STARTSIDA
export function renderStart() {
  const h1 = document.createElement("h1");
  h1.textContent = "Pomodoro tekniken";
  main?.appendChild(h1);

const h3 = document.createElement("h3");
h3.textContent = "Så här fungerar det:";

const ol = document.createElement("ol");
const steps = [
  "Välj en uppgift du ska jobba med",
  "Starta timern på 25 minuter och fokusera helt",
  "Ta en 5 minuters paus när timern ringer",
  "Upprepa, och efter 4 rundor tar du en längre paus på 15–30 min"
];

steps.forEach(step => {
  const li = document.createElement("li");
  li.textContent = step;
  ol.appendChild(li);
});

const tips = document.createElement("h3");
tips.textContent = "Tips:";

const ul = document.createElement("ul");
const tipsList = [
  "Lägg bort telefonen under de 25 minuterna.",
  "Skriv ner distraktioner som dyker upp istället för att agera på dem direkt.",
  'En "pomodoro" räknas bara om du klarar hela 25 minuter.'
];

tipsList.forEach(tip => {
  const li = document.createElement("li");
  li.textContent = tip;
  ul.appendChild(li);
});

main?.appendChild(h3);
main?.appendChild(ol);
main?.appendChild(tips);
main?.appendChild(ul);

  main?.classList.add("mainWelcomePage");

  const welcomeBtn = document.createElement("button");
  welcomeBtn.innerText = "Kör igång";
  main?.appendChild(welcomeBtn)

  welcomeBtn.addEventListener("click", () => {
    clearMain();
    renderStudy();
  });
}

function clearMain() {
    const main = document.querySelector("main");
    if (!main) return;
    main.innerHTML ="";
    main.className = "";
};

