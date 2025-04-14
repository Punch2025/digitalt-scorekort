let teamName = '';
let playerCount = 1;
let playerNames = [];
let scores = [];

const app = document.getElementById('app');

function renderTeamInput() {
  app.innerHTML = `
    <div class="container">
      <img src="logo.png" alt="Punch Restaurang & Minigolf" class="logo" />
      <h1>Välkommen till Punch Restaurang & Minigolf</h1>
      <input type="text" id="team-name" placeholder="Ange lagnamn" />
      <button onclick="submitTeamName()">Fortsätt</button>
    </div>
  `;
}

function submitTeamName() {
  const input = document.getElementById('team-name');
  teamName = input.value.trim();
  if (!teamName) {
    alert('Ange ett lagnamn för att fortsätta.');
    return;
  }
  renderPlayerCount();
}

function renderPlayerCount() {
  app.innerHTML = `
    <div class="container">
      <img src="logo.png" alt="Punch Restaurang & Minigolf" class="logo" />
      <h2>Hur många spelar?</h2>
      <input type="number" id="player-count" min="1" max="6" value="1" />
      <button onclick="submitPlayerCount()">Fortsätt</button>
    </div>
  `;
}

function submitPlayerCount() {
  const input = document.getElementById('player-count');
  const count = parseInt(input.value);
  if (isNaN(count) || count < 1 || count > 6) {
    alert('Ange ett giltigt antal spelare (1–6).');
    return;
  }
  playerCount = count;
  renderPlayerNames();
}

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

  scores = playerNames.map(() => new Array(12).fill(''));
  renderScorecard();
}

function renderScorecard() {
  app.innerHTML = `
    <div class="container">
      <h2>${teamName}</h2>
      <div class="scorecard-wrapper">
        <table class="scorecard">
          <thead>
            <tr>
              <th>Spelare</th>
              ${Array.from({ length: 12 }, (_, i) => `<th>Hål ${i + 1}</th>`).join('')}
              <th>Totalt</th>
            </tr>
          </thead>
          <tbody>
            ${playerNames.map((name, playerIndex) => `
              <tr>
                <td>${name}</td>
                ${Array.from({ length: 12 }, (_, holeIndex) => `
                  <td>
                    <input type="number" min="1" max="9" value="${scores[playerIndex][holeIndex] || ''}" onchange="updateScore(${playerIndex}, ${holeIndex}, this)" />
                  </td>
                `).join('')}
                <td id="player-total-${playerIndex}">0</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="team-total">
          <strong>Lagresultat:</strong> <span id="team-total">0</span> slag
        </div>
        <div class="controls">
          ${playerCount < 6 ? '<button onclick="addPlayer()">Lägg till spelare</button>' : ''}
          ${playerCount > 1 ? '<button onclick="removePlayer()">Ta bort spelare</button>' : ''}
        </div>
        <div class="banner">
          Hungrig? Meddela vår hovmästare för att få ett bord i restaurangen. <br>
          Är tiden knapp? Ring oss på 035-334 55 och beställ vår fantastiska pizza takeaway!
        </div>
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
