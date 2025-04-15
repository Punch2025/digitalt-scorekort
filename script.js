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
  localStorage.setItem('players', JSON.stringify(players));
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
    input.value = players[index];
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
  showPage('scorecard-page');
  generateScorecard();
  localStorage.setItem('currentPage', 'scorecard-page');
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
      input.dataset.hole = h;
      input.dataset.player = pIndex;
      input.value = getSavedScore(h, pIndex);
      input.oninput = () => {
        if (parseInt(input.value) > 9) {
          alert("Högst 9 slag per hål, har du mer än så bör du träna lite..");
          input.value = '';
          return;
        }
        saveScore(h, pIndex, input.value);
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

  // 🔽 Banner och ny runda-knapp
  const banner = document.createElement('div');
  banner.className = 'scorecard-banner';
  banner.innerHTML = `
    <p>Hungrig? Ring oss för att boka bord eller beställa take away pizza!</p>
    <a href="tel:03533455" class="call-button">Ring</a>
  `;
  container.appendChild(banner);

  const restartButton = document.createElement('button');
  restartButton.textContent = 'Ny runda';
  restartButton.className = 'restart-button';
  restartButton.onclick = () => {
    if (confirm('Är du säker på vi ska börja om?')) {
      localStorage.clear();
      location.reload();
    }
  };
  container.appendChild(restartButton);

  updateTeamTotal();
}

function updateTeamTotal() {
  let teamTotal = 0;
  for (let h = 1; h <= holes; h++) {
    let holeSum = 0;
    players.forEach((_, pIndex) => {
      const input = document.querySelector(`input[data-hole='${h}'][data-player='${pIndex}']`);
      if (input && input.value) holeSum += parseInt(input.value);
    });
    const totalCell = document.querySelectorAll('.hole-total')[h - 1];
    totalCell.textContent = holeSum;
    teamTotal += holeSum;
  }

  players.forEach((_, pIndex) => {
    let playerTotal = 0;
    const inputs = document.querySelectorAll(`input[data-player='${pIndex}']`);
    inputs.forEach(input => {
      if (input.value) playerTotal += parseInt(input.value);
    });
    document.getElementById(`player-total-${pIndex}`).textContent = playerTotal;
  });

  document.getElementById('team-total').textContent = teamTotal;
}

function saveScore(hole, player, value) {
  const scoreData = JSON.parse(localStorage.getItem('scores') || '{}');
  if (!scoreData[hole]) scoreData[hole] = {};
  scoreData[hole][player] = value;
  localStorage.setItem('scores', JSON.stringify(scoreData));
}

function getSavedScore(hole, player) {
  const scoreData = JSON.parse(localStorage.getItem('scores') || '{}');
  return scoreData[hole]?.[player] || '';
}

window.onload = function () {
  const savedTeam = localStorage.getItem('teamName');
  const savedPlayers = localStorage.getItem('players');
  const savedPage = localStorage.getItem('currentPage');

  // Kontrollera om det finns sparade data och gå till rätt sida
  if (savedTeam && savedPlayers && savedPage === 'scorecard-page') {
    teamName = savedTeam;
    players = JSON.parse(savedPlayers);
    showPage('scorecard-page');
    generateScorecard();
  } else {
    showPage('page1');
  }

  const btn1 = document.getElementById("goToPage2");
  const btn2 = document.getElementById("goToPage3");
  const btn3 = document.getElementById("startGame");

  if (btn1) btn1.addEventListener("click", goToPlayerCount);
  if (btn2) btn2.addEventListener("click", goToPlayerNames);
  if (btn3) btn3.addEventListener("click", startGame);
};
