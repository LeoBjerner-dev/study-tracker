import "../style.scss";
import { initPomodoro, getSessions, deleteSession } from "./pomodoro-logic";

//Plugg sidan med nedräkning

export function renderStudy() {
    const main = document.querySelector("main");

    const btnContainer = document.createElement("div");
    main?.appendChild(btnContainer);
    const startBtn = document.createElement("button");
    const stopBtn = document.createElement("button");
    const resetBtn = document.createElement("button");

    startBtn.textContent = "Pomodoro";
    startBtn.className = "timer-btn pomodoro active";
    startBtn.dataset.time = "1500";

    stopBtn.textContent = "Kort paus";
    stopBtn.className = "timer-btn short-break";
    stopBtn.dataset.time = "300";

    resetBtn.textContent = "Lång paus";
    resetBtn.className = "timer-btn long-break";
    resetBtn.dataset.time = "900";

    btnContainer?.appendChild(startBtn);
    btnContainer?.appendChild(stopBtn);
    btnContainer?.appendChild(resetBtn);

    main?.classList.add("mainStudyPage");
    btnContainer?.classList.add("btnContainer");

    // Circle structure
    const circle = document.createElement("div");
    circle.className = "circle";

    const innerCircle = document.createElement("div");
    innerCircle.className = "inner-circle";

    const countdown = document.createElement("div");
    countdown.className = "countdown";

    const h1 = document.createElement("h1");
    const playPause = document.createElement("p");
    playPause.className = "play-pause";

    countdown.appendChild(h1);
    countdown.appendChild(playPause);
    innerCircle.appendChild(countdown);
    circle.appendChild(innerCircle);
    main?.appendChild(circle);

    main?.appendChild(renderSessionWidget());
    main?.appendChild(renderTotalsWidget());

    initPomodoro();
}

const TYPE_LABELS = {
  pomodoro: "Pomodoro",
  short_break: "Kort paus",
  long_break: "Lång paus",
} as const;

const TYPE_CLASSES = {
  pomodoro: "tag-pomodoro",
  short_break: "tag-short",
  long_break: "tag-long",
} as const;

function buildSessionRow(s: ReturnType<typeof getSessions>[number], storageIndex: number): HTMLDivElement {
  const row = document.createElement("div");
  row.className = "session-row";

  const tag = document.createElement("span");
  tag.className = `session-tag ${TYPE_CLASSES[s.type]}${s.partial ? " tag-partial" : ""}`;
  tag.textContent = TYPE_LABELS[s.type] + (s.partial ? " ◑" : "");

  const dur = document.createElement("span");
  dur.className = "session-duration";
  dur.textContent = `${Math.floor(s.duration / 60)} min`;

  const time = document.createElement("span");
  time.className = "session-time";
  time.textContent = new Date(s.completedAt).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = document.createElement("span");
  date.className = "session-date";
  date.textContent = new Date(s.completedAt).toLocaleDateString("sv-SE", {
    month: "short",
    day: "numeric",
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "session-delete-btn";
  deleteBtn.textContent = "✕";
  deleteBtn.addEventListener("click", () => deleteSession(storageIndex));

  row.appendChild(tag);
  row.appendChild(dur);
  row.appendChild(time);
  row.appendChild(date);
  row.appendChild(deleteBtn);
  return row;
}

function buildSessionList(expanded: boolean): HTMLElement {
  const sessions = getSessions().reverse();

  if (sessions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "session-widget-empty";
    empty.textContent = "Inga sessioner än – kör igång!";
    return empty;
  }

  const container = document.createElement("div");

  const list = document.createElement("div");
  list.className = expanded ? "session-widget-list expanded" : "session-widget-list";

  const total = sessions.length;
  const visible = expanded ? sessions : sessions.slice(0, 5);
  visible.forEach((s, i) => list.appendChild(buildSessionRow(s, total - 1 - i)));
  container.appendChild(list);

  if (sessions.length > 5) {
    const toggle = document.createElement("button");
    toggle.className = "session-toggle-btn";
    toggle.textContent = expanded ? "Visa färre ▲" : `Visa alla (${sessions.length}) ▼`;
    container.appendChild(toggle);
  }

  return container;
}

function renderSessionWidget(): HTMLDivElement {
  const widget = document.createElement("div");
  widget.className = "session-widget";

  const title = document.createElement("h3");
  title.textContent = "Senaste plugg omgångarna";
  title.className = "session-widget-title";
  widget.appendChild(title);

  let expanded = false;
  let listEl = buildSessionList(expanded);
  widget.appendChild(listEl);

  widget.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).classList.contains("session-toggle-btn")) {
      expanded = !expanded;
      const newList = buildSessionList(expanded);
      widget.replaceChild(newList, listEl);
      listEl = newList;
    }
  });

  window.addEventListener("sessionSaved", () => {
    const newList = buildSessionList(expanded);
    widget.replaceChild(newList, listEl);
    listEl = newList;
  });

  return widget;
}

function renderTotalsWidget(): HTMLDivElement {
  const widget = document.createElement("div");
  widget.className = "session-widget";

  const title = document.createElement("h3");
  title.className = "session-widget-title";
  title.textContent = "Totalt avklarade sessioner";
  widget.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "totals-grid";
  widget.appendChild(grid);

  function updateGrid(): void {
    const sessions = getSessions();
    const counts = { pomodoro: 0 };
    let totalMins = 0;
    sessions.forEach((s) => {
      if (s.type === "pomodoro") {
        if (!s.partial) counts.pomodoro++;
        totalMins += Math.floor(s.duration / 60);
      }
    });

    grid.innerHTML = "";
    const items = [
      { label: "Pomodoros", value: counts.pomodoro },
      { label: "Minuter fokus", value: totalMins },
    ];
    items.forEach(({ label, value }) => {
      const card = document.createElement("div");
      card.className = "totals-card";
      card.innerHTML = `<span class="totals-value">${value}</span><span class="totals-label">${label}</span>`;
      grid.appendChild(card);
    });
  }

  updateGrid();
  window.addEventListener("sessionSaved", updateGrid);

  return widget;
}