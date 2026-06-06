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
