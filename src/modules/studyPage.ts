import "../style.scss";

//Plugg sidan med nedräkning


export function renderStudy() {
    const main = document.querySelector("main");

    const h1 = document.createElement("h1");
    main?.appendChild(h1);

    let timer = document.createElement("h2");
    timer.textContent = "00:00";
    main?.appendChild(timer);

    const btnContainer = document.createElement("div");
    main?.appendChild(btnContainer);
    const startBtn = document.createElement("button");
    const stopBtn = document.createElement("button");
    const resetBtn = document.createElement("button");
     btnContainer?.appendChild(startBtn);
     btnContainer?.appendChild(stopBtn);
     btnContainer?.appendChild(resetBtn);

     main?.classList.add("mainStudyPage");
}