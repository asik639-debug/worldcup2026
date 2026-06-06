fetch("data/groups.json")
  .then(response => response.json())
  .then(groups => {

    const container = document.getElementById("groups");

    for (const group in groups) {

      const title = document.createElement("h3");
      title.textContent = `Group ${group}`;
      container.appendChild(title);

      const ul = document.createElement("ul");

      groups[group].forEach(team => {
        const li = document.createElement("li");
        li.textContent = team;
        ul.appendChild(li);
      });

      container.appendChild(ul);
    }

  });

fetch("data/matches.json")
  .then(response => response.json())
  .then(matches => {

    const container =
      document.getElementById("today-matches");

    matches.forEach(match => {

      const div =
        document.createElement("div");

      div.innerHTML =
        `${match.home} vs ${match.away}
         - ${match.time}`;

      container.appendChild(div);

    });

  });
