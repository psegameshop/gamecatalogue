function renderGames(gameData) {
  const container = document.getElementById("gameList");
  container.innerHTML = "";

  gameData.forEach(game => {
    const gameDiv = document.createElement("div");
    gameDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 filter-target game-container";
    gameDiv.setAttribute("data-category", game.category);
    gameDiv.setAttribute("data-date", game.date);

    let sizeText = "";
    let sizeHiddenSpan = "";

    if (game.size) {
      const gbSize = game.size / (1024 * 1024 * 1024);
      sizeText = `<div class="game-size-visible">${gbSize.toFixed(2)} GB</div>`;
      sizeHiddenSpan = `<span class="game-size" style="display:none;">${game.size}</span>`;
    }

    gameDiv.innerHTML = `
      <div class="row">
        <div class="col-4 col-sm-12 game-image-container">
          <figure>
            <img class="img-fluid game-image" alt="${game.title}" src="${game.image}">
          </figure>
        </div>
        <div class="col-8 col-sm-12 py-2 game-title-container">
          <span class="game-title">${game.title}</span>
          ${sizeText}
          ${sizeHiddenSpan}
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