let players = [];
let teamName = "";
const holes = 12;

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';
}

function goToPlayerCount() {
  const input = document.getElementById('teamName');
  if (!input.value.trim()) {
    alert("Ange ett lagnamn.");
    return;
  }
  teamName = input.value.trim();
  localStorage.setItem('teamName', teamName);
  showPage('page2');
}

function goToPlayerNames() {
  const count = parseInt(document.getElementById('numPlayers').value);
  if (isNaN(count) || count < 1 || count > 6) {
    alert("Ange ett giltigt antal spelare (1-6).");
    return;
  }
  players = new Array(count).fill("");
  localStorage.setItem('numPlayers', count);
  showPage('page3');
  generatePlayerInputs();
}

function generatePlayerInputs() {
  const container = document.getElementById('player-names');
  container.innerHTML = "";

  players.forEach((_, index) => {
    const label = document.createElement('label');
    label.textContent = `Spelare ${index + 1}:`;
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = "Ange namn";
    input.value = players[index] || "";
    input.oninput = () => {
      players[index] = input.value;
      localStorage.setItem('players', JSON.stringify(players));
    };
    container.appendChild(label);
    container.appendChild(document.createElement('br'));
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
  });
}

function startGame() {
  localStorage.setItem('players', JSON.stringify(players));
  showPage('scorecard-page');
  generateScorecard();
}

function generateScorecard() {
  const container = document.getElementById('scorecard-container');
  container.innerHTML = "";

  const table = document.createElement('table');
  table.className = 'scorecard';

  const headerRow = document.createElement('tr');
  const holeHeader = document.createElement('th');
  holeHeader.textContent = "Hål";
  headerRow.appendChild(holeHeader);

  players.forEach(player => {
    const th = document.createElement('th');
    th.textContent = player || "Spelare";
    headerRow.appendChild(th);
  });

  const teamTotalHeader = document.createElement('th');
  teamTotalHeader.textContent = teamName;
  headerRow.appendChild(teamTotalHeader);

  table.appendChild(headerRow);

  const savedScores = JSON.parse(localStorage.getItem('scores')) || [];

  for (let h = 1; h <= holes; h++) {
    const row = document.createElement('tr');
    const holeCell = document.createElement('td');
    holeCell.textContent = `Hål ${h}`;
    row.appendChild(holeCell);

    players.forEach((_, pIndex) => {
      const cell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '1';
      input.max = '9';
      input.placeholder = '-';
      const saved = savedScores[h - 1]?.[pIndex];
      if (saved !== undefined) input.value = saved;

      input.oninput = () => {
        if (parseInt(input.value) > 9) {
          alert("Högst 9 slag per hål, har du mer än så bör du träna lite..");
          input.value = '';
          return;
        }
        saveScores();
        updateTeamTotal();
      };

      cell.appendChild(input);
      row.appendChild(cell);
    });

    const totalCell = document.createElement('td');
    totalCell.className = 'hole-total';
    totalCell.textContent = calculateHoleTotal(h - 1);
    row.appendChild(totalCell);

    table.appendChild(row);
  }

  const totalRow = document.createElement('tr');
  const totalLabelCell = document.createElement('td');
  totalLabelCell.textContent = "Slutresultat";
  totalRow.appendChild(totalLabelCell);

  players.forEach((_, index) => {
    const cell = document.createElement('td');
    cell.id = `player-total-${index}`;
    cell.textContent = calculatePlayerTotal(index);
    totalRow.appendChild(cell);
  });

  const teamTotalCell = document.createElement('td');
  teamTotalCell.id = 'team-total';
  teamTotalCell.textContent = calculateTeamTotal();
  totalRow.appendChild(teamTotalCell);

  table.appendChild(totalRow);
  container.appendChild(table);
}

function saveScores() {
  const scores = [];

  for (let h = 0; h < holes; h++) {
    const row = [];
    players.forEach((_, pIndex) => {
      const input = document.querySelectorAll('.scorecard tr')[h + 1].querySelectorAll('td')[pIndex + 1].querySelector('input');
      row.push(input.value ? parseInt(input.value) : null);
    });
    scores.push(row);
  }

  localStorage.setItem('scores', JSON.stringify(scores));
}

function updateTeamTotal() {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];

  // Per spelare
  players.forEach((_, pIndex) => {
    let total = 0;
    for (let h = 0; h < holes; h++) {
      if (scores[h] && scores[h][pIndex] != null) total += scores[h][pIndex];
    }
    const el = document.getElementById(`player-total-${pIndex}`);
    if (el) el.textContent = total;
  });

  // Per hål
  const table = document.querySelector('.scorecard');
  for (let h = 0; h < holes; h++) {
    let holeTotal = 0;
    players.forEach((_, pIndex) => {
      if (scores[h] && scores[h][pIndex] != null) holeTotal += scores[h][pIndex];
    });
    const totalCell = table.rows[h + 1].querySelector('.hole-total');
    if (totalCell) totalCell.textContent = holeTotal;
  }

  // Totalt lag
  document.getElementById('team-total').textContent = calculateTeamTotal();
}

function calculateTeamTotal() {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  return scores.reduce((sum, row) => sum + row.reduce((rSum, val) => rSum + (val || 0), 0), 0);
}

function calculatePlayerTotal(pIndex) {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  return scores.reduce((sum, row) => sum + (row[pIndex] || 0), 0);
}

function calculateHoleTotal(hIndex) {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  if (!scores[hIndex]) return 0;
  return scores[hIndex].reduce((sum, val) => sum + (val || 0), 0);
}

window.onload = function () {
  const btn1 = document.getElementById("goToPage2");
  const btn2 = document.getElementById("goToPage3");
  const btn3 = document.getElementById("startGame");

  if (btn1) btn1.addEventListener("click", goToPlayerCount);
  if (btn2) btn2.addEventListener("click", goToPlayerNames);
  if (btn3) btn3.addEventListener("click", startGame);

  // Återställ från localStorage
  const savedTeam = localStorage.getItem('teamName');
  const savedPlayers = JSON.parse(localStorage.getItem('players') || "[]");

  if (savedTeam && savedPlayers.length > 0) {
    teamName = savedTeam;
    players = savedPlayers;
    showPage('scorecard-page');
    generateScorecard();
    updateTeamTotal();
  }
};
