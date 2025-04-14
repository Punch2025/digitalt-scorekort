let players = []; // Array för att lagra spelarnamn och slag
let holes = 12; // Antal hål

// Skapa scorekortet dynamiskt baserat på antalet spelare
function generateScorecard() {
  let tbody = document.getElementById('scorecard-body');
  tbody.innerHTML = ''; // Rensa tidigare resultat

  for (let hole = 1; hole <= holes; hole++) {
    let row = `<tr>
                <td>Hål ${hole}</td>`;
    for (let i = 0; i < players.length; i++) {
      row += `<td><input type="number" min="1" max="9" placeholder="Slag" oninput="updateTotal(${hole}, ${i})"></td>`;
    }
    row += `<td class="total" id="total-hole-${hole}">0</td></tr>`;
    tbody.innerHTML += row;
  }
}

// Uppdatera totalslag per hål
function updateTotal(hole, playerIndex) {
  let total = 0;
  let inputs = document.querySelectorAll(`tr:nth-child(${hole}) input`);
  inputs.forEach(input => {
    if (input.value) {
      total += parseInt(input.value);
    }
  });
  document.getElementById(`total-hole-${hole}`).innerText = total;

  // Uppdatera totalen för hela laget
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

// Funktion för att sätta spelarnamn och börja spelet
function startGame() {
  let numPlayers = parseInt(document.getElementById('player-count').value);
  players = [];
  for (let i = 0; i < numPlayers; i++) {
    let playerName = prompt(`Ange namn för Spelare ${i + 1}`);
    players.push(playerName);
  }

  generateScorecard();
}

