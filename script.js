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
  const input = document.getElementById('team-name');
  if (!input.value.trim()) {
    alert("Ange ett lagnamn.");
    return;
  }
  teamName = input.value.trim();
  showPage('player-count-page');
}

function goToPlayerNames() {
  const count = parseInt(document.getElementById('player-count').value);
  players = new Array(count).fill("");
  showPage('player-names-page');
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
    input.oninput = () => {
      players[index] = input.value;
    };
    container.appendChild(label);
    container.appendChild(document.createElement('br'));
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
  });
}

function startGame() {
  showPage('scorecard-page');
  generateScorecard();
}

function generateScorecard() {
  const container = document.getElementById('scorecard-container');
  container.innerHTML = "";

  const table = document.createElement('table');
  table.className = 'scorecard';

  // Header
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

  // Hål-rader
  for (let h = 1; h <= holes; h++) {
    const row = document.createElement('tr');
    const holeCell = document.createElement('td');
    holeCell.textContent = `Hål ${h}`;
    row.appendChild(holeCell);

    let rowTotal = 0;

    players.forEach((_, pIndex) => {
      const cell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '1';
      input.max = '9';
      input.placeholder = '-';
      input.oninput = () => {
        if (parseInt(input.value) > 9) {
          alert("Högst 9 slag per hål, har du mer än så bör du träna lite..");
          input.value = '';
          return;
        }
        updateTeamTotal();
      };
      cell.appendChild(input);
      row.appendChild(cell);
    });

    const totalCell = document.createElement('td');
    totalCell.className = 'hole-total';
    totalCell.textContent = '0';
    row.appendChild(totalCell);

    table.appendChild(row);
  }

  // Lagets totalrad
  const totalRow = document.createElement('tr');
  const totalLabelCell = document.createElement('td');
  totalLabelCell.textContent = "Slutresultat";
  totalRow.appendChild(totalLabelCell);

  players.forEach((_, index) => {
    const cell = document.createElement('td');
    cell.id = `player-total-${index}`;
    cell.textContent = '0';
    totalRow.appendChild(cell);
  });

  const teamTotalCell = document.createElement('td');
  teamTotalCell.id = 'team-total';
  teamTotalCell.textContent = '0';
  totalRow.appendChild(teamTotalCell);

  table.appendChild(totalRow);

  container.appendChild(table);
}

function updateTeamTotal() {
  let teamTotal = 0;

  players.forEach((_, pIndex) => {
    let playerTotal = 0;
    const inputs = document.querySelectorAll(`.scorecard tr td:nth-child(${pIndex + 2}) input`);
    inputs.forEach(input => {
      if (input.value) playerTotal += parseInt(input.value);
    });
    document.getElementById(`player-total-${pIndex}`).textContent = playerTotal;
    teamTotal += playerTotal;
  });

  document.getElementById('team-total').textContent = teamTotal;
}
