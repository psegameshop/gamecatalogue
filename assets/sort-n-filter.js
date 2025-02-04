let currentCategory = 'all';

        function filterDivs() {
            var input, filter, divs, i, txtValue;
            input = document.getElementById('searchInput');
            filter = input.value.toUpperCase();
            divs = document.getElementsByClassName('filter-target');
            
            for (i = 0; i < divs.length; i++) {
                txtValue = divs[i].textContent || divs[i].innerText;
                let categories = divs[i].getAttribute('data-category').split(','); // Convert categories into an array

                let categoryMatch = (currentCategory === 'all' || categories.includes(currentCategory));
                let textMatch = txtValue.toUpperCase().indexOf(filter) > -1;

                if (categoryMatch && textMatch) {
                    divs[i].style.display = "";
                } else {
                    divs[i].style.display = "none";
                }
            }
        }

        function clearSearch() {
            document.getElementById('searchInput').value = '';
            filterDivs();
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