    function joinGame() {
    const name = document.getElementById('username').value;
    const code = document.getElementById('joinCode').value;

    if (!name || !code) return alert('Please enter name and code.');

    const game = JSON.parse(localStorage.getItem('ironmanGame'));

    if (!game || game.code !== code) return alert('Invalid game code.');

    // Prevent duplicate names
    if (game.players.find(p => p.name === name)) {
        return alert('This name is already taken. Choose a different one.');
    }

    game.players.push({ name, progress: 0, time: 0, stage: 0 });
    localStorage.setItem('ironmanGame', JSON.stringify(game));
    localStorage.setItem('currentUser', name);
    window.location.href = 'play.html';
    }
  
  const gameCode = "IRON123";
  const game = { code: gameCode, started: false, players: [] };
  localStorage.setItem("ironmanGame", JSON.stringify(game));
  
  function updateList() {
    const updatedGame = JSON.parse(localStorage.getItem("ironmanGame"));
    const list = document.getElementById("playerList");
    list.innerHTML = "";
    updatedGame.players.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p.name;
      list.appendChild(li);
    });
  }
  
  setInterval(updateList, 1000);
  
  function startGame() {
    const g = JSON.parse(localStorage.getItem("ironmanGame"));
    g.started = true;
    localStorage.setItem("ironmanGame", JSON.stringify(g));
    alert("Race Started!");
  }