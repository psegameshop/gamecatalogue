function renderGames(gameData) {
  const container = document.getElementById("gameList");
  container.innerHTML = "";

  gameData.forEach(game => {
    const gameDiv = document.createElement("div");
    gameDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 filter-target";
    gameDiv.setAttribute("data-category", game.category);
    gameDiv.setAttribute("data-date", game.date);

    gameDiv.innerHTML = `
      <div class="row">
        <div class="col-4 col-sm-12 game-image-container">
          <figure>
            <img class="img-fluid game-image" alt="${game.title}" src="${game.image}">
          </figure>
        </div>
        <div class="col-8 col-sm-12 py-2 game-title-container">
          <span class="game-title">${game.title}</span>
        </div>
      </div>
    `;

    container.appendChild(gameDiv);
  });
}

function loadGamesFromJson(jsonFile) {
  return fetch(jsonFile)
    .then(response => {
      if (!response.ok) throw new Error("Failed to load JSON: " + response.status);
      return response.json();
    })
    .then(data => renderGames(data))
    .catch(error => console.error("Error loading games:", error));
}