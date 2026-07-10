const bracket = {};

fetch("data/last_updated.json")
  .then(response => response.json())
  .then(data => {

    const updateBox =
      document.getElementById("last-updated");

    const updated =
      new Date(data.updated);

    const bdTime =
      updated.toLocaleString(
        "en-BD",
        {
          timeZone: "Asia/Dhaka",
          dateStyle: "medium",
          timeStyle: "short"
        }
      );

    updateBox.textContent =
      `Last updated: ${bdTime}`;
  });

fetch("data/standings.json")
  .then(response => response.json())
  .then(groups => {

    const container =
      document.getElementById("groups");

    for (const group in groups) {

      const card =
        document.createElement("div");

      card.className = "group-card";

      const title =
        document.createElement("h3");

      title.textContent = group;

      const table =
        document.createElement("table");

      table.className = "standings-table";

      table.innerHTML = `
        <tr>
          <th>Pos</th>
          <th>Team</th>
          <th>MP</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GD</th>
          <th>Pts</th>
        </tr>
      `;

      groups[group].forEach(team => {

        const row =
          document.createElement("tr");

       row.innerHTML = `
  <td>${team.position}</td>

  <td class="team-cell">
    <img
      class="group-logo"
      src="${team.crest}"
      alt=""
    >
    ${team.team}
  </td>

  <td>${team.playedGames}</td>
  <td>${team.won}</td>
  <td>${team.draw}</td>
  <td>${team.lost}</td>
  <td>${
    team.goalDifference > 0
      ? "+" + team.goalDifference
      : team.goalDifference
  }</td>
  <td>${team.points}</td>
`;

        table.appendChild(row);

      });

      card.appendChild(title);
      card.appendChild(table);

      container.appendChild(card);

    }

  });

function createBracketMatch(match) {

  const game =
    document.createElement("div");

  game.className = "bracket-match";

  const home =
    match.home || "TBD";

  const away =
    match.away || "TBD";

  const date =
    new Date(match.time)
      .toLocaleString(
        "en-BD",
        {
          timeZone: "Asia/Dhaka",
          dateStyle: "medium",
          timeStyle: "short"
        }
      );

  let matchup = "";

  if (
    match.homeScore !== null &&
    match.awayScore !== null
  ) {

    const homeClass =
      match.homeScore > match.awayScore
        ? "bracket-winner"
        : "bracket-loser";

    const awayClass =
      match.awayScore > match.homeScore
        ? "bracket-winner"
        : "bracket-loser";

    matchup = `

<div class="knockout-home ${homeClass}">

  ${
    match.homeCrest
      ? `<img class="team-logo bracket-logo" src="${match.homeCrest}" alt="">`
      : ""
  }

  <div>${home}</div>

</div>

<div class="knockout-score">

  <span class="bracket-score">
    ${match.homeScore}
  </span>

  :

  <span class="bracket-score">
    ${match.awayScore}
  </span>

</div>

<div class="knockout-away ${awayClass}">

  ${
    match.awayCrest
      ? `<img class="team-logo bracket-logo" src="${match.awayCrest}" alt="">`
      : ""
  }

  <div>${away}</div>

</div>

`;

  }

  else {

    matchup = `

<div class="knockout-home">

  ${
    match.homeCrest
      ? `<img class="team-logo bracket-logo" src="${match.homeCrest}" alt="">`
      : ""
  }

  <div>${home}</div>

</div>

<div class="knockout-score">
  <span class="vs-text">vs</span>
</div>

<div class="knockout-away">

  ${
    match.awayCrest
      ? `<img class="team-logo bracket-logo" src="${match.awayCrest}" alt="">`
      : ""
  }

  <div>${away}</div>

</div>

`;

  }

  game.innerHTML = `

<div class="bracket-teams">

${matchup}

</div>

<div class="bracket-date">

${date}

</div>

`;

  match.element = game;

  return game;

}

fetch("data/matches.json")
  .then(response => response.json())
  .then(matches => {

    const todayContainer =
      document.getElementById("today-matches");

    const upcomingContainer =
      document.getElementById("upcoming-matches");

    const bracketContainer = 
      document.getElementById("bracket");

    const bdToday = new Date()
      .toLocaleDateString(
        "en-CA",
        { timeZone: "Asia/Dhaka" }
      );

    let nextMatchDay = null;

    matches.forEach(match => {

      const matchDate = new Date(match.time);

      const matchDay =
        matchDate.toLocaleDateString(
          "en-CA",
          { timeZone: "Asia/Dhaka" }
        );

      if (matchDay > bdToday) {

        if (
          nextMatchDay === null ||
          matchDay < nextMatchDay
        ) {
          nextMatchDay = matchDay;
        }
      }
      
    });

    matches.forEach(match => {

      const matchDate = new Date(match.time);

      const matchDay =
        matchDate.toLocaleDateString(
          "en-CA",
          { timeZone: "Asia/Dhaka" }
        );

      const bdTime =
        matchDate.toLocaleString(
          "en-BD",
          {
            timeZone: "Asia/Dhaka",
            dateStyle: "medium",
            timeStyle: "short"
          }
        );

      const card =
        document.createElement("div");

      let matchDisplay = "";

if (
  match.homeScore !== null &&
  match.awayScore !== null
) {

  matchDisplay =
    `${match.home} ${match.homeScore}
     - ${match.awayScore} ${match.away}`;

} else {

  matchDisplay =
    `${match.home} vs ${match.away}`;

}

let statusText = "Scheduled";
let statusClass = "status-scheduled";

if (match.status === "IN_PLAY") {
  statusText = "LIVE";
  statusClass = "status-live";
}

if (match.status === "FINISHED") {
  statusText = "FT";
  statusClass = "status-finished";
}

card.innerHTML = `
  <div class="match-status ${statusClass}">
    ${statusText}
  </div>

  <div class="match-time">
    ${bdTime}
  </div>

  <div class="match-teams">

  <img
    class="team-logo"
    src="${match.homeCrest}"
    alt=""
  >

  ${matchDisplay}

  <img
    class="team-logo"
    src="${match.awayCrest}"
    alt=""
  >

</div>
`;

      if (matchDay === bdToday) {

  card.className =
    "match-card";

  todayContainer.appendChild(card);

}

else if (matchDay === nextMatchDay) {

  card.className =
    "match-card upcoming-card";

  upcomingContainer.appendChild(card);

}
    });

if (todayContainer.children.length === 0) {

  const message = document.createElement("p");

  message.textContent =
    "No matches today.";

  todayContainer.appendChild(message);

}

const stageNames = {
  LAST_32: "Round of 32",
  LAST_16: "Round of 16",
  QUARTER_FINALS: "Quarterfinals",
  SEMI_FINALS: "Semifinals",
  FINAL: "Final",
  THIRD_PLACE: "Third Place"
};

const rounds = {
  LAST_32: matches.filter(m => m.stage === "LAST_32"),
  LAST_16: matches.filter(m => m.stage === "LAST_16"),
  QUARTER_FINALS: matches.filter(m => m.stage === "QUARTER_FINALS"),
  SEMI_FINALS: matches.filter(m => m.stage === "SEMI_FINALS"),
  FINAL: matches.filter(m => m.stage === "FINAL"),
  THIRD_PLACE: matches.filter(m => m.stage === "THIRD_PLACE")
};

function createStage(stageClass, title, stageMatches) {

    if (stageMatches.length === 0) {
        return null;
    }

    const section = document.createElement("div");
    section.className = `bracket-stage ${stageClass}`;

    const heading = document.createElement("h3");
    heading.textContent = title;

    const grid = document.createElement("div");
    grid.className = "stage-grid";

    const rowMap = {

        last_32:         [1, 3, 5, 7, 9, 11, 13, 15],

        last_16:         [2, 6, 10, 14],

        quarter_finals:  [4, 12],

        semi_finals:     [8],

        final:           [2],

        third_place:     [1]

    };

    stageMatches.forEach((match, index) => {

        const game =
            createBracketMatch(match);

        game.style.gridRow =
            rowMap[stageClass][index];

        grid.appendChild(game);

    });

    section.appendChild(heading);
    section.appendChild(grid);

    return section;
}

const matchById = {};

matches.forEach(match => {
  matchById[match.id] = match;
});

bracket.leftR32 = [
  537417,
  537418,
  537415,
  537416,
  537422,
  537421,
  537420,
  537419
].map(id => matchById[id]);

bracket.rightR32 = [
  537423,
  537424,
  537425,
  537426,
  537429,
  537430,
  537428,
  537427
].map(id => matchById[id]);

bracket.leftR16 = [
  537376,
  537375,
  537380,
  537379
].map(id => matchById[id]);

bracket.rightR16 = [
  537377,
  537378,
  537382,
  537381
].map(id => matchById[id]);

bracket.leftQF = [
  537383,
  537384
].map(id => matchById[id]);

bracket.rightQF = [
  537385,
  537386
].map(id => matchById[id]);

bracket.leftSF = [
  537387
].map(id => matchById[id]);

bracket.rightSF = [
  537388
].map(id => matchById[id]);

bracket.finalMatch = [
  537390
].map(id => matchById[id]);

bracket.thirdPlace = [
  537389
].map(id => matchById[id]);

bracketContainer.appendChild(
  createStage(
    "last_32",
    stageNames.LAST_32,
    bracket.leftR32
  )
);

bracketContainer.appendChild(
  createStage(
    "last_16",
    stageNames.LAST_16,
    bracket.leftR16
  )
);

bracketContainer.appendChild(
  createStage(
    "quarter_finals",
    stageNames.QUARTER_FINALS,
    bracket.leftQF
  )
);

bracketContainer.appendChild(
  createStage(
    "semi_finals",
    stageNames.SEMI_FINALS,
    bracket.leftSF
  )
);

const centerStage =
  document.createElement("div");

centerStage.className =
  "center-stage";

centerStage.innerHTML = `

<div class="center-label final-label">
  Final
</div>

<div class="center-final"></div>

<div class="center-label third-label">
  Third Place Match
</div>

<div class="center-third"></div>

`;

centerStage
  .querySelector(".center-final")
  .appendChild(
    createBracketMatch(bracket.finalMatch[0])
  );

centerStage
  .querySelector(".center-third")
  .appendChild(
    createBracketMatch(bracket.thirdPlace[0])
  );

bracketContainer.appendChild(centerStage);

bracketContainer.appendChild(
  createStage(
    "semi_finals",
    stageNames.SEMI_FINALS,
    bracket.rightSF
  )
);

bracketContainer.appendChild(
  createStage(
    "quarter_finals",
    stageNames.QUARTER_FINALS,
    bracket.rightQF
  )
);

bracketContainer.appendChild(
  createStage(
    "last_16",
    stageNames.LAST_16,
    bracket.rightR16
  )
);

bracketContainer.appendChild(
  createStage(
    "last_32",
    stageNames.LAST_32,
    bracket.rightR32
  )
);

drawBracketLines();

  });

function drawConnector(fromMatch, toMatch) {

    const svg =
        document.getElementById("bracket-lines");

    const wrapper =
        document
            .getElementById("bracket-wrapper")
            .getBoundingClientRect();

    const a =
        fromMatch.getBoundingClientRect();

    const b =
        toMatch.getBoundingClientRect();

    const x1 =
        a.right - wrapper.left;

    const y1 =
        a.top + a.height / 2 - wrapper.top;

    const x2 =
        b.left - wrapper.left;

    const y2 =
        b.top + b.height / 2 - wrapper.top;

    const midX =
        (x1 + x2) / 2;

    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

    path.setAttribute(
        "d",
        `
M ${x1} ${y1}
L ${midX} ${y1}
L ${midX} ${y2}
L ${x2} ${y2}
`
    );

    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#888");
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");

    svg.appendChild(path);

}

function drawBracketLines() {

    const svg =
        document.getElementById("bracket-lines");

    svg.innerHTML = "";

   // ---------- LEFT R32 → LEFT R16 ----------

drawConnector(bracket.leftR32[0].element, bracket.leftR16[0].element);
drawConnector(bracket.leftR32[1].element, bracket.leftR16[0].element);

drawConnector(bracket.leftR32[2].element, bracket.leftR16[1].element);
drawConnector(bracket.leftR32[3].element, bracket.leftR16[1].element);

drawConnector(bracket.leftR32[4].element, bracket.leftR16[2].element);
drawConnector(bracket.leftR32[5].element, bracket.leftR16[2].element);

drawConnector(bracket.leftR32[6].element, bracket.leftR16[3].element);
drawConnector(bracket.leftR32[7].element, bracket.leftR16[3].element);


// ---------- LEFT R16 → LEFT QF ----------

drawConnector(bracket.leftR16[0].element, bracket.leftQF[0].element);
drawConnector(bracket.leftR16[1].element, bracket.leftQF[0].element);

drawConnector(bracket.leftR16[2].element, bracket.leftQF[1].element);
drawConnector(bracket.leftR16[3].element, bracket.leftQF[1].element);


// ---------- LEFT QF → LEFT SF ----------

drawConnector(bracket.leftQF[0].element, bracket.leftSF[0].element);
drawConnector(bracket.leftQF[1].element, bracket.leftSF[0].element);
    
// ---------- RIGHT R32 → RIGHT R16 ----------

drawConnector(bracket.rightR32[0].element, bracket.rightR16[0].element);
drawConnector(bracket.rightR32[1].element, bracket.rightR16[0].element);

drawConnector(bracket.rightR32[2].element, bracket.rightR16[1].element);
drawConnector(bracket.rightR32[3].element, bracket.rightR16[1].element);

drawConnector(bracket.rightR32[4].element, bracket.rightR16[2].element);
drawConnector(bracket.rightR32[5].element, bracket.rightR16[2].element);

drawConnector(bracket.rightR32[6].element, bracket.rightR16[3].element);
drawConnector(bracket.rightR32[7].element, bracket.rightR16[3].element);


// ---------- RIGHT R16 → RIGHT QF ----------

drawConnector(bracket.rightR16[0].element, bracket.rightQF[0].element);
drawConnector(bracket.rightR16[1].element, bracket.rightQF[0].element);

drawConnector(bracket.rightR16[2].element, bracket.rightQF[1].element);
drawConnector(bracket.rightR16[3].element, bracket.rightQF[1].element);


// ---------- RIGHT QF → RIGHT SF ----------

drawConnector(bracket.rightQF[0].element, bracket.rightSF[0].element);
drawConnector(bracket.rightQF[1].element, bracket.rightSF[0].element);

// ---------- SEMIFINALS → FINAL ----------

drawConnector(
    bracket.leftSF[0].element,
    bracket.finalMatch[0].element
);

drawConnector(
    bracket.rightSF[0].element,
    bracket.finalMatch[0].element
);

}

const zoomLevels = [
    0.45,
    0.5,
    0.75,
    1,
    1.25,
    1.5,
    1.75,
    2
];

let zoomIndex = 2;

function updateZoom(){

    const zoom =
        zoomLevels[zoomIndex];

    document
        .getElementById("zoom-layer")
        .style.transform =
        `scale(${zoom})`;

    document
        .getElementById("zoom-level")
        .textContent =
        `${Math.round(zoom*100)}%`;


}

document
.getElementById("zoom-in")
.onclick = () => {

    if(zoomIndex < zoomLevels.length-1){

        zoomIndex++;

        updateZoom();

    }

};

document
.getElementById("zoom-out")
.onclick = () => {

    if(zoomIndex > 0){

        zoomIndex--;

        updateZoom();

    }

};

document
.getElementById("zoom-reset")
.onclick = () => {

    zoomIndex = 2;

    updateZoom();

};

window.addEventListener("resize", drawBracketLines);