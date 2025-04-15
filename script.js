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
  // Spara lagets namn i localStorage
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
  // Spara antal spelare i localStorage
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
    input.oninput = () => {
      players[index] = input.value;
      // Spara spelarnamn i localStorage
      localStorage.setItem(`player${index}`, input.value);
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

  // Uppdatera lagets total för varje hål (kolumnen längst till höger i varje rad)
  for (let h = 1; h <= holes; h++) {
    let holeTotal = 0;
    const row = document.querySelector(`.scorecard tr:nth-child(${h + 1})`);
    if (row) {
      const inputs = row.querySelectorAll('td input');
      inputs.forEach(input => {
        if (input.value) holeTotal += parseInt(input.value);
      });
      const teamCell = row.querySelector('.hole-total');
      if (teamCell) teamCell.textContent = holeTotal;
    }
  }

  document.getElementById('team-total').textContent = teamTotal;
}

// ⭐ Vänta tills sidan är laddad innan vi kopplar knapparna
window.onload = function () {
  const btn1 = document.getElementById("goToPage2");
  const btn2 = document.getElementById("goToPage3");
  const btn3 = document.getElementById("startGame");

  // Ladda data från localStorage om den finns
  if (localStorage.getItem('teamName')) {
    teamName = localStorage.getItem('teamName');
  }
  if (localStorage.getItem('numPlayers')) {
    const count = localStorage.getItem('numPlayers');
    players = new Array(count).fill("");
  }

  players.forEach((_, index) => {
    if (localStorage.getItem(`player${index}`)) {
      players[index] = localStorage.getItem(`player${index}`);
    }
  });

  // Återställ sidan med lagdata från localStorage
  if (btn1) btn1.addEventListener("click", goToPlayerCount);
  if (btn2) btn2.addEventListener("click", goToPlayerNames);
  if (btn3) btn3.addEventListener("click", startGame);
};
