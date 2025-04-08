const API_URL = "https://ironman-server-production.up.railway.app";
const username = localStorage.getItem("currentUser");
const gameCode = localStorage.getItem("gameCode");

document.getElementById("playerName").textContent = `Go, ${username}!`;

const runner = document.getElementById("runner");
const timerDisplay = document.getElementById("timer");
const statusBox = document.getElementById("status");
const clickBtn = document.getElementById("clickBtn");

let gameStarted = false;
let progress = 0;
let stage = 0;
let time = 0;
let timerInterval = null;

const maxStageProgress = [20, 50, 30];
const stages = [
  { name: "Swim 🏊", icon: "https://img.icons8.com/color/48/000000/swimming.png" },
  { name: "Bike 🚴", icon: "https://img.icons8.com/color/48/000000/bicycle.png" },
  { name: "Run 🏃", icon: "https://img.icons8.com/color/48/000000/running.png" }
];

const waitInterval = setInterval(async () => {
  const res = await fetch(`${API_URL}/status/${gameCode}`);
  const game = await res.json();
  if (game.started && !gameStarted) {
    gameStarted = true;
    clickBtn.disabled = false;
    clickBtn.style.display = "inline-block";
    document.getElementById("progressBar").style.display = "block";
    document.getElementById("timer").style.display = "block";
    updateStageUI();
    clearInterval(waitInterval);
  }
}, 500);

function updateStageUI() {
  statusBox.textContent = `🚩 Stage: ${stages[stage].name}`;
  runner.style.background = `url('${stages[stage].icon}') no-repeat center center / cover`;
}

async function clickToAdvance() {
  if (!gameStarted) return;

  progress++;
  const stageMax = maxStageProgress[stage];
  const percent = (progress / stageMax) * 100;
  runner.style.left = `calc(${percent}% - 20px)`;

  if (progress === 1 && !timerInterval) {
    timerInterval = setInterval(() => {
      time++;
      timerDisplay.textContent = time;
    }, 1000);
  }

  const totalStages = maxStageProgress.reduce((a, b) => a + b, 0);
  const completed = maxStageProgress.slice(0, stage).reduce((a, b) => a + b, 0);
  const totalProgress = (completed + progress) / totalStages;

  await fetch(`${API_URL}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: gameCode,
      name: username,
      progress: totalProgress * 100,
      time,
      stage
    })
  });

  if (progress >= stageMax) {
    stage++;
    progress = 0;

    if (stage < stages.length) {
      updateStageUI();
      runner.style.left = "0%";
    } else {
      clearInterval(timerInterval);
      clickBtn.disabled = true;
      statusBox.textContent = "🎉 You finished the Ironman!";
      await fetch(`${API_URL}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: gameCode,
          name: username,
          progress: 100,
          time,
          stage: 3
        })
      });
      const res = await fetch(`${API_URL}/status/${gameCode}`);
      const data = await res.json();
      const ranked = data.players.filter(p => p.time > 0).sort((a, b) => a.time - b.time);
      const place = ranked.findIndex(p => p.name === username) + 1;
      alert(`🎉 You finished in place #${place}!`);
      window.location.href = "index.html";
    }
  }
}
