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
function renderPlayerNames() {
  playerNames = new Array(playerCount).fill('');
  app.innerHTML = `
    <div class="container">
      <h2>Ange namn på spelarna</h2>
      ${playerNames.map((_, i) => `
        <input type="text" id="player-${i}" placeholder="Spelare ${i + 1}" /><br>
      `).join('')}
      <button onclick="startGame()">Starta Spel</button>
    </div>
  `;
}

function startGame() {
  playerNames = playerNames.map((_, i) => {
    const nameInput = document.getElementById(`player-${i}`);
    return nameInput.value.trim() || `Spelare ${i + 1}`;
  });

  // Initiera tomma score-array
  scores = playerNames.map(() => new Array(12).fill(''));

  renderScorecard();
}

function renderScorecard() {
  let tableRows = '';

  // Rubrikrad (Hålnummer)
  tableRows += '<tr><th>Spelare</th>';
  for (let h = 1; h <= 12; h++) {
    tableRows += `<th>Hål ${h}</th>`;
  }
  tableRows += '<th>Slutresultat</th></tr>';

  // Spelarrader
  playerNames.forEach((name, i) => {
    tableRows += `<tr><td>${name}</td>`;
    for (let h = 0; h < 12; h++) {
      tableRows += `<td><input type="number" min="1" max="9" value="${scores[i][h] || ''}" 
        onchange="updateScore(${i}, ${h}, this)" /></td>`;
    }
    tableRows += `<td id="player-total-${i}">0</td></tr>`;
  });

  // Lagkolumn
  tableRows += `<tr><th>${teamName}</th>`;
  for (let h = 0; h < 12; h++) {
    tableRows += `<td></td>`;
  }
  tableRows += `<td id="team-total">0</td></tr>`;

  app.innerHTML = `
    <div class="container scorecard">
      <table>${tableRows}</table>
      <div style="text-align: left;">
        ${playerCount < 6 ? '<button onclick="addPlayer()">Lägg till spelare</button>' : ''}
        ${playerCount > 1 ? '<button onclick="removePlayer()">Ta bort spelare</button>' : ''}
      </div>
      <div class="banner">
        Hungrig? Meddela vår hovmästare för att få ett bord i restaurangen. <br>
        Är tiden knapp? Ring oss på 035-334 55 och beställ vår fantastiska pizza takeaway!
      </div>
    </div>
  `;
  updateTotals();
}

function updateScore(playerIndex, holeIndex, input) {
  let value = parseInt(input.value);
  if (value > 9) {
    alert('Högst 9 slag per hål, har du mer än så bör du träna lite..');
    input.value = '';
    return;
  }
  if (value < 1 || isNaN(value)) {
    input.value = '';
    return;
  }
  scores[playerIndex][holeIndex] = value;
  updateTotals();
}

function updateTotals() {
  let teamTotal = 0;

  playerNames.forEach((_, i) => {
    const total = scores[i].reduce((sum, s) => sum + (parseInt(s) || 0), 0);
    document.getElementById(`player-total-${i}`).innerText = total;
    teamTotal += total;
  });

  document.getElementById('team-total').innerText = teamTotal;
}

function addPlayer() {
  if (playerCount >= 6) return;
  playerNames.push(`Spelare ${playerCount + 1}`);
  scores.push(new Array(12).fill(''));
  playerCount++;
  renderScorecard();
}

function removePlayer() {
  if (playerCount <= 1) return;
  playerNames.pop();
  scores.pop();
  playerCount--;
  renderScorecard();
}

renderTeamInput();
