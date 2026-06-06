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

    const container =
      document.getElementById("today-matches");

matches.forEach(match => {

  const card = document.createElement("div");
  card.className = "match-card";

  card.innerHTML = `
    <div class="match-time">
      ${match.time}
    </div>

    <div class="match-teams">
      ${match.home} vs ${match.away}
    </div>
  `;

  container.appendChild(card);

});

  });
