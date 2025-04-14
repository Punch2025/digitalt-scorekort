let teamName = "";
let playerCount = 0;
let playerNames = [];
let scores = [];

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function goToPlayerCount() {
  teamName = document.getElementById('team-name').value.trim();
  if (teamName === "") {
    alert("Fyll i ett lagnamn för att fortsätta.");
    return;
  }
  console.log("Byter till player-count-page");
  showPage('player-count-page');
}

function goToPlayerNames() {
  playerCount = parseInt(document.getElementById('player-count').value);
  if (isNaN(playerCount) || playerCount < 1 || playerCount > 6) {
    alert("Välj mellan 1 och 6 spelare.");
    return;
  }

  const container = document.getElementById('player-names');
  container.innerHTML = "";
  for (let i = 0; i < playerCount; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Spelare ${i + 1}`;
    input.id = `player-${i}`;
    container.appendChild(input);
  }

  showPage('player-names-page');
}

function startGame() {
  playerNames = [];
  scores = [];

  for (let i = 0; i < playerCount; i++) {
    const name = document.getElementById(`player-${i}`).value.trim();
    if (name === "") {
      alert("Fyll i alla spelarnamn.");
      return;
    }
    playerNames.push(name);
    scores.push(Array(12).fill(1));
  }

  generateScorecard();
  showPage('scorecard-page');
}

function generateScorecard() {
  const container = document.getElementById('scorecard-container');
  container.innerHTML = "";

  // Logotyp överst på scorekortet
  const logoImg = document.createElement('img');
  logoImg.src = "logo.png";
  logoImg.alt = "Punch Restaurang & Minigolf Logga";
  logoImg.className = "scorecard-logo";
  container.appendChild(logoImg);

  const table = document.createElement('table');
  table.className = 'scorecard vertical-scorecard';

  // Första raden: Spelarnamn
  const headerRow = document.createElement('tr');
  const corner = document.createElement('th');
  corner.textContent = "Hål";
  headerRow.appendChild(corner);

  for (let hole = 0; hole < 12; hole++) {
    const th = document.createElement('th');
    th.textContent = `Hål ${hole + 1}`;
    headerRow.appendChild(th);
  }

  const teamHeader = document.createElement('th');
  teamHeader.textContent = teamName;
  headerRow.appendChild(teamHeader);

  table.appendChild(headerRow);

  // Spelarnas rader
  for (let player = 0; player < playerCount; player++) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = playerNames[player];
    row.appendChild(nameCell);

    for (let hole = 0; hole < 12; hole++) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.min = 1;
      input.max = 9;
      input.value = 1;
      input.addEventListener('input', (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 9) {
          alert("Högst 9 slag per hål, har du mer än så bör du träna lite..");
          val = 9;
        }
        scores[player][hole] = val;
        updateTotals();
        e.target.value = val;
      });
      td.appendChild(input);
      row.appendChild(td);
    }

    const totalCell = document.createElement('td');
    totalCell.id = `total-${player}`;
    totalCell.textContent = 12;
    row.appendChild(totalCell);

    table.appendChild(row);
  }

  // Slutresultat-rad
  const totalRow = document.createElement('tr');
  const label = document.createElement('td');
  label.textContent = "Slutresultat";
  totalRow.appendChild(label);

  for (let hole = 0; hole < 12; hole++) {
    const td = document.createElement('td');
    let holeTotal = 0;
    for (let player = 0; player < playerCount; player++) {
      holeTotal += scores[player][hole];
    }
    td.id = `hole-total-${hole}`;
    td.textContent = holeTotal;
    totalRow.appendChild(td);
  }

  const teamTotalTd = document.createElement('td');
  teamTotalTd.id = 'team-total';
  teamTotalTd.textContent = playerCount * 12;
  totalRow.appendChild(teamTotalTd);

  table.appendChild(totalRow);
  container.appendChild(table);

  const controls = document.createElement('div');
  controls.className = 'controls';

  if (playerCount < 6) {
    const addPlayerBtn = document.createElement('button');
    addPlayerBtn.textContent = 'Lägg till spelare';
    addPlayerBtn.onclick = () => alert("Funktionen för att lägga till spelare kommer snart!");
    controls.appendChild(addPlayerBtn);
  }

  const removePlayerBtn = document.createElement('button');
  removePlayerBtn.textContent = 'Ta bort spelare';
  removePlayerBtn.onclick = () => alert("Funktionen för att ta bort spelare kommer snart!");
  controls.appendChild(removePlayerBtn);

  container.appendChild(controls);

  const banner = document.createElement('div');
  banner.className = 'banner';
  banner.textContent = "Hungrig? Meddela vår hovmästare för att få ett bord i restaurangen. Är tiden knapp? Ring oss på 035-334 55 och beställ vår fantastiska pizza takeaway!";
  container.appendChild(banner);

  updateTotals();
}

function updateTotals() {
  let teamSum = 0;
  for (let player = 0; player < playerCount; player++) {
    const sum = scores[player].reduce((a, b) => a + b, 0);
    document.getElementById(`total-${player}`).textContent = sum;
    teamSum += sum;
  }
  document.getElementById('team-total').textContent = teamSum;

  for (let hole = 0; hole < 12; hole++) {
    let total = 0;
    for (let player = 0; player < playerCount; player++) {
      total += scores[player][hole];
    }
    document.getElementById(`hole-total-${hole}`).textContent = total;
  }
}

// Vänta tills HTML är redo
document.addEventListener('DOMContentLoaded', () => {
  showPage('start-page');
});
