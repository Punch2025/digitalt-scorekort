let players = []; // Array för att lagra spelarnamn och slag
let holes = 12; // Antal hål

// Byt sida och visa den angivna sidan
function showPage(pageId) {
  // Dölj alla sidor
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = 'none';
  });
  // Visa den valda sidan
  document.getElementById(pageId).style.display = 'block';
}

// Funktion för att gå till sidan där antal spelare väljs
function goToPlayerCount() {
  const teamName = document.getElementById('team-name').value.trim();
  if (teamName === "") {
    alert("Fyll i ett lagnamn för att fortsätta.");
    return;
  }
  showPage('player-count-page');
}

// Funktion för att gå till sidan där spelarnamn fylls i
function goToPlayerNames() {
  const playerCount = parseInt(document.getElementById('player-count').value);
  players = [];
  for (let i = 0; i < playerCount; i++) {
    const playerName = prompt(`Ange namn för Spelare ${i + 1}`);
    players.push(playerName);
  }
  showPage('player-names-page');
  generatePlayerNameInputs();
}

// Generera inputfält för spelarnamn
function generatePlayerNameInputs() {
  const container = document.getElementById('player-names');
  container.innerHTML = ''; // Rensa tidigare inputs
  players.forEach((player, index) => {
    const label = document.createElement('label');
    label.textContent = `Spelare ${index + 1}:`;
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Ange namn för ${player}`;
    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
  });
}

// Funktion för att starta spelet och visa scorekortet
function startGame() {
  const playerInputs = document.querySelectorAll('#player-names input');
  playerInputs.forEach((input, index) => {
    players[index] = input.value.trim() || players[index];
  });

  showPage('scorecard-page');
  generateScorecard();
}

// Skapa scorekortet dynamiskt baserat på antal spelare
function generateScorecard() {
  const tbody = document.getElementById('scorecard-container');
  tbody.innerHTML = ''; // Rensa tidigare scorekort

  let scorecardHtml = '<table class="scorecard"><thead><tr><th>Hål</th>';
  players.forEach((player, index) => {
    scorecardHtml += `<th>${player}</th>`;
  });
  scorecardHtml += '<th>Totalt</th></tr></thead><tbody>';

  for (let hole = 1; hole <= holes; hole++) {
    scorecardHtml += `<tr><td>Hål ${hole}</td>`;
    players.forEach(() => {
      scorecardHtml += `<td><input type="number" min="1" max="9" placeholder="Slag" oninput="updateTotal(${hole})"></td>`;
    });
    scorecardHtml += `<td class="total" id="total-hole-${hole}">0</td></tr>`;
  }

  scorecardHtml += '</tbody></table>';
  tbody.innerHTML = scorecardHtml;
}

// Uppdatera totalslag per hål
function updateTotal(hole) {
  let total = 0;
  const inputs = document.querySelectorAll(`tr:nth-child(${hole + 1}) input`);
  inputs.forEach(input => {
    if (input.value) {
      total += parseInt(input.value);
    }
  });
  document.getElementById(`total-hole-${hole}`).innerText = total;

  // Uppdatera lagets totala poäng
  updateTeamTotal();
}

// Uppdatera lagets totala poäng
function updateTeamTotal() {
  let totalScore = 0;
  for (let hole = 1; hole <= holes; hole++) {
    totalScore += parseInt(document.getElementById(`total-hole-${hole}`).innerText) || 0;
  }
  document.getElementById('team-total').innerText = totalScore;
}
