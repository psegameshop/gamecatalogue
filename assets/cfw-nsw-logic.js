function initializeCfwFeatures() {
  const storageSelect = document.getElementById("storageSelect");
  const selectedGamesContainer = document.getElementById("selectedGames");
  const storageWarning = document.getElementById("storageWarning");
  const copyButton = document.getElementById("copyButton");
  const storageInfo = document.getElementById("storageInfo");
  const selectedSizeSpan = document.getElementById("selectedSize");

  let selectedGames = [];
  let currentStorageLimit = 0;

  // Load storage options from JSON
  fetch("./assets/storage-nsw.json")
    .then((res) => res.json())
    .then((storages) => {
      storages.forEach((s, idx) => {
        const option = document.createElement("option");
        option.value = s.usableBytes;
        option.textContent = s.name;
        if (idx === 0) {
          currentStorageLimit = s.usableBytes;
        }
        storageSelect.appendChild(option);
      });

      updateStorageStatus(); // display initial size info
      storageSelect.addEventListener("change", () => {
        currentStorageLimit = parseInt(storageSelect.value, 10);
        updateStorageStatus();
        updateLiteNgWarnings();
      });
    });

  // Handle click to select/deselect games
  document.querySelectorAll(".filter-target").forEach((div) => {
    div.addEventListener("click", () => {
      const title = div.querySelector(".game-title").textContent.trim();
      const size = parseInt(div.querySelector(".game-size")?.textContent.trim() || "0", 10);

      const imageContainer = div;
      const isSelected = selectedGames.some((g) => g.title === title);

      if (isSelected) {
        selectedGames = selectedGames.filter((g) => g.title !== title);
        imageContainer.classList.remove("selected", "selected-over");
      } else {
        selectedGames.push({ title, size });
        imageContainer.classList.add("selected");
      }

      updateSelectedList();
      updateStorageStatus();
    });
  });

  // Update selected list UI
  function updateSelectedList() {
  selectedGamesContainer.innerHTML = "";

  if (selectedGames.length === 0) {
    const emptyNotice = document.createElement("div");
    emptyNotice.textContent = "No games selected yet!";
    emptyNotice.style.fontStyle = "italic";
    emptyNotice.style.color = "#777";
    selectedGamesContainer.appendChild(emptyNotice);
    return;
  }

  selectedGames.forEach((game) => {
    const div = document.createElement("div");
    div.className = "selected-game";
    div.textContent = `${game.title} (${formatSize(game.size)})`;

    // Double-click to remove
    div.addEventListener("dblclick", () => {
      deselectGame(game.title);
    });

    // X button to remove
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.style.marginLeft = "8px";
    removeBtn.addEventListener("click", () => {
      deselectGame(game.title);
    });

    div.appendChild(removeBtn);
    selectedGamesContainer.appendChild(div);
  });
}

  function deselectGame(title) {
    selectedGames = selectedGames.filter((g) => g.title !== title);

    // Un-highlight from game grid
    document.querySelectorAll(".filter-target").forEach((div) => {
      const gameTitle = div.querySelector(".game-title")?.textContent.trim();
      if (gameTitle === title) {
        const container = div;
        container?.classList.remove("selected", "selected-over");
      }
    });

    updateSelectedList();
    updateStorageStatus();
  }

  // Check if total size exceeds storage
  function updateStorageStatus() {
  const totalSize = selectedGames.reduce((sum, g) => sum + g.size, 0);

  if (selectedSizeSpan) {
    selectedSizeSpan.textContent = formatSize(totalSize);
  }

  if (storageInfo) {
    storageInfo.textContent = `${formatSize(currentStorageLimit)}`;
  }

  // Update selected-over class for red border
  document.querySelectorAll(".filter-target").forEach(div => {
    const title = div.querySelector(".game-title")?.textContent.trim();
    const container = div;

    if (selectedGames.some(g => g.title === title)) {
      if (totalSize > currentStorageLimit) {
        container.classList.add("selected-over");
      } else {
        container.classList.remove("selected-over");
      }
    }
  });

  if (totalSize > currentStorageLimit) {
    storageWarning.textContent = `⚠️ Total size (${formatSize(totalSize)}) exceeds storage limit (${formatSize(currentStorageLimit)})`;
    storageWarning.style.display = "block";
  } else {
    storageWarning.style.display = "none";
  }

  updateCopyButtonState(totalSize);
}

  // Copy to clipboard
  copyButton.addEventListener("click", () => {
    const storageName = storageSelect.options[storageSelect.selectedIndex].text;

    const lines = selectedGames.map((g) => {
      return `${g.title} (${formatSize(g.size)})`;
    });

    const totalSize = selectedGames.reduce((sum, g) => sum + g.size, 0);
    const footer = `\n\n> ${selectedGames.length} game${selectedGames.length !== 1 ? 's' : ''} selected, total size: ${formatSize(totalSize)}`;

    const fullText = `${storageName}\n\n${lines.join("\n")}${footer}`;

    navigator.clipboard.writeText(fullText).then(() => {
      copyButton.textContent = "Copied!";
      setTimeout(() => (copyButton.textContent = "📋 Copy Titles to Clipboard"), 1500);
    });
  });

  // Format size in GB or MB
  function formatSize(bytes) {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb >= 1
      ? `${gb.toFixed(2)} GB`
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  //Update Copy Button state
  function updateCopyButtonState(totalSize) {
    const disabled = selectedGames.length === 0 || totalSize > currentStorageLimit;
    copyButton.disabled = disabled;

    if (disabled) {
      copyButton.classList.add("disabled");
    } else {
      copyButton.classList.remove("disabled");
    }
  }

  function updateLiteNgWarnings() {
    const selectedStorageText = storageSelect.options[storageSelect.selectedIndex].text.toLowerCase();
    const isLite = selectedStorageText.includes("lite");

    const allGames = document.querySelectorAll(".filter-target");

    allGames.forEach(div => {
      const categories = div.dataset.category.split(",");
      const isLiteNg = categories.includes("lite-ng");

      if (isLite && isLiteNg) {
        div.classList.add("lite-ng-warning");
      } else {
        div.classList.remove("lite-ng-warning");
      }
    });
  }

  updateSelectedList();
}
