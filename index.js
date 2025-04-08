function joinGame() {
  const name = document.getElementById('username').value;
  const code = document.getElementById('joinCode').value;

  if (!name || !code) return alert('Please enter name and code.');

  const game = JSON.parse(localStorage.getItem('ironmanGame'));

  if (!game || game.code !== code) return alert('Invalid game code.');

  if (game.players.find(p => p.name === name)) {
    return alert('This name is already taken. Choose a different one.');
  }

  game.players.push({ name, progress: 0, time: 0, stage: 0 });
  localStorage.setItem('ironmanGame', JSON.stringify(game));
  localStorage.setItem('currentUser', name);
  window.location.href = 'play.html';
}
