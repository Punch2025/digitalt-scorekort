const app = document.getElementById('app');
let teamName = '';
let playerCount = 1;
let playerNames = [];
let scores = [];

function renderTeamInput() {
  app.innerHTML = `
    <div class="container">
      <img src="logo.png" alt="Logotyp" class="logo"/>
      <h1>Välkommen till Punch Restaurang & Minigolf</h1>
      <input type="text" id="teamName" placeholder="Ange lagnamn"/>
      <br>
      <button onclick="handleTeamName()">Nästa</button>
    </div>
  `;
}

function handleTeamName() {
  const input = document.getElementById('teamName');
  if (input.value.trim() === '') {
    alert('Ange ett lagnamn');
    return;
  }
  teamName = input.value.trim();
  renderPlayerCount();
}

function renderPlayerCount() {
  app.innerHTML = `
    <div class="container">
      <h2>Lagnamn: ${teamName}</h2>
      <label for="playerSelect">Hur många spelar?</label><br>
      <select id="playerSelect">
        ${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}">${n}</option>`).join('')}
      </select><br>
      <button onclick="handlePlayerCount()">Nästa</button>
    </div>
  `;
}

function handlePlayerCount() {
  const select = document.getElementById('playerSelect');
  playerCount = parseInt(select.value);
  renderPlayerNames();
}
