document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("nav-top-container");
  if (!navContainer) return;

  fetch("./assets/nav-top.json")
    .then(res => res.json())
    .then(links => {
      const currentPage = window.location.pathname.split("/").pop();

      const ul = document.createElement("ul");
      ul.className = "nav nav-pills nav-fill";

      links.forEach(link => {
        const li = document.createElement("li");
        li.className = "nav-item";

        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.label;

        if (link.href === currentPage) {
          a.className = "nav-link disabled";
        } else {
          a.className = "nav-link";
        }

        li.appendChild(a);
        ul.appendChild(li);
      });

      navContainer.appendChild(ul);
    });
});