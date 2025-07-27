let currentCategory = 'all';

function initializeReleaseLabels() {
  const containers = Array.from(document.querySelectorAll('.filter-target'));
  const today = new Date();

  // Convert and filter only those with a date on or before today
  const pastOrTodayItems = containers
    .filter(div => {
      const itemDate = new Date(div.dataset.date);
      return itemDate <= today;
    })
    .sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));

  // Tag top 12 as "new-release"
  pastOrTodayItems.slice(0, 12).forEach(div => {
    div.dataset.category += ',new-release';
  });

  // Tag future-dated items as "pre-order"
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

      for (let i = 0; i < divs.length; i++) {
        const txtValue = divs[i].textContent || divs[i].innerText;
        const categories = divs[i].getAttribute('data-category').split(',');
        const categoryMatch = (currentCategory === 'all' || categories.includes(currentCategory));
        const textMatch = txtValue.toUpperCase().indexOf(filter) > -1;

        divs[i].style.display = (categoryMatch && textMatch) ? "" : "none";
      }
    }

    function clearSearch() {
      document.getElementById('searchInput').value = '';
      filterByCategory('all');
    }

    function filterByCategory(category) {
      currentCategory = category;
      updateActiveButton(category);
      filterDivs();
    }

        function updateActiveButton(category) {
            let buttons = document.querySelectorAll('.buttons-container button');
            buttons.forEach(button => button.classList.remove('active'));

            let buttonId = category === 'all' ? 'allBtn' : category.toLowerCase() + 'Btn';
            document.getElementById(buttonId).classList.add('active');
        }

    // Run on page load
    window.onload = function () {
      initializeReleaseLabels();
      filterDivs();
    };