const POMODORO = 1500;
const SHORT_BREAK = 300;
const LONG_BREAK = 900;

let timerButtons: NodeListOf<HTMLButtonElement>;
let circle: HTMLDivElement | null;
let innerCircle: HTMLDivElement | null;
let countdownElement: HTMLHeadingElement | null;
let playPauseElement: HTMLParagraphElement | null;

const buttonSound = new Audio("sound/button-sound.mp3");
const bellSound = new Audio("sound/bell-sound.mp3");

let timer: number;
let countdown: number;
let currentDuration: number;
let isPaused: boolean = true;
let isStarted: boolean = false;
let endTime: number;
let pausedTimeRemaining: number;

const SESSION_STORAGE_KEY = "pomodoroSessions";

type SessionType = "pomodoro" | "short_break" | "long_break";

export interface PomodoroSession {
  type: SessionType;
  duration: number;
  partial: boolean;
  completedAt: string;
}

function getSessionType(duration: number): SessionType {
  if (duration === SHORT_BREAK) return "short_break";
  if (duration === LONG_BREAK) return "long_break";
  return "pomodoro";
}

export function getSessions(): PomodoroSession[] {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function deleteSession(index: number): void {
  const sessions = getSessions();
  sessions.splice(index, 1);
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  window.dispatchEvent(new CustomEvent("sessionSaved"));
}

function saveSession(elapsed: number, partial: boolean): void {
  const sessions = getSessions();
  sessions.push({
    type: getSessionType(currentDuration),
    duration: elapsed,
    partial,
    completedAt: new Date().toISOString(),
  });
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  window.dispatchEvent(new CustomEvent("sessionSaved"));
}

const COLORS = {
  [POMODORO]: {
    bg: "rgb(255,146,172)",
    border: "rgb(149,9,41)",
    shadow: "rgba(149,9,41,0.7)",
  },
  [SHORT_BREAK]: {
    bg: "rgb(187,255,179)",
    border: "rgb(10,97,84)",
    shadow: "rgba(10,97,84,0.7)",
  },
  [LONG_BREAK]: {
    bg: "rgb(134,140,255)",
    border: "rgb(19,27,175)",
    shadow: "rgba(19,27,175,0.7)",
  },
};

export function startTimer(): void {
  if (!isStarted) {
    isStarted = true;
    endTime = Date.now() + countdown * 1000;
  }

  timer = setInterval(() => {
    if (!isPaused) {
      const currentTime = Date.now();
      const remainingTime = Math.ceil((endTime - currentTime) / 1000);

      if (remainingTime <= 0) {
        clearInterval(timer);
        handleTimerEnd();
        return;
      }

      countdown = remainingTime;
      updateDisplay(countdown);

      const progress = (countdown / currentDuration) * 360;
      updateInnerCircle(progress);
    }
  }, 1000);
}

function handleTimerEnd(): void {
  saveSession(currentDuration, false);
  countdown = 0;
  playPauseElement!.style.display = "none";
  bellSound.play();
  updateDisplay(0);
  updateInnerCircle(0);

  setTimeout(() => {
    resetTimer(POMODORO);
    currentDuration = POMODORO;
    countdown = POMODORO;
    isPaused = true;
    playPauseElement!.textContent = "Starta";
  }, 5000);
}

function updateDisplay(timeInSeconds: number): void {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  countdownElement!.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export function updateInnerCircle(progress: number): void {
  const color = COLORS[currentDuration as keyof typeof COLORS].bg;
  innerCircle!.style.background = `conic-gradient(${color} ${progress}deg, transparent 0%)`;
}

export function resetTimer(duration: number): void {
  clearInterval(timer);
  if (isStarted && countdown > 0) {
    saveSession(currentDuration - countdown, true);
  }
  isStarted = false;
  isPaused = true;

  countdown = duration;
  currentDuration = duration;

  updateDisplay(duration);

  playPauseElement!.style.display = "block";
  playPauseElement!.textContent = "Starta";

  const { bg, border, shadow } = COLORS[duration as keyof typeof COLORS];
  innerCircle!.style.background = `conic-gradient(${bg} 360deg, transparent 0%)`;
  circle!.style.borderColor = border;
  circle!.style.boxShadow = `0 0 40px 20px ${shadow}`;
}

export function initPomodoro(): void {
  timerButtons = document.querySelectorAll<HTMLButtonElement>(".timer-btn");
  circle = document.querySelector<HTMLDivElement>(".circle");
  innerCircle = document.querySelector<HTMLDivElement>(".inner-circle");
  countdownElement = document.querySelector<HTMLHeadingElement>(".countdown h1");
  playPauseElement = document.querySelector<HTMLParagraphElement>(".play-pause");

  timerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      timerButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const newDuration = parseInt(button.dataset.time!);
      resetTimer(newDuration);
    });
  });

  playPauseElement!.addEventListener("click", () => {
    buttonSound.play();
    isPaused = !isPaused;
    playPauseElement!.textContent = isPaused ? "Starta" : "Pausa";

    if (isPaused) {
      pausedTimeRemaining = Math.ceil((endTime - Date.now()) / 1000);
    } else {
      endTime = Date.now() + pausedTimeRemaining * 1000;
    }

    if (!isStarted) {
      startTimer();
    }
  });

  window.addEventListener("beforeunload", () => {
    if (isStarted && countdown > 0) {
      saveSession(currentDuration - countdown, true);
    }
  });

  resetTimer(POMODORO);
}
