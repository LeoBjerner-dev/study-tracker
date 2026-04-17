import { getSessions, PomodoroSession } from "./pomodoro-logic";
import "../styles/statsPage.scss";

function clearMain(): void {
  const main = document.querySelector("main");
  if (!main) return;
  main.innerHTML = "";
  main.className = "";
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  return `${m} min`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sv-SE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TYPE_LABELS: Record<PomodoroSession["type"], string> = {
  pomodoro: "Pomodoro",
  short_break: "Kort paus",
  long_break: "Lång paus",
};

const TYPE_CLASSES: Record<PomodoroSession["type"], string> = {
  pomodoro: "tag-pomodoro",
  short_break: "tag-short",
  long_break: "tag-long",
};

export function renderStats(): void {
  const main = document.querySelector("main")!;
  main.classList.add("mainStatsPage");

  const sessions = getSessions();
  const pomodoros = sessions.filter((s) => s.type === "pomodoro");
  const totalStudySecs = pomodoros.reduce((sum, s) => sum + s.duration, 0);

  // Header row
  const header = document.createElement("div");
  header.className = "stats-header";

  const title = document.createElement("h1");
  title.textContent = "Statistik";
  header.appendChild(title);

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Tillbaka";
  backBtn.className = "stats-back-btn";
  backBtn.addEventListener("click", () => {
    clearMain();
    import("./studyPage").then(({ renderStudy }) => renderStudy());
  });
  header.appendChild(backBtn);
  main.appendChild(header);

  // Summary cards
  const summary = document.createElement("div");
  summary.className = "stats-summary";

  const cards = [
    { label: "Pomodoros totalt", value: String(pomodoros.length) },
    { label: "Studietid totalt", value: formatDuration(totalStudySecs) },
    { label: "Sessioner totalt", value: String(sessions.length) },
  ];

  cards.forEach(({ label, value }) => {
    const card = document.createElement("div");
    card.className = "stats-card";
    card.innerHTML = `<span class="stats-card-value">${value}</span><span class="stats-card-label">${label}</span>`;
    summary.appendChild(card);
  });

  main.appendChild(summary);

  // Session log grouped by date
  const logTitle = document.createElement("h2");
  logTitle.textContent = "Sessionslogg";
  logTitle.className = "stats-log-title";
  main.appendChild(logTitle);

  if (sessions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "stats-empty";
    empty.textContent = "Inga sessioner sparade än. Kör en pomodoro först!";
    main.appendChild(empty);
    return;
  }

  // Group by date (newest first)
  const grouped = new Map<string, PomodoroSession[]>();
  [...sessions].reverse().forEach((s) => {
    const day = new Date(s.completedAt).toDateString();
    if (!grouped.has(day)) grouped.set(day, []);
    grouped.get(day)!.push(s);
  });

  const log = document.createElement("div");
  log.className = "stats-log";

  grouped.forEach((daySessions, _day) => {
    const group = document.createElement("div");
    group.className = "stats-day-group";

    const dayLabel = document.createElement("h3");
    dayLabel.className = "stats-day-label";
    dayLabel.textContent = formatDate(daySessions[0].completedAt);
    group.appendChild(dayLabel);

    daySessions.forEach((s) => {
      const row = document.createElement("div");
      row.className = "stats-row";

      const tag = document.createElement("span");
      tag.className = `stats-tag ${TYPE_CLASSES[s.type]}`;
      tag.textContent = TYPE_LABELS[s.type];

      const dur = document.createElement("span");
      dur.className = "stats-row-duration";
      dur.textContent = formatDuration(s.duration);

      const time = document.createElement("span");
      time.className = "stats-row-time";
      time.textContent = formatTime(s.completedAt);

      row.appendChild(tag);
      row.appendChild(dur);
      row.appendChild(time);
      group.appendChild(row);
    });

    log.appendChild(group);
  });

  main.appendChild(log);
}
