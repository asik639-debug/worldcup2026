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

  const section =
    document.createElement("div");

  section.className =
    `bracket-stage ${stageClass}`;

  const heading =
    document.createElement("h3");

  heading.textContent = title;

  section.appendChild(heading);

  stageMatches.forEach(match => {
    section.appendChild(
      createBracketMatch(match)
    );
  });

  return section;
}

const matchById = {};

matches.forEach(match => {
  matchById[match.id] = match;
});

const leftR32 = [
  537417,
  537418,
  537415,
  537416,
  537422,
  537421,
  537420,
  537419
].map(id => matchById[id]);

const rightR32 = [
  537423,
  537424,
  537425,
  537426,
  537429,
  537430,
  537428,
  537427
].map(id => matchById[id]);

const leftR16 = [
  537376,
  537375,
  537380,
  537379
].map(id => matchById[id]);

const rightR16 = [
  537377,
  537378,
  537382,
  537381
].map(id => matchById[id]);

const leftQF = [
  537383,
  537384
].map(id => matchById[id]);

const rightQF = [
  537385,
  537386
].map(id => matchById[id]);

const leftSF = [
  537387
].map(id => matchById[id]);

const rightSF = [
  537388
].map(id => matchById[id]);

const finalMatch = [
  537390
].map(id => matchById[id]);

const thirdPlace = [
  537389
].map(id => matchById[id]);

const leftSide =
  document.createElement("div");

leftSide.className =
  "bracket-side left-side";

const centerSide =
  document.createElement("div");

centerSide.className =
  "bracket-center";

const centerMatches =
  document.createElement("div");

centerMatches.className =
  "center-matches";

const rightSide =
  document.createElement("div");

rightSide.className =
  "bracket-side right-side";

leftSide.appendChild(
  createStage(
    "last_32",
    stageNames.LAST_32,
    leftR32
  )
);

leftSide.appendChild(
  createStage(
    "last_16",
    stageNames.LAST_16,
    leftR16
  )
);

leftSide.appendChild(
  createStage(
    "quarter_finals",
    stageNames.QUARTER_FINALS,
    leftQF
  )
);

leftSide.appendChild(
  createStage(
    "semi_finals",
    stageNames.SEMI_FINALS,
    leftSF
  )
);

// ---------- CENTER ----------

centerMatches.appendChild(
  createStage(
    "final",
    stageNames.FINAL,
    finalMatch
  )
);

centerMatches.appendChild(
  createStage(
    "third_place",
    stageNames.THIRD_PLACE,
    thirdPlace
  )
);

centerSide.appendChild(centerMatches);

// ---------- RIGHT ----------

rightSide.appendChild(
  createStage(
    "semi_finals",
    stageNames.SEMI_FINALS,
    rightSF
  )
);

rightSide.appendChild(
  createStage(
    "quarter_finals",
    stageNames.QUARTER_FINALS,
    rightQF
  )
);

rightSide.appendChild(
  createStage(
    "last_16",
    stageNames.LAST_16,
    rightR16
  )
);

rightSide.appendChild(
  createStage(
    "last_32",
    stageNames.LAST_32,
    rightR32
  )
);

bracketContainer.appendChild(leftSide);
bracketContainer.appendChild(centerSide);
bracketContainer.appendChild(rightSide);
  });