fetch("data/groups.json")
  .then(response => response.json())
  .then(groups => {

    const container = document.getElementById("groups");

    for (const group in groups) {

      const card = document.createElement("div");
      card.className = "group-card";

      const title = document.createElement("h3");
      title.textContent = `Group ${group}`;

      const ul = document.createElement("ul");

      groups[group].forEach(team => {
        const li = document.createElement("li");
        li.textContent = team;
        ul.appendChild(li);
      });

      card.appendChild(title);
      card.appendChild(ul);

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

      card.innerHTML = `
        <div class="match-time">
          ${bdTime}
        </div>

        <div class="match-teams">
          ${match.home} vs ${match.away}
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

  });