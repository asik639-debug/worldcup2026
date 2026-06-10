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
          <th>GD</th>
          <th>Pts</th>
        </tr>
      `;

      groups[group].forEach(team => {

        const row =
          document.createElement("tr");

        row.innerHTML = `
          <td>${team.position}</td>
          <td>${team.team}</td>
          <td>${team.playedGames}</td>
          <td>${team.goalDifference}</td>
          <td>${team.points}</td>
        `;

        table.appendChild(row);

      });

      card.appendChild(title);
      card.appendChild(table);

      container.appendChild(card);

    }

  });

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

      card.className = "match-card";

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
    ${matchDisplay}
  </div>
`;

      if (matchDay === bdToday) {
        todayContainer.appendChild(card);
      }

      else if (matchDay === nextMatchDay) {
        upcomingContainer.appendChild(card);
      }

    });

if (todayContainer.children.length === 0) {

  const message = document.createElement("p");

  message.textContent =
    "No matches today.";

  todayContainer.appendChild(message);

}

const knockoutStages = [
  "LAST_32",
  "LAST_16",
  "QUARTER_FINALS",
  "SEMI_FINALS",
  "THIRD_PLACE",
  "FINAL"
];

knockoutStages.forEach(stage => {

  const stageMatches =
    matches.filter(
      match => match.stage === stage
    );

  if (stageMatches.length === 0) {
    return;
  }

  const section =
    document.createElement("div");

  section.className =
    "bracket-stage";

  const title =
    document.createElement("h3");

  const stageNames = {
  LAST_32: "Round of 32",
  LAST_16: "Round of 16",
  QUARTER_FINALS: "Quarterfinals",
  SEMI_FINALS: "Semifinals",
  THIRD_PLACE: "Third Place Match",
  FINAL: "Final"
};

title.textContent =
  stageNames[stage];
  
  section.appendChild(title);

  stageMatches.forEach(match => {

    const game =
      document.createElement("div");

    game.className =
      "bracket-match";

    const home =
  match.home || "Winner TBD";

const away =
  match.away || "Winner TBD";

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

game.innerHTML = `
  <div>${home} vs ${away}</div>
  <div class="bracket-date">${date}</div>
`;

    section.appendChild(game);

  });

  bracketContainer.appendChild(section);

});

  });