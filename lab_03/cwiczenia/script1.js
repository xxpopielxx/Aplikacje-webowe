//Ćwiczenie 1: Stoper

let timerInterval = null;
let timeInSeconds = 0;

const display = document.getElementById("stopwatch-display");
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const btnReset = document.getElementById("btn-reset");

function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
}

function updateDisplay() {
  display.textContent = formatTime(timeInSeconds);
}

btnStart.addEventListener("click", () => {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      timeInSeconds++;
      updateDisplay();
    }, 1000);
  }
});

btnStop.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

btnReset.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeInSeconds = 0;
  updateDisplay();
});
