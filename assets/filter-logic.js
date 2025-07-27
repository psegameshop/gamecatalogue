let currentCategory = 'all';

function initializeReleaseLabels() {
  const containers = Array.from(document.querySelectorAll('.filter-target'));
  const today = new Date();

  const pastOrTodayItems = containers
    .filter(div => {
      const itemDate = new Date(div.dataset.date);
      return itemDate <= today;
    })
    .sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));

  pastOrTodayItems.slice(0, 12).forEach(div => {
    div.dataset.category += ',new-release';
  });

  containers.forEach(div => {
    const itemDate = new Date(div.dataset.date);
    if (itemDate > today) {
      div.dataset.category += ',pre-order';
    }
  });
}

function filterDivs() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toUpperCase();
  const divs = document.getElementsByClassName('filter-target');

  let visibleCount = 0;

  for (let i = 0; i < divs.length; i++) {
    const txtValue = divs[i].textContent || divs[i].innerText;
    const categories = divs[i].getAttribute('data-category').split(',');
    const categoryMatch = (currentCategory === 'all' || categories.includes(currentCategory));
    const textMatch = txtValue.toUpperCase().indexOf(filter) > -1;

    const shouldShow = categoryMatch && textMatch;
    divs[i].style.display = shouldShow ? "" : "none";

    if (shouldShow) visibleCount++;
  }

  const noResultsDiv = document.getElementById("noResults");
  if (noResultsDiv) {
    noResultsDiv.style.display = visibleCount === 0 ? "block" : "none";
  }
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  filterByCategory('all');
}

function filterByCategory(category) {
  currentCategory = category;
  filterDivs();
}

function loadFilterDropdown() {
  fetch("./assets/filters.json")
    .then(response => response.json())
    .then(filters => {
      const select = document.getElementById("filterSelect");
      filters.forEach(f => {
        const option = document.createElement("option");
        option.value = f.id;
        option.textContent = f.label;
        if (f.id === "all") option.selected = true;
        select.appendChild(option);
      });
      
      updateClearFilterButtonState();

      select.addEventListener("change", (e) => {
        filterByCategory(e.target.value);
        updateClearFilterButtonState();
      });
    });

  document.getElementById("clearFilterBtn").addEventListener("click", () => {
  const select = document.getElementById("filterSelect");
  select.value = "all"; // assumes 'all' is the value for 💿 All Games
  filterByCategory("all");
  updateClearFilterButtonState();
  });
}

function updateClearFilterButtonState() {
  const select = document.getElementById("filterSelect");
  const button = document.getElementById("clearFilterBtn");

  const shouldDisable = (select.value === "all");

  button.disabled = shouldDisable;

  if (shouldDisable) {
    button.classList.add("disabled");
  } else {
    button.classList.remove("disabled");
  }
}

// Run on page load
window.onload = function () {
  initializeReleaseLabels();
  loadFilterDropdown();
  updateClearFilterButtonState()
  filterDivs();
};