async function joinGame() {
  const name = document.getElementById('username').value;
  const code = document.getElementById('joinCode').value;

  if (!name || !code) return alert('Please enter name and code.');

  try {
    const response = await fetch('https://ironman-server-production.up.railway.app/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, name })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to join game');
    }

    localStorage.setItem('currentUser', name);
    localStorage.setItem('gameCode', code);
    window.location.href = 'play.html';
  } catch (err) {
    alert(err.message);
  }
}
