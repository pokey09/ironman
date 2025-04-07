const username = localStorage.getItem("currentUser") || "Racer";
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

const maxStageProgress = [20, 50, 30]; // Total clicks per stage
const stages = [
  { name: "Swim 🏊", icon: "https://img.icons8.com/color/48/000000/swimming.png" },
  { name: "Bike 🚴", icon: "https://img.icons8.com/color/48/000000/bicycle.png" },
  { name: "Run 🏃", icon: "https://img.icons8.com/color/48/000000/running.png" }
];

const waitInterval = setInterval(() => {
  const game = JSON.parse(localStorage.getItem("ironmanGame"));
  if (game && game.started && !gameStarted) {
    gameStarted = true;
    clickBtn.disabled = false;
    updateStageUI();
    clearInterval(waitInterval);
  }
}, 1000);

function updateStageUI() {
  statusBox.textContent = `🚩 Stage: ${stages[stage].name}`;
  runner.style.background = `url('${stages[stage].icon}') no-repeat center center / cover`;
}

function clickToAdvance() {
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

  const game = JSON.parse(localStorage.getItem("ironmanGame"));
  const player = game.players.find(p => p.name === username);

  if (player) {
    // Total progress based on all 3 stages
    const totalStages = maxStageProgress.reduce((a, b) => a + b, 0);
    const completed = maxStageProgress.slice(0, stage).reduce((a, b) => a + b, 0);
    const totalProgress = (completed + progress) / totalStages;

    player.progress = totalProgress * 100;
    player.stage = stage;
    localStorage.setItem("ironmanGame", JSON.stringify(game));
  }

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
      if (player) {
        player.time = time;
        player.progress = 100;
        player.stage = 3;

        localStorage.setItem("ironmanGame", JSON.stringify(game));

        // 🥇 Show player's place
        const updatedGame = JSON.parse(localStorage.getItem("ironmanGame"));
        const ranked = [...updatedGame.players]
          .filter(p => p.time > 0)
          .sort((a, b) => a.time - b.time);

        const place = ranked.findIndex(p => p.name === username) + 1;
        alert(`🎉 You finished in place #${place}!`);
      }
    }
  }
}